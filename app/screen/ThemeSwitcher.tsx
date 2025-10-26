import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export default function ThemeSwitcherScreen() {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Theme Switcher Demo
        </ThemedText>
        <ThemedText style={styles.description}>
          This screen demonstrates the theme switcher with Redux state management, 
          smooth animations, and custom color options. Try switching between light, 
          dark, and custom themes!
        </ThemedText>
        <ThemeSwitcher />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
});
