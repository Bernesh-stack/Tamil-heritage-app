// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, Feather } from '@expo/vector-icons';

import SignUpScreen from '../screens/SignUpScreen';
import LoginScreen from '../screens/LoginScreen';
import HeritageScreen from '../screens/HeritageScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function getTabIcon(routeName, focused, color, size) {
    const s = focused ? size + 2 : size;
    if (routeName === 'Home') {
        return <Ionicons name={focused ? 'home' : 'home-outline'} size={s} color={color} />;
    }
    if (routeName === 'Map') {
        return <Ionicons name={focused ? 'map' : 'map-outline'} size={s} color={color} />;
    }
    if (routeName === 'Saved') {
        return <Ionicons name={focused ? 'bookmark' : 'bookmark-outline'} size={s} color={color} />;
    }
    if (routeName === 'Profile') {
        return <Feather name="user" size={s} color={color} />;
    }
    return <Ionicons name="ellipse-outline" size={s} color={color} />;
}

function AppTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopColor: COLORS.border,
                    borderTopWidth: 1,
                    height: 70,
                    paddingBottom: 12,
                    paddingTop: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.08,
                    shadowRadius: 12,
                    elevation: 10,
                },
                tabBarActiveTintColor: COLORS.green,
                tabBarInactiveTintColor: COLORS.light,
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600',
                    letterSpacing: 0.3,
                },
                tabBarIcon: ({ color, size, focused }) =>
                    getTabIcon(route.name, focused, color, size),
            })}
        >
            <Tab.Screen name="Home" component={HeritageScreen} />
            <Tab.Screen name="Map" component={PlaceholderScreen} />
            <Tab.Screen name="Saved" component={PlaceholderScreen} />
            <Tab.Screen name="Profile" component={PlaceholderScreen} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="AppTabs" component={AppTabs} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
