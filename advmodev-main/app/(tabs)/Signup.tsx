import React from "react";
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./SpotifyLoginScreen"; // import the same type

const playlists = [
  { id: "1", title: "Top Hits", image: "https://pbs.twimg.com/media/GZoYiW8WIAEacMX?format=jpg&name=large" },
  { id: "2", title: "Chill Vibes", image: "https://indiemono.com/wp-content/uploads/2022/06/love-bedroom-pop_0005_tik-tok-chill-vibes.jpg" },
  { id: "3", title: "Workout Mix", image: "https://i1.sndcdn.com/artworks-F4dVStyMW4S8HlGB-tuIuLg-t500x500.jpg" },
  { id: "4", title: "Jazz Essentials", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSVfBOkCEB_jhwn_uwZboxMglPs8gTOVdq9Q&s" },
  { id: "5", title: "Lo-Fi Beats", image: "https://i1.sndcdn.com/artworks-000321524016-jw118f-t500x500.jpg" },
];

const { width } = Dimensions.get("window");
const ITEM_SIZE = width / 2.5 - 20;

export default function Playlist() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      <Text style={styles.header}>Your Playlists</Text>

      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.8}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.text} numberOfLines={1}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 15 },
  backButton: {
    marginBottom: 15,
    alignSelf: "flex-start",
    backgroundColor: "#1DB954",
    padding: 8,
    borderRadius: 8,
  },
  header: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  row: { justifyContent: "space-between", marginBottom: 20 },
  card: { width: ITEM_SIZE, alignItems: "center" },
  image: { width: ITEM_SIZE, height: ITEM_SIZE, borderRadius: 10, marginBottom: 8 },
  text: { color: "white", fontSize: 13, fontWeight: "600", textAlign: "center" },
});
