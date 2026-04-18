import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../api';
import { COLORS } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function MapScreen() {
    const [sites, setSites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        fetchSites();
    }, []);

    const fetchSites = async () => {
        try {
            const response = await api.get('/api/heritage-sites');
            const validSites = response.data.filter(s => s.latitude && s.longitude);
            setSites(validSites);
        } catch (error) {
            console.error('Error fetching sites for map:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.orange} />
            </View>
        );
    }

    return (
        <View style={styles.webContainer}>
            <MaterialCommunityIcons name="map-marker-radius" size={80} color={COLORS.orange} />
            <Text style={styles.webTitle}>Interactive Map</Text>
            <Text style={styles.webSub}>The dynamic map pins are optimized for Android & iOS devices.</Text>
            <TouchableOpacity 
                style={styles.webBtn}
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={styles.webBtnText}>Go to Site List</Text>
            </TouchableOpacity>
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{sites.length} Heritage Sites Pinned</Text>
                <Text style={styles.headerSub}>Open this app on your phone to see all Pins!</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.pageBg },
    webContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, backgroundColor: COLORS.pageBg },
    webTitle: { fontSize: 24, fontWeight: '800', color: COLORS.dark, marginTop: 20 },
    webSub: { fontSize: 16, color: COLORS.medium, textAlign: 'center', marginTop: 10, lineHeight: 24 },
    webBtn: { backgroundColor: COLORS.orange, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, marginTop: 30 },
    webBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    header: {
        marginTop: 40,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        alignItems: 'center'
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.dark },
    headerSub: { fontSize: 12, color: COLORS.medium, marginTop: 4 },
});
