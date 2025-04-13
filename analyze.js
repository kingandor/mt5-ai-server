import fs from "fs-extra";

const TRADES_FILE = "trades.json";
const STRATEGY_FILE = "ai-strategy.json";

export async function analyzeTrades() {
  if (!(await fs.pathExists(TRADES_FILE))) return { message: "Nav darījumu datu." };

  const trades = await fs.readJson(TRADES_FILE);
  if (trades.length === 0) return { message: "Datu fails ir tukšs." };

  let stats = {
    total: trades.length,
    profitable: 0,
    loss: 0,
    avg_profit: 0,
    best_hour: null,
    hour_stats: {},
  };

  for (const trade of trades) {
    const date = new Date(trade.timestamp);
    const hour = date.getUTCHours();

    stats.hour_stats[hour] = stats.hour_stats[hour] || { total: 0, profit: 0 };
    stats.hour_stats[hour].total += 1;
    stats.hour_stats[hour].profit += trade.profit_points;

    if (trade.profit_points > 0) stats.profitable += 1;
    else stats.loss += 1;
  }

  stats.avg_profit = trades.reduce((sum, t) => sum + t.profit_points, 0) / trades.length;

  let bestHour = null;
  let bestAvg = -Infinity;
  for (const hour in stats.hour_stats) {
    const h = stats.hour_stats[hour];
    const avg = h.profit / h.total;
    if (avg > bestAvg) {
      bestAvg = avg;
      bestHour = hour;
    }
  }
  stats.best_hour = bestHour;

  await fs.writeJson(STRATEGY_FILE, stats, { spaces: 2 });

  return { message: "✅ AI analīze pabeigta", strategy: stats };
}
