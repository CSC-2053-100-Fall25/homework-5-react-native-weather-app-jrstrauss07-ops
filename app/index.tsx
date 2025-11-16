import * as Location from "expo-location";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";

const API_KEY = "ebefa7fcc453ddf461753f74b0f9c02a";


const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Philadelphia",
  "Miami",
  "Dallas",
  "Phoenix",
  "Seattle",
  "Denver",
  "Boston",
];

export default function Index() {
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch weather for one city
  const fetchWeather = async (city: string) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`;
    const res = await fetch(url);
    return await res.json();
  };

  // Fetch weather for current location
  const fetchCurrentLocationWeather = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") return;

    let loc = await Location.getCurrentPositionAsync({});
    const lat = loc.coords.latitude;
    const lon = loc.coords.longitude;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`;

    const res = await fetch(url);
    const data = await res.json();
    setCurrentWeather({ ...data, name: "Your Location" });
  };

  useEffect(() => {
    (async () => {
      await fetchCurrentLocationWeather();

      const results = await Promise.all(cities.map((c) => fetchWeather(c)));
      setWeatherData(results);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading weather...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.cityCard}
      onPress={() => router.push({ pathname: "CityDetail", params: { data: JSON.stringify(item) } })}
    >
      <Text style={styles.cityName}>{item.name}</Text>
      <Text style={styles.temp}>{Math.round(item.main.temp)}°F</Text>
      <Text style={styles.desc}>{item.weather[0].description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {currentWeather && (
        <View style={styles.currentCard}>
          <Text style={styles.cityName}>📍 {currentWeather.name}</Text>
          <Text style={styles.temp}>{Math.round(currentWeather.main.temp)}°F</Text>
          <Text style={styles.desc}>{currentWeather.weather[0].description}</Text>
        </View>
      )}

      <FlatList
        data={weatherData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: "#f5f5f5", flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  cityCard: {
    backgroundColor: "white",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3,
  },
  currentCard: {
    backgroundColor: "#d6eaff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  cityName: { fontSize: 22, fontWeight: "bold" },
  temp: { fontSize: 18, marginTop: 5 },
  desc: { fontSize: 16, color: "gray" },
});
