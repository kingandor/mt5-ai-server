import express from "express";
import fs from "fs-extra";
import cors from "cors";
import path from "path";
import { analyzeTrades } from "./analyze.js";
import { getSignal } from "./signal.js";

const app = express();
const PORT = process.env.PORT || 3000;
const TRADES_FILE = path.resolve("trades.json");

app.use(cors());
app.use(express.json());

app.post("/save", async (req, res) => {
  try {
    const trade = req.body;
    if (!trade || !trade.symbol || !trade.entry_price || !trade.exit_price) {
      return res.status(400).send("❌ Nepilnīgi dati");
    }

    let trades = [];
    if (await fs.pathExists(TRADES_FILE)) {
      trades = await fs.readJson(TRADES_FILE);
    }

    trades.push(trade);
    await fs.writeJson(TRADES_FILE, trades, { spaces: 2 });

    console.log("✅ Saņemts darījums:", trade.symbol, trade.direction, trade.profit_points);
    res.status(200).send("✅ Saglabāts");
  } catch (err) {
    console.error("❌ Kļūda saglabājot darījumu:", err);
    res.status(500).send("❌ Servera kļūda");
  }
});

app.post("/analyze", async (req, res) => {
  const result = await analyzeTrades();
  res.json(result);
});

app.post("/signal", async (req, res) => {
  const result = await getSignal(req.body);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`🚀 Serveris darbojas uz http://localhost:${PORT}`);
});
