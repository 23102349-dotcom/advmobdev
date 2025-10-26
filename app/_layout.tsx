import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ReduxProvider } from '@/providers/ReduxProvider';
import { ThemeProvider as CustomThemeProvider } from '@/providers/ThemeProvider';
import App from './(tabs)/App';

// Suppress SafeAreaView deprecation warning from React Navigation libraries
LogBox.ignoreLogs([
  'SafeAreaView has been deprecated',
]);

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ReduxProvider>
          <CustomThemeProvider>
            <ThemeProvider value={DefaultTheme}>
              <App />
              <StatusBar style="auto" />
            </ThemeProvider>
          </CustomThemeProvider>
        </ReduxProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
