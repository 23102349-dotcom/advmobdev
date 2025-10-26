import Slider from '@react-native-community/slider';
import { CameraType, CameraView } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import React, { memo, useEffect, useRef, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


type FilterType = 'none' | 'grayscale' | 'sepia';

interface AdvancedCameraProps {
  colors: any;
  onPhotoTaken: (uri: string) => void;
}

export const AdvancedCamera = memo(({ colors, onPhotoTaken }: AdvancedCameraProps) => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('none');
  const [filterIntensity, setFilterIntensity] = useState(1.0);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isCropped, setIsCropped] = useState(false);
  
  const cameraRef = useRef<CameraView>(null);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (isProcessing) {
      opacity.value = withTiming(0.5, { duration: 200 });
    } else {
      opacity.value = withTiming(1, { duration: 200 });
    }
  }, [isProcessing]);

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;
    
    setIsProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      
      if (photo?.uri) {
        setCapturedPhoto(photo.uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const applyFilter = async (uri: string) => {
    if (selectedFilter === 'none' && rotation === 0) {
      return uri;
    }

    try {
      const actions: ImageManipulator.Action[] = [];

      if (rotation !== 0) {
        actions.push({ rotate: rotation });
      }

      const result = await ImageManipulator.manipulateAsync(uri, actions, {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.JPEG,
      });

      return result.uri;
    } catch (error) {
      console.error('Filter error:', error);
      return uri;
    }
  };

  const handleSavePhoto = async () => {
    if (!capturedPhoto) return;
    
    setIsProcessing(true);
    try {
      const filteredUri = await applyFilter(capturedPhoto);
      onPhotoTaken(filteredUri);
      setCapturedPhoto(null);
      setRotation(0);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    setRotation(0);
    setSelectedFilter('none');
    setFilterIntensity(1.0);
    setIsCropped(false);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleCrop = async () => {
    if (!capturedPhoto || isCropped) return;
    
    setIsProcessing(true);
    try {
      // Get image dimensions and crop to center square
      const result = await ImageManipulator.manipulateAsync(
        capturedPhoto,
        [
          {
            crop: {
              originX: 0,
              originY: 0,
              width: 1000,
              height: 1000,
            },
          },
        ],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      
      setCapturedPhoto(result.uri);
      setIsCropped(true);
    } catch (error) {
      console.error('Crop error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (capturedPhoto) {
    return (
      <View style={[styles.previewWrapper, { backgroundColor: colors.background }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: capturedPhoto }}
              style={[
                styles.previewImage,
                { transform: [{ rotate: `${rotation}deg` }] },
              ]}
              resizeMode="contain"
            />
            {selectedFilter === 'grayscale' && (
              <View style={[styles.filterOverlay, { opacity: filterIntensity }]}>
                <View style={styles.grayscaleFilter} />
              </View>
            )}
            {selectedFilter === 'sepia' && (
              <View style={[styles.filterOverlay, { opacity: filterIntensity }]}>
                <View style={styles.sepiaFilter} />
              </View>
            )}
          </View>

          <View style={styles.filtersContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Filters</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  { backgroundColor: colors.background + '40' },
                  selectedFilter === 'none' && { borderColor: colors.tint, borderWidth: 2 },
                ]}
                onPress={() => setSelectedFilter('none')}
              >
                <Text style={[styles.filterText, { color: colors.text }]}>None</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  { backgroundColor: colors.background + '40' },
                  selectedFilter === 'grayscale' && { borderColor: colors.tint, borderWidth: 2 },
                ]}
                onPress={() => setSelectedFilter('grayscale')}
              >
                <Text style={[styles.filterText, { color: colors.text }]}>Grayscale</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  { backgroundColor: colors.background + '40' },
                  selectedFilter === 'sepia' && { borderColor: colors.tint, borderWidth: 2 },
                ]}
                onPress={() => setSelectedFilter('sepia')}
              >
                <Text style={[styles.filterText, { color: colors.text }]}>Sepia</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {selectedFilter !== 'none' && (
            <View style={styles.sliderContainer}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Intensity: {Math.round(filterIntensity * 100)}%</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={filterIntensity}
                onValueChange={setFilterIntensity}
                minimumTrackTintColor={colors.tint}
                maximumTrackTintColor={colors.icon}
                thumbTintColor={colors.tint}
              />
            </View>
          )}

          <View style={styles.toolsContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tools</Text>
            <View style={styles.toolsRow}>
              <TouchableOpacity
                style={[styles.toolButton, { backgroundColor: colors.background + '40' }]}
                onPress={handleRotate}
              >
                <MaterialIcons name="rotate-right" size={24} color={colors.text} />
                <Text style={[styles.toolText, { color: colors.text }]}>Rotate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toolButton,
                  { backgroundColor: colors.background + '40' },
                  isCropped && { opacity: 0.5 },
                ]}
                onPress={handleCrop}
                disabled={isCropped || isProcessing}
              >
                <MaterialIcons name="crop" size={24} color={colors.text} />
                <Text style={[styles.toolText, { color: colors.text }]}>
                  {isCropped ? 'Cropped' : 'Crop'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.retakeButton, { backgroundColor: colors.icon + '40' }]}
              onPress={handleRetake}
            >
              <MaterialIcons name="refresh" size={18} color={colors.text} />
              <Text style={[styles.actionButtonText, { color: colors.text }]}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton, { backgroundColor: colors.tint }]}
              onPress={handleSavePhoto}
              disabled={isProcessing}
            >
              <MaterialIcons name="check" size={18} color={colors.background} />
              <Text style={[styles.saveButtonText, { color: colors.background }]}>
                {isProcessing ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.cameraContainer, { backgroundColor: colors.background }]}>
      <Animated.View style={[styles.cameraWrapper, animatedStyle]}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        />
        <View style={[styles.cameraOverlay, { backgroundColor: colors.background + '20' }]}>
          <View style={styles.topControls}>
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: colors.icon + '80' }]}
              onPress={toggleCameraFacing}
            >
              <MaterialIcons name="flip-camera-android" size={18} color={colors.text} />
              <Text style={[styles.controlButtonText, { color: colors.text }]}>Flip</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={[styles.captureButton, { backgroundColor: colors.tint }]}
              onPress={takePicture}
              disabled={isProcessing}
            >
              <MaterialIcons name="camera-alt" size={18} color="#fff" />
              <Text style={styles.captureButtonText}>
                {isProcessing ? 'Processing...' : 'Capture'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  cameraContainer: {
    height: 400,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  previewWrapper: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
  },
  cameraWrapper: {
    height: 400,
    position: 'relative',
  },
  camera: {
    height: 400,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    gap: 6,
    minWidth: 80,
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 6,
    minWidth: 140,
  },
  captureButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  previewContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#000',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  filterOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
  },
  grayscaleFilter: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#808080',
    opacity: 0.6,
  },
  sepiaFilter: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#704214',
    opacity: 0.4,
  },
  filtersContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sliderContainer: {
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  toolsContainer: {
    marginBottom: 20,
  },
  toolsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  toolButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  toolText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6,
  },
  retakeButton: {},
  saveButton: {},
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cropDarkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cropBox: {
    position: 'absolute',
    borderWidth: 2,
    borderStyle: 'solid',
  },
  cornerHandle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  topLeft: {
    top: -10,
    left: -10,
  },
  topRight: {
    top: -10,
    right: -10,
  },
  bottomLeft: {
    bottom: -10,
    left: -10,
  },
  bottomRight: {
    bottom: -10,
    right: -10,
  },
});
