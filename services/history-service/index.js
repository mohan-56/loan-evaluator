const express = require("express");
const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();

const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
const db = new sqlite3.Database(":memory:", (err) => {
  if (err) console.error("Database error:", err);
  db.run(
    "CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY AUTOINCREMENT, income TEXT, creditScore TEXT, loanAmount TEXT, status TEXT, reason TEXT)"
  );
});

app.post("/api/history", (req, res) => {
  const { income, creditScore, loanAmount, status, reason } = req.body;
  if (!income || !creditScore || !loanAmount || !status) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  db.run(
    "INSERT INTO history (income, creditScore, loanAmount, status, reason) VALUES (?, ?, ?, ?, ?)",
    [income, creditScore, loanAmount, status, reason || ""],
    (err) => {
      if (err) {
        console.error("Error:", err);
        return res.status(500).json({ error: "Failed to save history" });
      }
      res.json({ message: "History saved" });
    }
  );
});

app.get("/api/history", (req, res) => {
  db.all("SELECT * FROM history", [], (err, rows) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).json({ error: "Failed to fetch history" });
    }
    res.json(rows);
  });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`History Service running on port ${PORT}`));