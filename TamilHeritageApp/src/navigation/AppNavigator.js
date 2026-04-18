import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

import SignUpScreen from '../screens/SignUpScreen';
import LoginScreen from '../screens/LoginScreen';
import HeritageScreen from '../screens/HeritageScreen';
import SiteDetailsScreen from '../screens/SiteDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminProfileScreen from '../screens/AdminProfileScreen';
import AdminSiteFormScreen from '../screens/AdminSiteFormScreen';
import SavedScreen from '../screens/SavedScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';

// ── User bottom tabs ──────────────────────────────────────
function UserTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: { backgroundColor: '#fff', borderTopColor: COLORS.border, borderTopWidth: 1, height: 70, paddingBottom: 12, paddingTop: 8, elevation: 10 },
                tabBarActiveTintColor: COLORS.green,
                tabBarInactiveTintColor: COLORS.light,
                tabBarLabelStyle: { fontSize: 10, fontWeight: '600', letterSpacing: 0.3 },
                tabBarIcon: ({ color, size, focused }) => {
                    const s = focused ? size + 2 : size;
                    if (route.name === 'Home')    return <Ionicons name={focused ? 'home' : 'home-outline'} size={s} color={color} />;
                    if (route.name === 'Map')     return <Ionicons name={focused ? 'map' : 'map-outline'} size={s} color={color} />;
                    if (route.name === 'Saved')   return <Ionicons name={focused ? 'bookmark' : 'bookmark-outline'} size={s} color={color} />;
                    if (route.name === 'Profile') return <Feather name="user" size={s} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HeritageScreen} />
            <Tab.Screen name="Map" component={PlaceholderScreen} />
            <Tab.Screen name="Saved" component={SavedScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

// ── Admin bottom tabs ─────────────────────────────────────
function AdminTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: { backgroundColor: '#fff', borderTopColor: COLORS.border, borderTopWidth: 1, height: 70, paddingBottom: 12, paddingTop: 8, elevation: 10 },
                tabBarActiveTintColor: COLORS.orange,
                tabBarInactiveTintColor: COLORS.light,
                tabBarLabelStyle: { fontSize: 10, fontWeight: '600', letterSpacing: 0.3 },
                tabBarIcon: ({ color, size, focused }) => {
                    const s = focused ? size + 2 : size;
                    if (route.name === 'Dash')    return <MaterialCommunityIcons name={focused ? 'view-dashboard' : 'view-dashboard-outline'} size={s} color={color} />;
                    if (route.name === 'Explore') return <Ionicons name={focused ? 'compass' : 'compass-outline'} size={s} color={color} />;
                    if (route.name === 'Logs')    return <MaterialCommunityIcons name={focused ? 'file-document' : 'file-document-outline'} size={s} color={color} />;
                    if (route.name === 'Profile') return <Feather name="user" size={s} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Dash" component={AdminDashboardScreen} />
            <Tab.Screen name="Explore" component={HeritageScreen} />
            <Tab.Screen name="Logs" component={PlaceholderScreen} />
            <Tab.Screen name="Profile" component={AdminProfileScreen} />
        </Tab.Navigator>
    );
}

// ── Root navigator ────────────────────────────────────────
export default function AppNavigator() {
    const { isLoading: authLoading, userToken, user } = useAuth();
    const [isNavReady, setIsNavReady] = React.useState(false);
    const [initialState, setInitialState] = React.useState();

    React.useEffect(() => {
        const restoreState = async () => {
            try {
                const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
                const state = savedStateString ? JSON.parse(savedStateString) : undefined;
                if (state !== undefined) {
                    setInitialState(state);
                }
            } catch (e) {
                console.error('Failed to restore navigation state:', e);
            } finally {
                setIsNavReady(true);
            }
        };

        if (!authLoading) {
            restoreState();
        }
    }, [authLoading]);

    if (authLoading || !isNavReady) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.pageBg }}>
                <ActivityIndicator size="large" color={COLORS.orange} />
            </View>
        );
    }

    const isAdmin = user?.isAdmin;

    return (
        <NavigationContainer
            initialState={initialState}
            onStateChange={(state) =>
                AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
            }
        >
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {userToken == null ? (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="SignUp" component={SignUpScreen} />
                    </>
                ) : isAdmin ? (
                    <>
                        <Stack.Screen name="AdminTabs" component={AdminTabs} />
                        <Stack.Screen name="AdminSiteForm" component={AdminSiteFormScreen} />
                        <Stack.Screen name="SiteDetails" component={SiteDetailsScreen} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="AppTabs" component={UserTabs} />
                        <Stack.Screen name="SiteDetails" component={SiteDetailsScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
