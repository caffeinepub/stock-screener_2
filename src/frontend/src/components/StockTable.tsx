import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp, ArrowUpDown, SearchX } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { SortConfig, SortField, StockData } from "../types/stock";

interface StockTableProps {
  stocks: StockData[];
  isLoading: boolean;
  sort: SortConfig;
  onSortChange: (sort: SortConfig) => void;
}

function formatMCap(val: number): string {
  if (val >= 1000) return `$${(val / 1000).toFixed(2)}T`;
  if (val <= 0) return "—";
  return `$${val.toFixed(0)}B`;
}

function formatNum(val: number, decimals = 1): string {
  if (val === 999 || val === 0) return "—";
  return val.toFixed(decimals);
}

function ChangeCell({ val }: { val: number }) {
  const isPos = val >= 0;
  return (
    <span
      className={`font-mono text-xs font-medium ${isPos ? "text-gain" : "text-loss"}`}
    >
      {isPos ? "+" : ""}
      {val.toFixed(2)}%
    </span>
  );
}

function RsiCell({ val }: { val: number }) {
  const isOverbought = val > 70;
  const isOversold = val < 30;
  const cls = isOverbought
    ? "text-loss"
    : isOversold
      ? "text-gain"
      : "text-foreground";
  return <span className={`font-mono text-xs ${cls}`}>{val.toFixed(1)}</span>;
}

function MaCell({ price, ma }: { price: number; ma: number }) {
  if (!ma) return <span className="text-muted-foreground">—</span>;
  const above = price >= ma;
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${above ? "bg-gain" : "bg-loss"}`}
      />
      <span className="font-mono text-xs text-foreground">
        ${ma.toFixed(2)}
      </span>
    </div>
  );
}

type ColDef = {
  key: SortField;
  label: string;
  className?: string;
  render: (s: StockData) => React.ReactNode;
};

const COLUMNS: ColDef[] = [
  {
    key: "ticker",
    label: "Ticker",
    className: "w-20",
    render: (s) => (
      <span className="font-mono font-bold text-primary text-xs">
        {s.ticker}
      </span>
    ),
  },
  {
    key: "companyName",
    label: "Company",
    className: "min-w-[140px] max-w-[180px]",
    render: (s) => (
      <span
        className="text-xs truncate block max-w-[180px]"
        title={s.companyName}
      >
        {s.companyName}
      </span>
    ),
  },
  {
    key: "marketCap",
    label: "Mkt Cap",
    render: (s) => (
      <span className="font-mono text-xs">{formatMCap(s.marketCap)}</span>
    ),
  },
  {
    key: "peRatio",
    label: "P/E",
    render: (s) => (
      <span className="font-mono text-xs">{formatNum(s.peRatio)}</span>
    ),
  },
  {
    key: "debtToEquity",
    label: "D/E",
    render: (s) => {
      const val = s.debtToEquity;
      const high = val > 3;
      return (
        <span className={`font-mono text-xs ${high ? "text-loss" : ""}`}>
          {formatNum(val, 2)}
        </span>
      );
    },
  },
  {
    key: "roce",
    label: "ROCE%",
    render: (s) => {
      const high = s.roce > 20;
      return (
        <span className={`font-mono text-xs ${high ? "text-gain" : ""}`}>
          {formatNum(s.roce)}%
        </span>
      );
    },
  },
  {
    key: "roe",
    label: "ROE%",
    render: (s) => {
      const val = s.roe;
      if (val === 999)
        return <span className="text-muted-foreground text-xs">N/M</span>;
      const high = val > 20;
      return (
        <span className={`font-mono text-xs ${high ? "text-gain" : ""}`}>
          {formatNum(val)}%
        </span>
      );
    },
  },
  {
    key: "rsi",
    label: "RSI",
    render: (s) => <RsiCell val={s.rsi} />,
  },
  {
    key: "ma50",
    label: "50-day MA",
    render: (s) => <MaCell price={s.price} ma={s.ma50} />,
  },
  {
    key: "ma200",
    label: "200-day MA",
    render: (s) => <MaCell price={s.price} ma={s.ma200} />,
  },
  {
    key: "price",
    label: "Price",
    render: (s) => (
      <span className="font-mono text-xs font-semibold">
        ${s.price.toFixed(2)}
      </span>
    ),
  },
  {
    key: "changePercent",
    label: "Chg%",
    render: (s) => <ChangeCell val={s.changePercent} />,
  },
];

function SortIcon({ field, sort }: { field: SortField; sort: SortConfig }) {
  if (sort.field !== field)
    return <ArrowUpDown className="h-3 w-3 opacity-30" />;
  return sort.direction === "asc" ? (
    <ArrowUp className="h-3 w-3 text-primary" />
  ) : (
    <ArrowDown className="h-3 w-3 text-primary" />
  );
}

export function StockTable({
  stocks,
  isLoading,
  sort,
  onSortChange,
}: StockTableProps) {
  const handleSort = (field: SortField) => {
    if (sort.field === field) {
      onSortChange({
        field,
        direction: sort.direction === "asc" ? "desc" : "asc",
      });
    } else {
      onSortChange({ field, direction: "desc" });
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto scrollbar-dark">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              {COLUMNS.map((col) => (
                <TableHead
                  key={col.key}
                  className={`text-xs font-semibold text-muted-foreground cursor-pointer select-none whitespace-nowrap py-3 ${col.className ?? ""}`}
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <SortIcon field={col.key} sort={sort} />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow data-ocid="table.loading_state">
                <TableCell colSpan={COLUMNS.length} className="py-8">
                  <div className="space-y-2">
                    {Array.from({ length: 8 }, (_, i) => String(i)).map((k) => (
                      <Skeleton key={k} className="h-8 w-full bg-muted/30" />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ) : stocks.length === 0 ? (
              <TableRow data-ocid="table.empty_state">
                <TableCell
                  colSpan={COLUMNS.length}
                  className="py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <SearchX className="h-8 w-8 opacity-40" />
                    <p className="text-sm font-medium">
                      No stocks match your filters
                    </p>
                    <p className="text-xs">
                      Try adjusting or resetting the filter criteria
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              stocks.map((stock, index) => (
                <motion.tr
                  key={stock.ticker}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(index * 0.02, 0.3) }}
                  data-ocid={index < 10 ? `stock.row.${index + 1}` : undefined}
                  className="border-border table-row-hover transition-colors group"
                >
                  {COLUMNS.map((col) => (
                    <TableCell
                      key={col.key}
                      className="py-2.5 px-4 whitespace-nowrap"
                    >
                      {col.render(stock)}
                    </TableCell>
                  ))}
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && stocks.length > 0 && (
        <div className="px-4 py-2.5 border-t border-border bg-muted/10 text-xs text-muted-foreground">
          Showing {stocks.length} stock{stocks.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
