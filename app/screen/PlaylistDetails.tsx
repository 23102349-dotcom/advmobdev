import { useTheme } from '@/providers/ThemeProvider';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Types
interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  album?: string;
  coverUrl?: any; // Changed to any to support both require() and string URLs
}

interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: any; // Changed to any to support both require() and string URLs
  songs: Song[];
  createdAt: string;
  totalDuration: string;
}

interface RouteParams {
  playlistId?: string;
  playlist?: Playlist;
}

const { width } = Dimensions.get('window');

export default function PlaylistDetail() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  
  // Make route params optional and provide defaults
  const routeParams = route.params as RouteParams | undefined;
  const { playlistId, playlist: routePlaylist } = routeParams || {};

  const [playlist, setPlaylist] = useState<Playlist | null>(routePlaylist || null);
  const [loading, setLoading] = useState(!routePlaylist);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  // Mock data - replace with your actual data fetching logic
  const mockPlaylist: Playlist = {
    id: playlistId || '1',
    name: 'My Awesome Playlist',
    description: 'A collection of my favorite songs',
    coverUrl: require('@/assets/images/icon.png'),
    createdAt: '2024-01-15',
    totalDuration: '1h 23m',
    songs: [
      {
        id: '1',
        title: 'Song One',
        artist: 'Artist One',
        duration: '3:45',
        album: 'Album One',
        coverUrl: require('@/assets/images/react-logo.png'),
      },
      {
        id: '2',
        title: 'Another Great Song',
        artist: 'Artist Two',
        duration: '4:12',
        album: 'Album Two',
        coverUrl: require('@/assets/images/splash-icon.png'),
      },
      {
        id: '3',
        title: 'Best Song Ever',
        artist: 'Artist Three',
        duration: '3:28',
        album: 'Album Three',
        coverUrl: require('@/assets/images/partial-react-logo.png'),
      },
      {
        id: '4',
        title: 'Chill Vibes',
        artist: 'Artist Four',
        duration: '5:01',
        album: 'Album Four',
        coverUrl: require('@/assets/images/favicon.png'),
      },
    ],
  };

  useEffect(() => {
    if (!playlist) {
      // Simulate loading playlist data
      setTimeout(() => {
        setPlaylist(mockPlaylist);
        setLoading(false);
      }, 1000);
    }
  }, [playlist]); // Changed dependency from playlistId to playlist

  const handlePlaySong = (songId: string) => {
    setCurrentlyPlaying(songId);
    // Add your play song logic here
    console.log('Playing song:', songId);
  };

  const handleEditPlaylist = () => {
    (navigation as any).navigate('PlaylistBuilder', { playlist });
  };

  const handleDeletePlaylist = () => {
    Alert.alert(
      'Delete Playlist',
      'Are you sure you want to delete this playlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Add delete logic here
            navigation.goBack();
          },
        },
      ]
    );
  };

  const renderSong = ({ item, index }: { item: Song; index: number }) => (
    <TouchableOpacity
      style={[
        styles.songItem,
        { 
          backgroundColor: currentlyPlaying === item.id 
            ? (colors.background === '#fff' ? '#d0d0d0' : '#1a1a1a')
            : 'transparent'
        },
      ]}
      onPress={() => handlePlaySong(item.id)}
    >
      <View style={styles.songInfo}>
        <Text style={[styles.songNumber, { color: colors.icon }]}>{index + 1}</Text>
        <Image
          source={typeof item.coverUrl === 'string' ? { uri: item.coverUrl } : item.coverUrl}
          style={styles.songCover}
        />
        <View style={styles.songDetails}>
          <Text style={[styles.songTitle, { color: colors.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.songArtist, { color: colors.icon }]} numberOfLines={1}>
            {item.artist}
          </Text>
        </View>
      </View>
      <Text style={[styles.songDuration, { color: colors.icon }]}>{item.duration}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading playlist...</Text>
      </View>
    );
  }

  if (!playlist) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Playlist not found</Text>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.tint }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Playlist Header */}
        <View style={styles.header}>
          <Image
            source={typeof playlist.coverUrl === 'string' ? { uri: playlist.coverUrl } : playlist.coverUrl}
            style={styles.playlistCover}
          />
          <View style={styles.playlistInfo}>
            <Text style={[styles.playlistName, { color: colors.text }]}>{playlist.name}</Text>
            {playlist.description && (
              <Text style={[styles.playlistDescription, { color: colors.icon }]}>{playlist.description}</Text>
            )}
            <Text style={[styles.playlistMeta, { color: colors.icon }]}>
              {playlist.songs.length} songs • {playlist.totalDuration}
            </Text>
            <Text style={[styles.createdDate, { color: colors.icon }]}>
              Created {new Date(playlist.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={[styles.playButton, { backgroundColor: colors.tint }]}>
                <MaterialIcons name="play-arrow" size={18} color={colors.background} />
                <Text style={[styles.playButtonText, { color: colors.background }]}>Play All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.editButton, { backgroundColor: colors.background + '40' }]} onPress={handleEditPlaylist}>
                <MaterialIcons name="edit" size={18} color={colors.text} />
                <Text style={[styles.editButtonText, { color: colors.text }]}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.deleteButton, { backgroundColor: '#ff4444' }]} onPress={handleDeletePlaylist}>
                <MaterialIcons name="delete" size={18} color="#fff" />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>

        {/* Songs List */}
        <View style={styles.songsContainer}>
          <Text style={[styles.songsHeader, { color: colors.text }]}>Songs</Text>
          <FlatList
            data={playlist.songs}
            renderItem={renderSong}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'flex-end',
  },
  playlistCover: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginRight: 20,
  },
  playlistInfo: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  playlistName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  playlistDescription: {
    color: '#b3b3b3',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  playlistMeta: {
    color: '#b3b3b3',
    fontSize: 12,
    marginBottom: 4,
  },
  createdDate: {
    color: '#b3b3b3',
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
    justifyContent: 'space-between',
  },
  playButton: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginHorizontal: 2,
  },
  playButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  editButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginHorizontal: 2,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginHorizontal: 2,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  songsContainer: {
    paddingHorizontal: 16,
  },
  songsHeader: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  songInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  songNumber: {
    color: '#b3b3b3',
    fontSize: 14,
    width: 30,
    textAlign: 'center',
  },
  songCover: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginHorizontal: 12,
  },
  songDetails: {
    flex: 1,
  },
  songTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  songArtist: {
    color: '#b3b3b3',
    fontSize: 14,
  },
  songDuration: {
    color: '#b3b3b3',
    fontSize: 14,
    marginLeft: 10,
  },
});