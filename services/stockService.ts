import axios from "axios";

const API_KEY: string = "E3NH42LTGEM99YJB";
const BASE_URL: string = "https://www.alphavantage.co/query";

interface StockData {
  "Meta Data": any;
  "Time Series (Daily)": {
    [key: string]: {
      "1. open": string;
      "2. high": string;
      "3. low": string;
      "4. close": string;
      "5. volume": string;
    };
  };
}

const getStockData = async (symbol: string): Promise<StockData | null> => {
  try {
    const response = await axios.get<StockData>(`${BASE_URL}`, {
      params: {
        function: "TIME_SERIES_DAILY",
        symbol: symbol,
        apikey: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return null;
  }
};

export { getStockData };
