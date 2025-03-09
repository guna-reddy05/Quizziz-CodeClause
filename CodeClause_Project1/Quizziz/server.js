const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
const port = 3000;

app.use(express.json());
app.use(
  cors({
    origin: "*", // Allow all origins (for development); change to 'http://127.0.0.1:8080' for specific origin
    methods: ["GET", "POST"], // Allow these methods
    allowedHeaders: ["Content-Type"], // Allow this header
  })
);

const questionsDb = new sqlite3.Database("questions.db", (err) => {
  if (err) console.error(err.message);
  console.log("Connected to questions database.");
});

questionsDb.run(`
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    options TEXT NOT NULL,
    answer TEXT NOT NULL
  )
`);

const scoresDb = new sqlite3.Database("scores.db", (err) => {
  if (err) console.error(err.message);
  console.log("Connected to scores database.");
});

scoresDb.run(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    score INTEGER NOT NULL
  )
`);

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
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get("/all-questions", (req, res) => {
  questionsDb.all("SELECT * FROM questions", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
