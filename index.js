const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/", (req, res) => {
  console.log("📩 Saņemts pieprasījums no MT5:", req.body);
  // Vienkārša atbilde (pielāgosim vēlāk)
  res.json({ decision: "buy", reason: "RSI zem 30" });
});

app.get("/", (req, res) => {
  res.send("✅ MT5 AI Serveris darbojas!");
});

app.listen(port, () => {
  console.log(`🚀 Serveris darbojas uz http://localhost:${port}`);
});

