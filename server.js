const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");
const app = express();
let port = 3000;

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.static("public")); // Serve static files from 'public' folder

const questionsDb = new sqlite3.Database("questions.db", (err) => {
  if (err)
    console.error("Error connecting to questions database:", err.message);
  else console.log("Connected to questions database.");
});

questionsDb.run(
  `
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    options TEXT NOT NULL,
    answer TEXT NOT NULL
  )
`,
  (err) => {
    if (err) console.error("Error creating questions table:", err.message);
  }
);

const scoresDb = new sqlite3.Database("scores.db", (err) => {
  if (err) console.error("Error connecting to scores database:", err.message);
  else console.log("Connected to scores database.");
});

scoresDb.run(
  `
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    score INTEGER NOT NULL
  )
`,
  (err) => {
    if (err) console.error("Error creating scores table:", err.message);
  }
);

app.get("/", (req, res) => {
  res.send("Quiz Server is running. Use /questions to get quiz data.");
});

app.get("/questions", (req, res) => {
  questionsDb.all("SELECT * FROM questions", [], (err, rows) => {
    if (err) {
      console.error("Error fetching questions:", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    console.log("Sending questions:", rows.length, "found");
    const questions = rows.map((row) => ({
      question: row.question,
      options: JSON.parse(row.options),
      answer: row.answer,
    }));
    res.json(questions);
  });
});

app.post("/save-score", (req, res) => {
  const { name, timestamp, score } = req.body;
  if (!name || !timestamp || score === undefined) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  scoresDb.run(
    `INSERT INTO scores (name, timestamp, score) VALUES (?, ?, ?)`,
    [name, timestamp, score],
    (err) => {
      if (err) {
        console.error("Error saving score:", err.message);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: "Score saved successfully" });
    }
  );
});

app.get("/scores", (req, res) => {
  scoresDb.all("SELECT * FROM scores", [], (err, rows) => {
    if (err) {
      console.error("Error fetching scores:", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get("/all-questions", (req, res) => {
  questionsDb.all("SELECT * FROM questions", [], (err, rows) => {
    if (err) {
      console.error("Error fetching all questions:", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get("/top-scores", (req, res) => {
  scoresDb.all(
    "SELECT name, score, timestamp FROM scores ORDER BY score DESC LIMIT 5",
    [],
    (err, rows) => {
      if (err) {
        console.error("Error fetching top scores:", err.message);
        res.status(500).json({ error: err.message });
        return;
      }
      console.log("Sending top scores:", rows);
      res.json(rows);
    }
  );
});

app.get("/all-results", (req, res) => {
  scoresDb.all(
    "SELECT name, timestamp, score FROM scores ORDER BY timestamp ASC",
    [],
    (err, rows) => {
      if (err) {
        console.error("Error fetching all scores:", err.message);
        res.status(500).send("Error loading results");
        return;
      }
      let html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>All Quiz Results</title>
          <link rel="stylesheet" href="/Quizziz.css">
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: "Poppins", sans-serif;
              min-height: 100vh;
              background: linear-gradient(135deg, #ff9a9e, #fad0c4, #c4e0e5, #a1c4fd, #c2e9fb);
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 20px;
            }
            .start-container {
              background: linear-gradient(145deg, #ffffff, #fff0f6);
              border-radius: 25px;
              padding: 40px;
              width: 100%;
              max-width: 750px;
              box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
              border: 4px solid rgba(255, 255, 255, 0.8);
              text-align: center;
            }
            h1 {
              color: #ff4757;
              font-size: 2.8em;
              margin-bottom: 25px;
              text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
            }
            p {
              color: #2d3436;
              font-size: 1.3em;
              margin-bottom: 30px;
            }
            #results-list {
              margin-top: 35px;
              text-align: left;
            }
            .result-item {
              margin-bottom: 25px;
              padding: 25px;
              background: #ffffff;
              border-radius: 15px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
              transition: transform 0.2s;
            }
            .result-item:hover {
              transform: translateY(-5px);
            }
            .result-item p {
              margin: 8px 0;
              color: #2d3436;
            }
            .correct-answer {
              color: #2ed573;
              font-weight: 600;
            }
            .wrong-answer {
              color: #ff4757;
              font-weight: 600;
            }
            .score-medium {
              color: #ffa502;
              font-weight: 600;
            }
            .close-btn {
              background: #3742fa;
              color: white;
              padding: 15px 35px;
              border: none;
              border-radius: 35px;
              cursor: pointer;
              font-size: 1.3em;
              transition: transform 0.2s, background 0.3s, box-shadow 0.3s;
              box-shadow: 0 6px 18px rgba(55, 66, 250, 0.4);
              margin: 10px;
            }
            .close-btn:hover {
              transform: translateY(-4px);
              background: #2f36d6;
              box-shadow: 0 10px 25px rgba(55, 66, 250, 0.6);
            }
          </style>
        </head>
        <body>
          <div class="start-container">
            <h1>All Quiz Results</h1>
            <p>Explore how everyone performed!</p>
            <div id="results-list">
    `;
      if (rows.length === 0) {
        html += `<p>No results available yet.</p>`;
      } else {
        rows.forEach((row) => {
          const date = new Date(row.timestamp).toLocaleString();
          const scoreClass =
            row.score >= 8
              ? "correct-answer"
              : row.score >= 5
              ? "score-medium"
              : "wrong-answer";
          html += `
          <div class="result-item">
            <p><strong>Name:</strong> ${row.name}</p>
            <p><strong>Date & Time:</strong> ${date}</p>
            <p><strong>Score:</strong> <span class="${scoreClass}">${row.score}/10</span></p>
          </div>
        `;
        });
      }
      html += `
            </div>
            <p>Total Participants: ${rows.length}</p>
            <button onclick="window.close()" class="close-btn">Close</button>
          </div>
        </body>
      </html>
    `;
      res.send(html);
    }
  );
});

function startServer(currentPort) {
  const server = app.listen(currentPort, () => {
    console.log(`Server running at http://localhost:${currentPort}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(
        `Port ${currentPort} is in use, trying ${currentPort + 1}...`
      );
      startServer(currentPort + 1);
    } else {
      console.error("Server error:", err.message);
    }
  });
}

startServer(port);

process.on("SIGINT", () => {
  questionsDb.close((err) => {
    if (err) console.error("Error closing questions database:", err.message);
    else console.log("Questions database connection closed.");
  });
  scoresDb.close((err) => {
    if (err) console.error("Error closing scores database:", err.message);
    else console.log("Scores database connection closed.");
    process.exit(0);
  });
});
