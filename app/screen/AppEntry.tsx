import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import App from '../(tabs)/App'; // Adjust the path to where your main App component is

export default function Main() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <App />
    </GestureHandlerRootView>
  );
}
