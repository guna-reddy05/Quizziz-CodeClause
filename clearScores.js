const sqlite3 = require("sqlite3").verbose();

// Connect to the scores database
const scoresDb = new sqlite3.Database("scores.db", (err) => {
  if (err) {
    console.error("Error connecting to scores database:", err.message);
    return;
  }
  console.log("Connected to scores database.");
});

// Clear all scores
scoresDb.run("DELETE FROM scores", (err) => {
  if (err) {
    console.error("Error clearing scores:", err.message);
  } else {
    console.log("All scores cleared successfully.");
  }

  // Close the database connection
  scoresDb.close((err) => {
    if (err) console.error("Error closing database:", err.message);
    else console.log("Database connection closed.");
  });
});
