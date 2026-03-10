import { BarChart3, Filter, TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import type { StockData } from "../types/stock";

interface SummaryCardsProps {
  totalStocks: number;
  matchCount: number;
  stocks: StockData[];
}

export function SummaryCards({
  totalStocks,
  matchCount,
  stocks,
}: SummaryCardsProps) {
  const sorted = [...stocks].sort((a, b) => b.changePercent - a.changePercent);
  const topGainer = sorted[0];
  const topLoser = sorted[sorted.length - 1];

  const cards = [
    {
      label: "Total Stocks",
      value: totalStocks.toString(),
      sub: "in universe",
      icon: BarChart3,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Matches Found",
      value: matchCount.toString(),
      sub: `${((matchCount / Math.max(totalStocks, 1)) * 100).toFixed(0)}% match rate`,
      icon: Filter,
      color: "text-chart-2",
      bg: "bg-chart-2/10",
    },
    {
      label: "Top Gainer",
      value: topGainer ? topGainer.ticker : "—",
      sub: topGainer ? `+${topGainer.changePercent.toFixed(2)}%` : "",
      icon: TrendingUp,
      color: "text-gain",
      bg: "bg-gain-subtle",
      subClass: "text-gain",
    },
    {
      label: "Top Loser",
      value: topLoser ? topLoser.ticker : "—",
      sub: topLoser ? `${topLoser.changePercent.toFixed(2)}%` : "",
      icon: TrendingDown,
      color: "text-loss",
      bg: "bg-loss-subtle",
      subClass: "text-loss",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.35 }}
          className="relative overflow-hidden rounded-lg border border-border bg-card p-4"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                {card.label}
              </p>
              <p className="text-2xl font-display font-bold text-foreground">
                {card.value}
              </p>
              <p
                className={`text-xs mt-0.5 ${card.subClass ?? "text-muted-foreground"}`}
              >
                {card.sub}
              </p>
            </div>
            <div className={`rounded-md p-2 ${card.bg}`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
          </div>
          {/* decorative stripe */}
          <div
            className={`absolute bottom-0 left-0 h-0.5 w-full opacity-30 ${card.bg}`}
          />
        </motion.div>
      ))}
    </div>
  );
}
