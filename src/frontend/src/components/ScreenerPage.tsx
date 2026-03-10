import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Info, Play, RefreshCw, Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useScreener } from "../hooks/useScreener";
import { useStockData } from "../hooks/useStockData";
import {
  DEFAULT_FILTERS,
  type ScreenerFilters,
  type SortConfig,
} from "../types/stock";
import { ApiKeyModal } from "./ApiKeyModal";
import { FilterPanel } from "./FilterPanel";
import { StockTable } from "./StockTable";
import { SummaryCards } from "./SummaryCards";

export function ScreenerPage() {
  const { stocks, isLoading, refetch, apiKey, saveApiKey, usingMockData } =
    useStockData();
  const [filters, setFilters] = useState<ScreenerFilters>(DEFAULT_FILTERS);
  const [search, setSearch] = useState("");
  const [customQuery, setCustomQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [sort, setSort] = useState<SortConfig>({
    field: "marketCap",
    direction: "desc",
  });
  const [apiKeyOpen, setApiKeyOpen] = useState(false);

  const filtered = useScreener(stocks, filters, search, activeQuery, sort);

  const handleQueryApply = () => {
    setActiveQuery(customQuery);
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 min-h-full">
      {/* Demo banner */}
      {usingMockData && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          data-ocid="demo.banner"
          className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm"
        >
          <Info className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="text-muted-foreground">
            Using <span className="text-primary font-medium">sample data</span>{" "}
            — add an API key for live market data.
          </span>
          <Button
            variant="ghost"
            size="sm"
            data-ocid="apikey.open_modal_button"
            onClick={() => setApiKeyOpen(true)}
            className="ml-auto h-7 px-3 text-xs text-primary hover:bg-primary/10"
          >
            Configure API Key
          </Button>
        </motion.div>
      )}

      {/* Summary */}
      <SummaryCards
        totalStocks={stocks.length}
        matchCount={filtered.length}
        stocks={filtered.length > 0 ? filtered : stocks}
      />

      {/* Search + refresh */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            data-ocid="search.search_input"
            placeholder="Search ticker or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-input border-border"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => refetch()}
          className="border-border hover:border-primary/50 hover:text-primary"
          title="Refresh data"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        {!usingMockData && (
          <Badge
            variant="outline"
            className="self-center border-gain text-gain text-xs"
          >
            Live Data
          </Badge>
        )}
      </div>

      {/* Custom query */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            data-ocid="query.input"
            placeholder="Custom filter: PE < 20 and ROE > 15 and RSI < 70"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleQueryApply()}
            className="bg-input border-border font-mono text-sm"
          />
        </div>
        <Button
          data-ocid="query.submit_button"
          onClick={handleQueryApply}
          className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Play className="h-3.5 w-3.5" />
          Apply
        </Button>
        {activeQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setActiveQuery("");
              setCustomQuery("");
            }}
            className="text-xs text-muted-foreground"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Main content: filters + table */}
      <div className="flex flex-col xl:flex-row gap-4 flex-1">
        <div className="xl:w-72 flex-shrink-0">
          <FilterPanel filters={filters} onChange={setFilters} />
        </div>
        <div className="flex-1 min-w-0">
          <StockTable
            stocks={filtered}
            isLoading={isLoading}
            sort={sort}
            onSortChange={setSort}
          />
        </div>
      </div>

      <ApiKeyModal
        open={apiKeyOpen}
        onOpenChange={setApiKeyOpen}
        currentKey={apiKey}
        onSave={saveApiKey}
      />
    </div>
  );
}
