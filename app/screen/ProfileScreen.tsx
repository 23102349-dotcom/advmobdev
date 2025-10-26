import { AdvancedCamera } from '@/components/AdvancedCamera';
import { useTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
const STORAGE_KEY = 'SPOTIFY_PROFILE_DATA';

// Genre options with corresponding icons
const GENRES = [
  { value: 'Pop', label: 'Pop', color: '#FF6B6B', icon: 'music-note' },
  { value: 'Rock', label: 'Rock', color: '#4ECDC4', icon: 'volume-up' },
  { value: 'Jazz', label: 'Jazz', color: '#45B7D1', icon: 'piano' },
  { value: 'Classical', label: 'Classical', color: '#96CEB4', icon: 'library-music' },
  { value: 'Hip-Hop', label: 'Hip-Hop', color: '#FFEAA7', icon: 'mic' },
];

// Validation functions
const validateUsername = (username: string): string | null => {
  if (!username.trim()) return 'Username is required';
  if (username.length < 3) return 'Username must be at least 3 characters';
  if (username.length > 20) return 'Username must be less than 20 characters';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
  return null;
};

const validateEmail = (email: string): string | null => {
  if (!email.trim()) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

const validateGenre = (genre: string): string | null => {
  if (!genre) return 'Please select a favorite genre';
  return null;
};

// Memoized Profile Preview Component
const ProfilePreview = React.memo(({ username, email, genre }: { 
  username: string; 
  email: string; 
  genre: string; 
}) => {
  const { colors } = useTheme();
  const fadeValue = useSharedValue(0);
  const scaleValue = useSharedValue(0.8);
  
  const selectedGenre = GENRES.find(g => g.value === genre);
  const hasData = username.trim() || email.trim() || genre;

  useEffect(() => {
    if (hasData) {
      fadeValue.value = withTiming(1, { duration: 500 });
      scaleValue.value = withSpring(1, { damping: 15 });
    } else {
      fadeValue.value = withTiming(0, { duration: 300 });
      scaleValue.value = withTiming(0.8, { duration: 300 });
    }
  }, [hasData, fadeValue, scaleValue]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeValue.value,
    transform: [{ scale: scaleValue.value }],
  }));

  if (!hasData) return null;

  return (
    <Animated.View style={[styles.previewContainer, animatedStyle]}>
      <View style={[styles.previewCard, { backgroundColor: colors.background + '40' }]}>
        <View style={styles.previewHeader}>
          <View style={[
            styles.profileImage, 
            selectedGenre && { borderColor: selectedGenre.color },
            { backgroundColor: selectedGenre ? selectedGenre.color + '20' : '#1DB954' + '20' }
          ]}>
            <MaterialIcons 
              name={selectedGenre?.icon || 'person'} 
              size={40} 
              color={selectedGenre?.color || '#1DB954'} 
            />
          </View>
          <View style={styles.previewInfo}>
            <Text style={[styles.previewUsername, { color: colors.text }]}>
              {username || 'Your Username'}
            </Text>
            <Text style={[styles.previewEmail, { color: colors.icon }]}>
              {email || 'your.email@example.com'}
            </Text>
            {selectedGenre && (
              <View style={[styles.genreTag, { backgroundColor: selectedGenre.color + '20' }]}>
                <Text style={[styles.genreTagText, { color: selectedGenre.color }]}>
                  ♪ {selectedGenre.label}
                </Text>
              </View>
            )}
          </View>
        </View>
        <Text style={[styles.previewTitle, { color: colors.icon }]}>Profile Preview</Text>
      </View>
    </Animated.View>
  );
});

