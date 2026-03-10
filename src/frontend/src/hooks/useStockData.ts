import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { MOCK_STOCKS } from "../data/mockStocks";
import type { StockData } from "../types/stock";
import { useActor } from "./useActor";

const LOCAL_STORAGE_KEY = "fmp_api_key";

interface FMPQuote {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  marketCap: number;
  pe: number | null;
}

function parseFmpQuotes(json: string): StockData[] {
  try {
    const quotes = JSON.parse(json) as FMPQuote[];
    if (!Array.isArray(quotes) || quotes.length === 0) return [];
    return quotes.map((q) => ({
      ticker: q.symbol,
      companyName: q.name || q.symbol,
      price: q.price ?? 0,
      changePercent: q.changesPercentage ?? 0,
      marketCap: q.marketCap ? q.marketCap / 1e9 : 0,
      peRatio: q.pe ?? 0,
      debtToEquity: 0,
      roce: 0,
      roe: 0,
      rsi: 50,
      ma50: q.price ?? 0,
      ma200: q.price ?? 0,
      sector: "Unknown",
    }));
  } catch {
    return [];
  }
}

export function useStockData() {
  const { actor, isFetching: actorFetching } = useActor();
  const [apiKey, setApiKeyState] = useState<string>(
    () => localStorage.getItem(LOCAL_STORAGE_KEY) || "",
  );
  const [usingMockData, setUsingMockData] = useState(true);

  const saveApiKey = useCallback((key: string) => {
    setApiKeyState(key);
    localStorage.setItem(LOCAL_STORAGE_KEY, key);
  }, []);

  const query = useQuery<StockData[]>({
    queryKey: ["stockData", apiKey],
    queryFn: async () => {
      if (!actor || !apiKey) {
        setUsingMockData(true);
        return MOCK_STOCKS;
      }
      try {
        const result = await actor.fetchScreenerData(apiKey);
        if ("err" in result) {
          setUsingMockData(true);
          return MOCK_STOCKS;
        }
        const parsed = parseFmpQuotes(result.ok);
        if (parsed.length === 0) {
          setUsingMockData(true);
          return MOCK_STOCKS;
        }
        setUsingMockData(false);
        return parsed;
      } catch {
        setUsingMockData(true);
        return MOCK_STOCKS;
      }
    },
    enabled: !actorFetching,
    staleTime: 60_000,
    retry: 1,
  });

  return {
    stocks: query.data ?? MOCK_STOCKS,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    apiKey,
    saveApiKey,
    usingMockData,
  };
}
