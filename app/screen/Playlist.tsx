import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Playlist data
const playlists = [
  { id: '1', title: 'Top Hits', image: 'https://pbs.twimg.com/media/GZoYiW8WIAEacMX?format=jpg&name=large' },
  { id: '2', title: 'Chill Vibes', image: 'https://indiemono.com/wp-content/uploads/2022/06/love-bedroom-pop_0005_tik-tok-chill-vibes.jpg' },
  { id: '3', title: 'Workout Mix', image: 'https://i1.sndcdn.com/artworks-F4dVStyMW4S8HlGB-tuIuLg-t500x500.jpg' },
  { id: '4', title: 'Jazz Essentials', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSVfBOkCEB_jhwn_uwZboxMglPs8gTOVdq9Q&s' },
  { id: '5', title: 'Lo-Fi Beats', image: 'https://i1.sndcdn.com/artworks-000321524016-jw118f-t500x500.jpg' },
];

const { width } = Dimensions.get('window');
const ITEM_SIZE = width / 2.5 - 20;

// Define the navigation types
type RootStackParamList = {
  Playlist: undefined;
  PlaylistDetail: { playlistId: string }; // Add your PlaylistDetail screen
};

// Define the correct type for navigation
type PlaylistNavigationProp = StackNavigationProp<RootStackParamList, 'Playlist'>;

export default function Playlist() {
  const navigation = useNavigation<PlaylistNavigationProp>(); // Use the type here

  // Handle navigation when a playlist item is clicked
  const handlePlaylistPress = (playlistId: string) => {
    navigation.navigate('PlaylistDetail', { playlistId });
  };

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={require('@/assets/images/doggy.webp')}
          style={styles.profilePic}
        />
        <Text style={styles.greeting}>Welcome back 👋</Text>
      </View>

      {/* Playlist Header */}
      <Text style={styles.header}>Your Playlists</Text>

      {/* Playlist Grid */}
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => handlePlaylistPress(item.id)} // Navigate to PlaylistDetail
          >
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
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 15,
  },
  profileSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#1DB954',
  },
  greeting: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  header: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: ITEM_SIZE,
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 10,
    marginBottom: 8,
  },
  text: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
