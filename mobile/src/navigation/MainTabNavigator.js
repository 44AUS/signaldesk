// Main Tab Navigator - Bottom tabs for SignalDesk AI
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { colors } from '../utils/theme';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import SignalsScreen from '../screens/SignalsScreen';
import SignalDetailScreen from '../screens/SignalDetailScreen';
import PerformanceScreen from '../screens/PerformanceScreen';
import AccountScreen from '../screens/AccountScreen';

const Tab = createBottomTabNavigator();
const SignalsStack = createNativeStackNavigator();

// Signals Stack Navigator
const SignalsStackNavigator = () => (
  <SignalsStack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: colors.background },
    }}
  >
    <SignalsStack.Screen name="SignalsList" component={SignalsScreen} />
    <SignalsStack.Screen 
      name="SignalDetail" 
      component={SignalDetailScreen}
      options={{ animation: 'slide_from_right' }}
    />
  </SignalsStack.Navigator>
);

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.buy,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarBackground: () => (
          <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'Signals':
              iconName = focused ? 'pulse' : 'pulse-outline';
              break;
            case 'Performance':
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
              break;
            case 'Account':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return (
            <View style={focused ? styles.activeIconContainer : null}>
              <Ionicons name={iconName} size={24} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="Signals" 
        component={SignalsStackNavigator}
        options={{ tabBarLabel: 'Signals' }}
      />
      <Tab.Screen 
        name="Performance" 
        component={PerformanceScreen}
        options={{ tabBarLabel: 'Stats' }}
      />
      <Tab.Screen 
        name="Account" 
        component={AccountScreen}
        options={{ tabBarLabel: 'Account' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: 'rgba(20, 20, 31, 0.9)',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 85,
    paddingTop: 8,
    paddingBottom: 28,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
  activeIconContainer: {
    backgroundColor: colors.buyGlow,
    borderRadius: 12,
    padding: 8,
    marginBottom: -4,
  },
});

export default MainTabNavigator;
