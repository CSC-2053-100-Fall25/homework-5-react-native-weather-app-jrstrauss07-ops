import { View, Text, StyleSheet, Image, Button } from "react-native";
import React from "react";
import { useLocalSearchParams, router } from "expo-router";

export default function CityDetail() {
  const { data } = useLocalSearchParams();
  const weather = JSON.parse(data as string);

  const icon = weather.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`;

  return (
    <View style={styles.container}>
      <Text style={styles.cityName}>{weather.name}</Text>

      <Image source={{ uri: iconUrl }} style={{ width: 150, height: 150 }} />

      <Text style={styles.temp}>{Math.round(weather.main.temp)}°F</Text>
      <Text style={styles.desc}>{weather.weather[0].description}</Text>

      <View style={styles.detailsBox}>
        <Text style={styles.detail}>Humidity: {weather.main.humidity}%</Text>
        <Text style={styles.detail}>Wind: {weather.wind.speed} mph</Text>
        <Text style={styles.detail}>Feels Like: {Math.round(weather.main.feels_like)}°F</Text>
      </View>

      <Button title="Back" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20 },
  cityName: { fontSize: 30, fontWeight: "bold", marginBottom: 10 },
  temp: { fontSize: 28, marginTop: 10 },
  desc: { fontSize: 20, color: "gray" },

  detailsBox: {
    marginTop: 20,
    backgroundColor: "#e9e9e9",
    padding: 15,
    borderRadius: 10,
    width: "90%",
  },
  detail: { fontSize: 18, marginVertical: 4 },
});
