export interface StockData {
  ticker: string;
  companyName: string;
  price: number;
  changePercent: number;
  marketCap: number; // in billions
  peRatio: number;
  debtToEquity: number;
  roce: number;
  roe: number;
  rsi: number;
  ma50: number;
  ma200: number;
  sector: string;
}

export interface FilterRange {
  min: number;
  max: number;
}

export interface ScreenerFilters {
  pe: FilterRange;
  debtToEquity: FilterRange;
  roce: FilterRange;
  roe: FilterRange;
  marketCap: FilterRange;
  rsi: FilterRange;
  ma50Dev: FilterRange; // % deviation from 50-day MA
  ma200Dev: FilterRange; // % deviation from 200-day MA
}

export const DEFAULT_FILTERS: ScreenerFilters = {
  pe: { min: 0, max: 100 },
  debtToEquity: { min: 0, max: 10 },
  roce: { min: 0, max: 100 },
  roe: { min: 0, max: 300 },
  marketCap: { min: 0, max: 3000 },
  rsi: { min: 0, max: 100 },
  ma50Dev: { min: -50, max: 50 },
  ma200Dev: { min: -50, max: 50 },
};

export type SortField = keyof StockData;
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}
