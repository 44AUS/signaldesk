// SignalDesk AI - App Entry Point
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/context/AuthContext';
import { SubscriptionProvider } from './src/context/SubscriptionContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <NavigationContainer
              theme={{
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
                    fontFamily: 'System',
                    fontWeight: 'normal',
                  },
                  medium: {
                    fontFamily: 'System',
                    fontWeight: '500',
                  },
                  bold: {
                    fontFamily: 'System',
                    fontWeight: 'bold',
                  },
                  heavy: {
                    fontFamily: 'System',
                    fontWeight: '800',
                  },
                },
              }}
            >
              <StatusBar style="light" />
              <RootNavigator />
            </NavigationContainer>
          </SubscriptionProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
