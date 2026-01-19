// SignalDesk AI - App Entry Point
import React from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/context/AuthContext';
import { SubscriptionProvider } from './src/context/SubscriptionContext';
import RootNavigator from './src/navigation/RootNavigator';

// Platform-specific font families
const getFontFamily = () => {
  if (Platform.OS === 'ios') {
    return 'System';
  } else if (Platform.OS === 'android') {
    return 'sans-serif';
  }
  return 'System';
};

const getMediumFontFamily = () => {
  if (Platform.OS === 'ios') {
    return 'System';
  } else if (Platform.OS === 'android') {
    return 'sans-serif-medium';
  }
  return 'System';
};

// Define theme with fonts required by React Navigation v7
const customTheme = {
  dark: true,
  colors: {
    primary: '#10B981',
    background: '#0A0A0F',
    card: '#14141F',
    text: '#FFFFFF',
    border: '#1F1F2E',
    notification: '#10B981',
  },
  fonts: {
    regular: {
      fontFamily: getFontFamily(),
      fontWeight: '400',
    },
    medium: {
      fontFamily: getMediumFontFamily(),
      fontWeight: '500',
    },
    bold: {
      fontFamily: getFontFamily(),
      fontWeight: '600',
    },
    heavy: {
      fontFamily: getFontFamily(),
      fontWeight: '700',
    },
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <NavigationContainer theme={customTheme}>
              <StatusBar style="light" />
              <RootNavigator />
            </NavigationContainer>
          </SubscriptionProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
