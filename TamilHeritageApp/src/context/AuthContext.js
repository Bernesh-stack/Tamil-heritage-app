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
            const token = await AsyncStorage.getItem('authToken');
            const userJson = await AsyncStorage.getItem('currentUser');
            if (token && userJson) {
                setUserToken(token);
                setUser(JSON.parse(userJson));
            }
        } catch (e) {
            console.error('Session check error:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (token, userData) => {
        setUserToken(token);
        setUser(userData);
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('currentUser', JSON.stringify(userData));
    };

    const logout = async () => {
        setUserToken(null);
        setUser(null);
        await AsyncStorage.multiRemove(['authToken', 'currentUser', 'profilePhoto', 'adminProfilePhoto']);
    };

    return (
        <AuthContext.Provider value={{ isLoading, userToken, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
