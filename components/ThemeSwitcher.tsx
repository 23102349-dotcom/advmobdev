import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../providers/ThemeProvider';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCustomAccentColor, setThemeMode } from '../store/themeSlice';

const PRESET_COLORS = [
  '#0a7ea4', // Default blue
  '#ff6b6b', // Red
  '#4ecdc4', // Teal
  '#45b7d1', // Light blue
  '#96ceb4', // Green
  '#feca57', // Yellow
  '#ff9ff3', // Pink
  '#54a0ff', // Blue
];

export function ThemeSwitcher() {
  const { colors, themeMode } = useTheme();
  const dispatch = useAppDispatch();
  const { customAccentColor } = useAppSelector((state) => state.theme);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleThemeChange = (mode: 'light' | 'dark' | 'custom') => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    dispatch(setThemeMode(mode));
  };

  const handleColorSelect = (color: string) => {
    dispatch(setCustomAccentColor(color));
    setShowColorPicker(false);
  };

  const ColorPickerModal = () => (
    <Modal
      visible={showColorPicker}
      transparent
      animationType="fade"
      onRequestClose={() => setShowColorPicker(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            Choose Accent Color
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.colorGrid}>
              {PRESET_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    customAccentColor === color && styles.selectedColor,
                  ]}
                  onPress={() => handleColorSelect(color)}
                />
              ))}
            </View>
          </ScrollView>
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.tint }]}
            onPress={() => setShowColorPicker(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Theme Settings</Text>
      
      <View style={styles.themeOptions}>
        <Animated.View style={animatedStyle}>
          <TouchableOpacity
            style={[
              styles.themeOption,
              { backgroundColor: '#fff', borderColor: colors.tint },
              themeMode === 'light' && styles.selectedTheme,
            ]}
            onPress={() => handleThemeChange('light')}
          >
            <Text style={[styles.themeText, { color: '#11181C' }]}>Light</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={animatedStyle}>
          <TouchableOpacity
            style={[
              styles.themeOption,
              { backgroundColor: '#151718', borderColor: colors.tint },
              themeMode === 'dark' && styles.selectedTheme,
            ]}
            onPress={() => handleThemeChange('dark')}
          >
            <Text style={[styles.themeText, { color: '#ECEDEE' }]}>Dark</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={animatedStyle}>
          <TouchableOpacity
            style={[
              styles.themeOption,
              { backgroundColor: '#fff', borderColor: colors.tint },
              themeMode === 'custom' && styles.selectedTheme,
            ]}
            onPress={() => handleThemeChange('custom')}
          >
            <Text style={[styles.themeText, { color: '#11181C' }]}>Custom</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {themeMode === 'custom' && (
        <View style={styles.customSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Custom Accent Color
          </Text>
          <TouchableOpacity
            style={[styles.colorPreview, { backgroundColor: customAccentColor }]}
            onPress={() => setShowColorPicker(true)}
          >
            <Text style={styles.colorText}>{customAccentColor}</Text>
          </TouchableOpacity>
        </View>
      )}

      <ColorPickerModal />
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
    marginBottom: 20,
    textAlign: 'center',
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  themeOption: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedTheme: {
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  themeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  customSection: {
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  colorPreview: {
    padding: 15,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  colorText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 20,
    borderRadius: 15,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#000',
    borderWidth: 3,
  },
  closeButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
