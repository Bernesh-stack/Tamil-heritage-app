import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            setIsLoading(true);
            const token = await AsyncStorage.getItem('authToken');
            const userJson = await AsyncStorage.getItem('currentUser');
            
            if (token && userJson) {
                const userData = JSON.parse(userJson);
                setUserToken(token);
                setUser(userData);
                console.log('Session restored for:', userData.email);
            } else {
                console.log('No active session found.');
            }
        } catch (e) {
            console.error('Session check error:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (token, userData) => {
        try {
            setUserToken(token);
            setUser(userData);
            await AsyncStorage.setItem('authToken', token);
            await AsyncStorage.setItem('currentUser', JSON.stringify(userData));
        } catch (e) {
            console.error('Error saving session:', e);
        }
    };

    const logout = async () => {
        try {
            setUserToken(null);
            setUser(null);
            await AsyncStorage.multiRemove([
                'authToken', 
                'currentUser', 
                'profilePhoto', 
                'adminProfilePhoto',
                'NAVIGATION_STATE_V1'
            ]);
        } catch (e) {
            console.error('Error clearing session:', e);
        }
    };

    return (
        <AuthContext.Provider value={{ isLoading, userToken, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
