import { useTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  Layout,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// -------------------- Reducer Setup --------------------

type Action =
  | { type: 'ADD_SONG'; payload: string }
  | { type: 'REMOVE_SONG'; payload: number }
  | { type: 'CLEAR_PLAYLIST' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'LOAD_STATE'; payload: StateWithHistory };

interface StateWithHistory {
  past: string[][];
  present: string[];
  future: string[][];
}

const initialState: StateWithHistory = {
  past: [],
  present: [],
  future: [],
};

function playlistReducer(state: StateWithHistory, action: Action): StateWithHistory {
  const { past, present, future } = state;

  switch (action.type) {
    case 'ADD_SONG': {
      const newPresent = [...present, action.payload];
      return {
        past: [...past, present],
        present: newPresent,
        future: [],
      };
    }
    case 'REMOVE_SONG': {
      if (action.payload < 0 || action.payload >= present.length) return state;
      const newPresent = present.filter((_, idx) => idx !== action.payload);
      return {
        past: [...past, present],
        present: newPresent,
        future: [],
      };
    }
    case 'CLEAR_PLAYLIST': {
      if (present.length === 0) return state;
      return {
        past: [...past, present],
        present: [],
        future: [],
      };
    }
    case 'UNDO': {
      if (past.length === 0) return state;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, -1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    }
    case 'REDO': {
      if (future.length === 0) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    }
    case 'LOAD_STATE': {
      return action.payload;
    }
    default:
      return state;
  }
}

// -------------------- PlaylistBuilderScreen --------------------

const STORAGE_KEY = 'PLAYLIST_BUILDER_STATE';

function PlaylistBuilderScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [songInput, setSongInput] = useState('');
  const [state, dispatch] = useReducer(playlistReducer, initialState);
  const [playlistName, setPlaylistName] = useState('My Awesome Playlist');
  const [editingName, setEditingName] = useState(false);
  const flatListRef = useRef<FlatList<string>>(null);

  // Header animation values
  const headerOpacity = useSharedValue(1);
  const headerScale = useSharedValue(1);

  // Save state + playlistName to AsyncStorage on any change
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ ...state, playlistName })
        );
      } catch (error) {
        console.error('Failed to save playlist state', error);
      }
    };
    saveData();
  }, [state, playlistName]);

  // Load from AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Validate structure before loading
          if (
            parsed &&
            parsed.present &&
            Array.isArray(parsed.present) &&
            parsed.past &&
            Array.isArray(parsed.past) &&
            parsed.future &&
            Array.isArray(parsed.future)
          ) {
            dispatch({ type: 'LOAD_STATE', payload: parsed });
            if (parsed.playlistName && typeof parsed.playlistName === 'string') {
              setPlaylistName(parsed.playlistName);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load playlist state', error);
      }
    };
    loadData();
  }, []);

  const addSong = () => {
    if (songInput.trim() === '') return;

    headerScale.value = withSpring(1.05, { duration: 200 }, () => {
      headerScale.value = withSpring(1, { duration: 200 });
    });

    dispatch({ type: 'ADD_SONG', payload: songInput.trim() });
    setSongInput('');
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const removeSong = (index: number) => {
    dispatch({ type: 'REMOVE_SONG', payload: index });
  };

  const undo = () => dispatch({ type: 'UNDO' });
  const redo = () => dispatch({ type: 'REDO' });

  const clear = () => {
    Alert.alert(
      'Clear Playlist',
      'Are you sure you want to remove all songs?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => dispatch({ type: 'CLEAR_PLAYLIST' }) },
      ]
    );
  };

  const savePlaylist = () => {
    if (state.present.length === 0) {
      Alert.alert('Empty Playlist', 'Add some songs before saving!');
      return;
    }
    Alert.alert('Playlist Saved', `"${playlistName}" has been saved with ${state.present.length} songs!`);
  };

  // -------------------- Animated Song Item --------------------

  const AnimatedSongItem = ({ title, index }: { title: string; index: number }) => {
    const { colors } = useTheme();
    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);

    useEffect(() => {
      scale.value = withSpring(1, { damping: 15 });
      opacity.value = withTiming(1, { duration: 400 });
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    }));

    const pressScale = useSharedValue(1);
    const pressAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: pressScale.value }],
    }));

    const handlePressIn = () => {
      pressScale.value = withTiming(0.95, { duration: 100 });
    };

    const handlePressOut = () => {
      pressScale.value = withTiming(1, { duration: 100 });
    };

    return (
      <Animated.View
        layout={Layout.springify().damping(15).stiffness(100)}
        entering={SlideInRight.duration(300).delay(index * 50)}
        exiting={SlideOutLeft.duration(300)}
        style={[styles.songItem, { backgroundColor: colors.background + '20' }, animatedStyle]}
      >
        <Animated.View style={[styles.songContent, pressAnimatedStyle]}>
          <View style={styles.songIcon}>
            <Ionicons name="musical-notes" size={20} color={colors.tint} />
          </View>
          <View style={styles.songDetails}>
            <Text style={[styles.songTitle, { color: colors.text }]} numberOfLines={1}>
              {title}
            </Text>
            <Text style={[styles.songSubtitle, { color: colors.icon }]}>Track {index + 1}</Text>
          </View>
          <TouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => removeSong(index)}
            style={styles.removeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={18} color="#ff4757" />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    );
  };

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ scale: headerScale.value }],
  }));

  return (
    <GestureHandlerRootView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.background === '#fff' ? "dark-content" : "light-content"} backgroundColor={colors.background} />
      <SafeAreaView style={styles.safeArea}>
        {/* Header Section */}
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <View style={styles.playlistCover}>
            <Image 
              source={require('@/assets/images/icon.png')} 
              style={styles.playlistCoverImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.headerContent}>
            {editingName ? (
              <TextInput
                value={playlistName}
                onChangeText={setPlaylistName}
                style={[styles.playlistNameInput, { color: colors.text }]}
                onBlur={() => setEditingName(false)}
                onSubmitEditing={() => setEditingName(false)}
                autoFocus
                selectTextOnFocus
              />
            ) : (
              <TouchableOpacity onPress={() => setEditingName(true)}>
                <Text style={[styles.playlistName, { color: colors.text }]}>{playlistName}</Text>
              </TouchableOpacity>
            )}
            <Text style={[styles.playlistInfo, { color: colors.icon }]}>
              {state.present.length} {state.present.length === 1 ? 'song' : 'songs'}
            </Text>
          </View>
        </Animated.View>

        {/* Song Input */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Add a song title"
            placeholderTextColor={colors.icon}
            value={songInput}
            onChangeText={setSongInput}
            onSubmitEditing={addSong}
            style={[styles.textInput, { color: colors.text, backgroundColor: colors.background + '40' }]}
            returnKeyType="done"
          />
          <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.tint }]} onPress={addSong}>
            <Ionicons name="add" size={28} color={colors.background} />
          </TouchableOpacity>
        </View>

        {/* Playlist List */}
        <FlatList
          ref={flatListRef}
          data={state.present}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => (
            <AnimatedSongItem title={item} index={index} />
          )}
          contentContainerStyle={styles.listContainer}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.icon }]}>Your playlist is empty.</Text>
            </View>
          )}
        />

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, !state.past.length && styles.disabledButton]}
            onPress={undo}
            disabled={!state.past.length}
          >
            <Ionicons name="arrow-undo-outline" size={24} color={state.past.length ? colors.text : colors.icon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, !state.future.length && styles.disabledButton]}
            onPress={redo}
            disabled={!state.future.length}
          >
            <Ionicons name="arrow-redo-outline" size={24} color={state.future.length ? colors.text : colors.icon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, state.present.length === 0 && styles.disabledButton]}
            onPress={clear}
            disabled={state.present.length === 0}
          >
            <Ionicons name="trash-outline" size={24} color={state.present.length ? '#ff4757' : colors.icon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={savePlaylist}>
            <Ionicons name="save-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  playlistCover: {
    backgroundColor: '#1DB954',
    width: 70,
    height: 70,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    overflow: 'hidden',
  },
  playlistCoverImage: {
    width: '100%',
    height: '100%',
  },
  headerContent: {
    flex: 1,
  },
  playlistName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  playlistNameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#1DB954',
    paddingVertical: 0,
  },
  playlistInfo: {
    marginTop: 4,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  textInput: {
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#1DB954',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  songItem: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  songContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  songIcon: {
    width: 30,
    alignItems: 'center',
  },
  songDetails: {
    flex: 1,
    marginLeft: 10,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  songSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  removeButton: {
    padding: 6,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
  },
  controlButton: {
    padding: 10,
  },
  disabledButton: {
    opacity: 0.4,
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    color: '#777',
    fontSize: 16,
  },
});

export default PlaylistBuilderScreen;
