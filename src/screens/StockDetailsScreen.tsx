import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { getStockData } from "../../services/stockService";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";

const screenWidth = Dimensions.get("window").width;

type StockDetailsScreenProps = {
  route: RouteProp<RootStackParamList, "Details">;
};

interface StockData {
  labels: string[];
  prices: number[];
}

const StockDetailsScreen = ({ route }: StockDetailsScreenProps) => {
  const { symbol } = route.params;
  const [stockData, setStockData] = useState<StockData | null>(null);

  useEffect(() => {
    const fetchStockDetails = async () => {
      const data = await getStockData(symbol);
      if (data && data["Time Series (Daily)"]) {
        const priceData = data["Time Series (Daily)"];
        const entries = Object.entries(priceData);
        const labels: string[] = [];
        const prices: number[] = [];
        entries.forEach(([date, value], index) => {
          if (index < 10) {
            labels.push(date);
            prices.push(parseFloat(value["4. close"]));
          }
        });
        setStockData({ labels: labels.reverse(), prices: prices.reverse() });
      }
    };

    fetchStockDetails();
  }, [symbol]);

  return (
    <View style={styles.container}>
      {stockData ? (
        <>
          <Text style={styles.header}>Price Changes for {symbol}</Text>
          <LineChart
            data={{
              labels: stockData.labels,
              datasets: [{ data: stockData.prices }],
            }}
            width={screenWidth - 16}
            height={300}
            yAxisLabel="$"
            yAxisSuffix="K"
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#eff3ff",
              backgroundGradientTo: "#efeff1",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(17, 51, 83, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(17, 51, 83, ${opacity})`,
              style: {
                borderRadius: 16,
                paddingTop: 20,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
              propsForLabels: {
                rotation: 45,
                fontSize: 12
              },
              paddingTop: 30,
            }}
            bezier
            style={{
              marginVertical: 8,
              padding: 20,
              borderRadius: 16,
            }}
          />
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#f5fcff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#2C5282",
  },
});

export default StockDetailsScreen;
