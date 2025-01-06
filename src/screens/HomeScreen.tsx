import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import DropDownPicker from "react-native-dropdown-picker";
import { getStockData } from "../../services/stockService";
import { RootStackParamList } from "../navigation/types";

interface Stock {
  date: string;
  symbol: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

const HomeScreen = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const symbols = [
    { label: "Apple", value: "AAPL" },
    { label: "Microsoft", value: "MSFT" },
    { label: "Amazon", value: "AMZN" },
    { label: "Tesla", value: "TSLA" },
    { label: "Facebook", value: "FB" },
  ];

  useEffect(() => {
    if (selectedSymbol) {
      fetchStocks();
    }
  }, [selectedSymbol]);

  const fetchStocks = async () => {
    setLoading(true);
    const data = await getStockData(selectedSymbol);
    if (data && data["Time Series (Daily)"]) {
      const stockArray = Object.entries(data["Time Series (Daily)"]).map(
        ([key, value]) => ({
          date: key,
          symbol: selectedSymbol,
          open: value["1. open"],
          high: value["2. high"],
          low: value["3. low"],
          close: value["4. close"],
          volume: value["5. volume"],
        })
      );
      setStocks(stockArray);
    } else {
      console.error("No data found for the symbol:", selectedSymbol);
    }
    setLoading(false);
  };

  const renderItem = ({ item }: { item: Stock }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Details", { symbol: item.symbol })}
      style={styles.listItem}
      activeOpacity={0.7} // Dodaje animaciju pritiska
    >
      <View style={styles.itemHeader}>
        <Text style={styles.title}>
          {item.symbol} - {item.date}
        </Text>
      </View>
      <View style={styles.itemBody}>
        <Text style={styles.details}>Open: {item.open}</Text>
        <Text style={styles.details}>Close: {item.close}</Text>
      </View>
      <View style={styles.itemFooter}>
        <Text style={styles.details}>High: {item.high}</Text>
        <Text style={styles.details}>Low: {item.low}</Text>
        <Text style={styles.details}>Volume: {item.volume}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={selectedSymbol}
        items={symbols}
        setOpen={setOpen}
        setValue={setSelectedSymbol}
      />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={stocks}
          keyExtractor={(item) => item.date}
          renderItem={renderItem}
        />
      )}
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={fetchStocks}
        activeOpacity={0.7}
      >
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5fcff",
  },
  listItem: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  itemBody: {
    paddingBottom: 5,
  },
  itemFooter: {
    borderTopColor: "#E2E8F0",
    borderTopWidth: 1,
    marginTop: 5,
    paddingTop: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C5282",
  },
  details: {
    fontSize: 14,
    color: "#4A5568",
  },
  refreshButton: {
    backgroundColor: "#2089dc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    width: "50%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  refreshButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default HomeScreen;