export default function ProfileScreen({ navigation }: any) {
  const { colors } = useTheme();
  
  // Form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [genre, setGenre] = useState('');
  
  // Camera state
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  // Validation errors
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [genreError, setGenreError] = useState<string | null>(null);
  
  // Animation values
  const usernameShake = useSharedValue(0);
  const emailShake = useSharedValue(0);
  const genreShake = useSharedValue(0);
  const formOpacity = useSharedValue(0);

  // Load cached data on mount
  useEffect(() => {
    loadCachedData();
    formOpacity.value = withTiming(1, { duration: 800 });
  }, []);

  // Cache data whenever form changes
  useEffect(() => {
    cacheFormData();
  }, [username, email, genre]);

  const loadCachedData = async () => {
    try {
      const cachedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (cachedData) {
        const { username: cachedUsername, email: cachedEmail, genre: cachedGenre } = JSON.parse(cachedData);
        setUsername(cachedUsername || '');
        setEmail(cachedEmail || '');
        setGenre(cachedGenre || '');
      }
    } catch (error) {
      console.log('Error loading cached data:', error);
    }
  };

  const cacheFormData = async () => {
    try {
      const dataToCache = { username, email, genre };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToCache));
    } catch (error) {
      console.log('Error caching data:', error);
    }
  };

  const clearCache = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.log('Error clearing cache:', error);
    }
  };

  // Updated shake animation function (removed withRepeat to fix error)
  const triggerShake = (shakeValue: Animated.SharedValue<number>) => {
    shakeValue.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  // Real-time validation handlers
  const handleUsernameChange = useCallback((text: string) => {
    setUsername(text);
    const error = validateUsername(text);
    setUsernameError(error);
    if (error && text.length > 0) {
      triggerShake(usernameShake);
    }
  }, [usernameShake]);

  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
    const error = validateEmail(text);
    setEmailError(error);
    if (error && text.length > 0) {
      triggerShake(emailShake);
    }
  }, [emailShake]);

  const handleGenreSelect = useCallback((selectedGenre: string) => {
    setGenre(selectedGenre);
    const error = validateGenre(selectedGenre);
    setGenreError(error);
    if (error) {
      triggerShake(genreShake);
    }
  }, [genreShake]);

  // Camera handlers
  const handlePhotoTaken = (uri: string) => {
    setCapturedImage(uri);
    setShowCamera(false);
    Alert.alert('Success', 'Photo captured and filtered!');
  };

  const resetCamera = () => {
    setCapturedImage(null);
    setShowCamera(false);
  };

  // Animated styles
  const usernameAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: usernameShake.value }],
  }));

  const emailAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: emailShake.value }],
  }));

  const genreAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: genreShake.value }],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
  }));

  // Form submission
  const handleSubmit = async () => {
    const usernameErr = validateUsername(username);
    const emailErr = validateEmail(email);
    const genreErr = validateGenre(genre);

    setUsernameError(usernameErr);
    setEmailError(emailErr);
    setGenreError(genreErr);

    if (usernameErr) triggerShake(usernameShake);
    if (emailErr) triggerShake(emailShake);
    if (genreErr) triggerShake(genreShake);

    if (!usernameErr && !emailErr && !genreErr) {
      Alert.alert(
        "Profile Created! 🎉",
        `Welcome ${username}! Your profile has been created successfully.`,
        [
          {
            text: "OK",
            onPress: async () => {
              await clearCache();
              setUsername('');
              setEmail('');
              setGenre('');
              setUsernameError(null);
              setEmailError(null);
              setGenreError(null);
            }
          }
        ]
      );
    }
  };

  const ErrorMessage = ({ error }: { error: string | null }) => {
    if (!error) return null;
    return (
      <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.background === '#fff' ? "dark-content" : "light-content"} backgroundColor={colors.background} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <Animated.View style={[styles.header, formAnimatedStyle]} entering={FadeInDown.delay(200)}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => setShowCamera(true)} activeOpacity={0.8}>
            {capturedImage ? (
              <Image
                source={{ uri: capturedImage }}
                style={styles.headerIconImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.cameraPlaceholderIcon}>
                <Ionicons name="camera" size={40} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Create Your Profile</Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>Join the Spotify community and discover your music</Text>
        </Animated.View>

        {/* Form */}
        <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
          
          {/* Username Field */}
          <Animated.View style={[styles.inputGroup, usernameAnimatedStyle]} entering={FadeInDown.delay(300)}>
            <Text style={[styles.label, { color: colors.text }]}>Username</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.background + '20' }, usernameError && styles.inputError]}>
              <Ionicons name="person-outline" size={20} color={colors.icon} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={username}
                onChangeText={handleUsernameChange}
                placeholder="Enter your username"
                placeholderTextColor={colors.icon}
                maxLength={20}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <ErrorMessage error={usernameError} />
          </Animated.View>

          {/* Email Field */}
          <Animated.View style={[styles.inputGroup, emailAnimatedStyle]} entering={FadeInDown.delay(400)}>
            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.background + '20' }, emailError && styles.inputError]}>
              <Ionicons name="mail-outline" size={20} color={colors.icon} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={email}
                onChangeText={handleEmailChange}
                placeholder="Enter your email"
                placeholderTextColor={colors.icon}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <ErrorMessage error={emailError} />
          </Animated.View>

          {/* Genre Selection */}
          <Animated.View style={[styles.inputGroup, genreAnimatedStyle]} entering={FadeInDown.delay(500)}>
            <Text style={[styles.label, { color: colors.text }]}>Favorite Genre</Text>
            <View style={[styles.genreOptionsContainer, genreError && styles.inputError]}>
              {GENRES.map((g) => (
                <TouchableOpacity
                  key={g.value}
                  style={[
                    styles.genreOption,
                    { backgroundColor: colors.background === '#fff' ? '#fff' : colors.background + '40' },
                    genre === g.value && { borderColor: g.color, backgroundColor: g.color + '30' },
                  ]}
                  onPress={() => handleGenreSelect(g.value)}
                >
                  <View style={[styles.genreIconContainer, { backgroundColor: g.color + '20' }]}>
                    <MaterialIcons name={g.icon} size={24} color={g.color} />
                  </View>
                  <Text style={[styles.genreLabel, { color: colors.text }]}>{g.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <ErrorMessage error={genreError} />
          </Animated.View>

          {/* Submit Button */}
          <Animated.View entering={FadeIn.delay(600)} style={styles.submitButtonContainer}>
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.tint }]}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <MaterialIcons name="check" size={18} color={colors.background} />
              <Text style={[styles.submitButtonText, { color: colors.background }]}>Create Profile</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        {/* Profile Preview */}
        <ProfilePreview username={username} email={email} genre={genre} />

        {/* Camera Component */}
        {showCamera && (
          <Animated.View style={[styles.cameraOverlay, { backgroundColor: colors.background }]} entering={FadeIn.duration(300)}>
            <View style={[styles.cameraOverlayHeader, { backgroundColor: colors.background }]}>
              <TouchableOpacity 
                style={[styles.closeButton, { backgroundColor: colors.tint }]}
                onPress={() => setShowCamera(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color={colors.background} />
              </TouchableOpacity>
              <View style={styles.cameraOverlayTitle}>
                <Ionicons name="camera" size={20} color={colors.tint} />
                <Text style={[styles.cameraOverlayTitleText, { color: colors.text }]}>Take Photo</Text>
              </View>
              <View style={{ width: 40 }} />
            </View>
            <View style={[styles.cameraContainer, { backgroundColor: colors.background }]}>
              <AdvancedCamera colors={colors} onPhotoTaken={handlePhotoTaken} />
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { paddingHorizontal: 16 },

  header: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  headerIcon: {
    backgroundColor: '#1DB954',
    borderRadius: 50,
    padding: 0,
    marginBottom: 15,
    width: 100,
    height: 100,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconImage: {
    width: '100%',
    height: '100%',
  },
  cameraPlaceholderIcon: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
  },

  formContainer: {
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  inputIcon: {
    marginRight: 8,
  },
  inputError: {
    borderWidth: 1.5,
    borderColor: '#FF4C4C',
  },
  errorText: {
    color: '#FF4C4C',
    marginTop: 4,
    fontSize: 13,
  },

  genreOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  genreOption: {
    width: (width - 60) / 3, // 3 items per row with some padding
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  genreIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genreLabel: {
    fontWeight: '600',
  },

  submitButtonContainer: {
    marginTop: 10,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    gap: 6,
    minWidth: 200,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  previewContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  previewCard: {
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 500,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#1DB954',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewInfo: {
    flex: 1,
  },
  previewUsername: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  previewEmail: {
    marginTop: 3,
  },
  genreTag: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  genreTagText: {
    fontWeight: '600',
  },
  previewTitle: {
    fontSize: 14,
    textAlign: 'center',
  },

  // Camera styles
  cameraSection: {
    marginBottom: 40,
  },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cameraIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cameraTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cameraPlaceholder: {
    height: 220,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  cameraIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  cameraPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  cameraPlaceholderSubtext: {
    fontSize: 14,
    fontWeight: '400',
  },
  capturedImageContainer: {
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: 20,
    padding: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  capturedImage: {
    width: 200,
    height: 200,
    borderRadius: 15,
  },
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 6,
    minWidth: 90,
    justifyContent: 'center',
  },
  primaryButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    borderWidth: 1,
  },
  cameraButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  cameraOverlayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  cameraOverlayTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cameraOverlayTitleText: {
    fontSize: 18,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
    marginTop: 10,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
