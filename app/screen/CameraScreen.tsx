import { AdvancedCamera } from '@/components/AdvancedCamera';
import { useTheme } from '@/providers/ThemeProvider';
import { useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CameraScreen() {
  const { colors } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.message, { color: colors.text }]}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.tint }]}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handlePhotoTaken = (uri: string) => {
    setCapturedImage(uri);
    Alert.alert('Success', 'Photo captured and filtered!');
  };

  const resetCamera = () => {
    setCapturedImage(null);
  };

  if (capturedImage) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Captured Photo</Text>
        <View style={styles.imageContainer}>
          <Animated.Image
            source={{ uri: capturedImage }}
            style={[styles.capturedImage, animatedStyle]}
            resizeMode="contain"
          />
        </View>
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.tint }]}
            onPress={resetCamera}
          >
            <Text style={styles.buttonText}>Take Another</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Camera with Filters</Text>
      <Text style={[styles.description, { color: colors.text }]}>
        Capture photos with real-time filters and adjustable intensity. 
        Try different filters and adjust their intensity using the slider below.
      </Text>
      
      <AdvancedCamera colors={colors} onPhotoTaken={handlePhotoTaken} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  capturedImage: {
    width: screenWidth - 40,
    height: screenHeight * 0.6,
    borderRadius: 15,
  },
  controls: {
    paddingVertical: 20,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
