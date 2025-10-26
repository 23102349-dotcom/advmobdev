import React from 'react';
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

function PlaylistScreen({ navigation }: any) {
  const playlists = [
    { id: '1', name: 'My Favorite Songs' },
    { id: '2', name: 'Top Hits 2025' },
    { id: '3', name: 'Workout Mix' },
  ];

  const renderItem = ({ item }: any) => (
    <Pressable
      onPress={() =>
        navigation.navigate('PlaylistDetail', {
          playlistId: item.id,
          playlistName: item.name,
        })
      }
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? '#1DB954' : '#121212',
          padding: 15,
          marginVertical: 5,
          borderRadius: 8,
        },
      ]}
    >
      <Text style={{ color: '#fff', fontSize: 18 }}>{item.name}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlatList data={playlists} keyExtractor={(item) => item.id} renderItem={renderItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
});

export default PlaylistScreen;
