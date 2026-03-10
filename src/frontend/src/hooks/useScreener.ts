import { useMemo } from "react";
import type { ScreenerFilters, SortConfig, StockData } from "../types/stock";

function ma50Dev(stock: StockData): number {
  if (!stock.ma50) return 0;
  return ((stock.price - stock.ma50) / stock.ma50) * 100;
}

function ma200Dev(stock: StockData): number {
  if (!stock.ma200) return 0;
  return ((stock.price - stock.ma200) / stock.ma200) * 100;
}

function applyFilters(
  stocks: StockData[],
  filters: ScreenerFilters,
  search: string,
): StockData[] {
  return stocks.filter((s) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !s.ticker.toLowerCase().includes(q) &&
        !s.companyName.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (s.peRatio < filters.pe.min || s.peRatio > filters.pe.max) return false;
    if (
      s.debtToEquity < filters.debtToEquity.min ||
      s.debtToEquity > filters.debtToEquity.max
    )
      return false;
    if (s.roce < filters.roce.min || s.roce > filters.roce.max) return false;
    if (s.roe < filters.roe.min || s.roe > filters.roe.max) return false;
    if (
      s.marketCap < filters.marketCap.min ||
      s.marketCap > filters.marketCap.max
    )
      return false;
    if (s.rsi < filters.rsi.min || s.rsi > filters.rsi.max) return false;
    const dev50 = ma50Dev(s);
    if (dev50 < filters.ma50Dev.min || dev50 > filters.ma50Dev.max)
      return false;
    const dev200 = ma200Dev(s);
    if (dev200 < filters.ma200Dev.min || dev200 > filters.ma200Dev.max)
      return false;
    return true;
  });
}

// Custom query parser: supports "PE < 20 and ROE > 15 or RSI <= 70"
function parseCustomQuery(query: string, stock: StockData): boolean {
  if (!query.trim()) return true;

  const fieldMap: Record<string, number> = {
    pe: stock.peRatio,
    roi: stock.roe,
    roe: stock.roe,
    roce: stock.roce,
    de: stock.debtToEquity,
    rsi: stock.rsi,
    ma50: stock.ma50,
    ma200: stock.ma200,
    mcap: stock.marketCap,
    price: stock.price,
    change: stock.changePercent,
  };

  // Split by " or " first, then by " and "
  const orParts = query.toLowerCase().split(/\bor\b/);
  return orParts.some((orPart) => {
    const andParts = orPart.split(/\band\b/);
    return andParts.every((condition) => {
      const match = condition
        .trim()
        .match(/^(\w+)\s*(<=|>=|<|>|=|!=)\s*([\d.]+)$/);
      if (!match) return true; // ignore malformed
      const [, field, op, valStr] = match;
      const val = Number.parseFloat(valStr);
      const stockVal = fieldMap[field];
      if (stockVal === undefined) return true;
      switch (op) {
        case "<":
          return stockVal < val;
        case ">":
          return stockVal > val;
        case "<=":
          return stockVal <= val;
        case ">=":
          return stockVal >= val;
        case "=":
          return stockVal === val;
        case "!=":
          return stockVal !== val;
        default:
          return true;
      }
    });
  });
}

function applyCustomQuery(stocks: StockData[], query: string): StockData[] {
  if (!query.trim()) return stocks;
  return stocks.filter((s) => parseCustomQuery(query, s));
}

function sortStocks(stocks: StockData[], sort: SortConfig): StockData[] {
  return [...stocks].sort((a, b) => {
    const aVal = a[sort.field];
    const bVal = b[sort.field];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sort.direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    const an = aVal as number;
    const bn = bVal as number;
    return sort.direction === "asc" ? an - bn : bn - an;
  });
}

export function useScreener(
  stocks: StockData[],
  filters: ScreenerFilters,
  search: string,
  customQuery: string,
  sort: SortConfig,
) {
  return useMemo(() => {
    let result = applyFilters(stocks, filters, search);
    result = applyCustomQuery(result, customQuery);
    result = sortStocks(result, sort);
    return result;
  }, [stocks, filters, search, customQuery, sort]);
}
