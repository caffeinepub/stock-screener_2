import Outcall "http-outcalls/outcall";

actor {

  // Transform function required by http outcalls
  public query func transform(input : Outcall.TransformationInput) : async Outcall.TransformationOutput {
    Outcall.transform(input);
  };

  // Fetch stock screener data from Financial Modeling Prep
  // Returns raw JSON string for frontend to parse
  public func fetchScreenerData(apiKey : Text) : async { #ok : Text; #err : Text } {
    let tickers = "AAPL,MSFT,GOOGL,AMZN,NVDA,META,TSLA,JPM,V,UNH,LLY,JNJ,XOM,PG,MA,HD,CVX,MRK,ABBV,PEP,KO,COST,AVGO,TMO,WMT,MCD,CSCO,ACN,DHR,ABT,ADBE,CRM,NKE,LIN,WFC,TXN,NEE,PM,UPS,QCOM,RTX,MS,AMGN,IBM,GE,HON,CAT,SBUX,INTU";
    let url = "https://financialmodelingprep.com/api/v3/quote/" # tickers # "?apikey=" # apiKey;
    try {
      let response = await Outcall.httpGetRequest(url, [], transform);
      #ok(response);
    } catch (_e) {
      #err("Failed to fetch screener data");
    };
  };

  // Fetch key metrics for a ticker (fundamentals TTM)
  public func fetchKeyMetrics(ticker : Text, apiKey : Text) : async { #ok : Text; #err : Text } {
    let url = "https://financialmodelingprep.com/api/v3/key-metrics-ttm/" # ticker # "?apikey=" # apiKey;
    try {
      let response = await Outcall.httpGetRequest(url, [], transform);
      #ok(response);
    } catch (_e) {
      #err("Failed to fetch key metrics for " # ticker);
    };
  };

  // Fetch RSI and technical indicators
  public func fetchTechnicalIndicators(ticker : Text, apiKey : Text) : async { #ok : Text; #err : Text } {
    let url = "https://financialmodelingprep.com/api/v3/technical_indicator/daily/" # ticker # "?type=rsi&period=14&apikey=" # apiKey;
    try {
      let response = await Outcall.httpGetRequest(url, [], transform);
      #ok(response);
    } catch (_e) {
      #err("Failed to fetch technical indicators for " # ticker);
    };
  };

  // Fetch historical prices to compute 50-day and 200-day MA
  public func fetchHistoricalPrices(ticker : Text, apiKey : Text) : async { #ok : Text; #err : Text } {
    let url = "https://financialmodelingprep.com/api/v3/historical-price-full/" # ticker # "?timeseries=200&apikey=" # apiKey;
    try {
      let response = await Outcall.httpGetRequest(url, [], transform);
      #ok(response);
    } catch (_e) {
      #err("Failed to fetch historical prices for " # ticker);
    };
  };

  // Fetch profile info (company name, sector, description)
  public func fetchProfiles(apiKey : Text) : async { #ok : Text; #err : Text } {
    let tickers = "AAPL,MSFT,GOOGL,AMZN,NVDA,META,TSLA,JPM,V,UNH,LLY,JNJ,XOM,PG,MA,HD,CVX,MRK,ABBV,PEP,KO,COST,AVGO,TMO,WMT,MCD,CSCO,ACN,DHR,ABT,ADBE,CRM,NKE,LIN,WFC,TXN,NEE,PM,UPS,QCOM,RTX,MS,AMGN,IBM,GE,HON,CAT,SBUX,INTU";
    let url = "https://financialmodelingprep.com/api/v3/profile/" # tickers # "?apikey=" # apiKey;
    try {
      let response = await Outcall.httpGetRequest(url, [], transform);
      #ok(response);
    } catch (_e) {
      #err("Failed to fetch profiles");
    };
  };
};
