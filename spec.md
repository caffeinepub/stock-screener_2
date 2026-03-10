# Stock Screener

## Current State
New project with no existing implementation.

## Requested Changes (Diff)

### Add
- Dark-themed dashboard layout with top navigation bar and collapsible sidebar
- Search bar to look up stock tickers
- Interactive filter panel with sliders and inputs for:
  - Fundamentals: P/E Ratio, Debt-to-Equity, ROCE, ROE, Market Cap
  - Technicals: RSI, 50-day MA, 200-day MA
- Sortable and filterable data table with columns: Ticker, Company Name, Market Cap, P/E, D/E, ROCE, ROE, RSI, 50-day MA, 200-day MA, Current Price, Change %
- Summary cards: Total stocks screened, Matches found, Top movers
- Custom query input (e.g. "PE < 20 and ROE > 15") for dynamic filtering
- Color-coded green/red indicators for positive/negative values
- Loading states and error handling
- HTTP outcalls from Motoko backend to Financial Modeling Prep (or Alpha Vantage) for real-time stock data
- All filtering and data processing logic in TypeScript on the frontend

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan
1. Select `http-outcalls` Caffeine component
2. Generate Motoko backend with endpoints:
   - `getStockQuotes(tickers: [Text]) -> async [StockQuote]` — fetches bulk quote data from FMP
   - `getStockList() -> async [StockMeta]` — fetches a list of tradeable stocks
   - `getStockDetails(ticker: Text) -> async ?StockDetail` — fetches fundamental + technical data for a single ticker
3. Frontend:
   - App shell: dark sidebar + topbar layout
   - ScreenerPage: summary cards, custom query input, filter panel, results table
   - FilterPanel component: range sliders + number inputs per metric
   - StockTable component: sortable columns, color-coded cells
   - useScreener hook: applies all filters + custom query parser to stock data
   - useStockData hook: fetches data from backend, handles loading/error state
