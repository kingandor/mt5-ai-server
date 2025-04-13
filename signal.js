import fs from "fs-extra";

const STRATEGY_FILE = "ai-strategy.json";

export async function getSignal({ timestamp, rsi, direction }) {
  if (!(await fs.pathExists(STRATEGY_FILE))) {
    return { decision: "WAIT", reason: "Nav stratēģijas datu." };
  }

  const strategy = await fs.readJson(STRATEGY_FILE);
  const hour = new Date(timestamp).getUTCHours();

  let decision = "WAIT";
  let reason = "";

  if (Number(hour) === Number(strategy.best_hour) && rsi < 30 && direction === "BUY") {
    decision = "BUY";
    reason = "Laba stunda un RSI zem 30";
  } else if (rsi > 70 && direction === "SELL") {
    decision = "SELL";
    reason = "RSI virs 70";
  } else {
    reason = "Nav pārliecinošu signālu";
  }

  return { decision, reason };
}
