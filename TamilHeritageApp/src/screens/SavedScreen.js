import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, ScrollView, StyleSheet, StatusBar,
    ActivityIndicator, TouchableOpacity, Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../api';
import HeritageCard from '../components/HeritageCard';
import { COLORS, SHADOWS } from '../constants/theme';

export default function SavedScreen({ navigation }) {
    const [savedSites, setSavedSites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchSavedSites = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/api/saved-sites');
            // Backend populates siteId, so mapped to the site object
            const sites = res.data
                .map(item => item.siteId)
                .filter(site => site !== null); // safety check
            setSavedSites(sites);
        } catch (err) {
            console.error('Fetch saved error:', err);
            setError('Could not load saved sites.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchSavedSites();
        });
        return unsubscribe;
    }, [navigation, fetchSavedSites]);

    const handleUnsave = async (siteId) => {
        try {
            await api.delete(`/api/saved-sites/${siteId}`);
            setSavedSites(prev => prev.filter(s => s._id !== siteId));
        } catch (err) {
            Alert.alert('Error', 'Failed to remove site.');
        }
    };

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.pageBg} />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Saved Sites</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {loading ? (
                    <View style={styles.centerWrap}>
                        <ActivityIndicator size="large" color={COLORS.orange} />
                        <Text style={styles.loadingText}>Loading your favorites…</Text>
                    </View>
                ) : error ? (
                    <View style={styles.centerWrap}>
                        <MaterialCommunityIcons name="alert-circle-outline" size={48} color={COLORS.light} />
                        <Text style={styles.emptyText}>{error}</Text>
                        <TouchableOpacity style={styles.retryBtn} onPress={fetchSavedSites}>
                            <Text style={styles.retryText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : savedSites.length === 0 ? (
                    <View style={styles.centerWrap}>
                        <MaterialCommunityIcons name="bookmark-outline" size={60} color={COLORS.light} />
                        <Text style={styles.emptyTitle}>No saved sites yet</Text>
                        <Text style={styles.emptySub}>Start exploring and save your favorite heritage spots!</Text>
                        <TouchableOpacity 
                            style={styles.exploreBtn} 
                            onPress={() => navigation.navigate('Home')}
                        >
                            <Text style={styles.exploreBtnText}>Explore Sites</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.cardList}>
                        {savedSites.map(site => (
                            <HeritageCard
                                key={site._id}
                                site={site}
                                isBookmarked={true}
                                onBookmarkPress={() => handleUnsave(site._id)}
                                onPress={() => navigation.navigate('SiteDetails', { siteId: site._id })}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: COLORS.pageBg },
    header: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 12, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.dark },
    scrollContent: { paddingBottom: 40 },
    cardList: { padding: 20 },
    centerWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 100, paddingHorizontal: 40 },
    loadingText: { fontSize: 14, color: COLORS.medium, marginTop: 12 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.dark, marginTop: 16 },
    emptySub: { fontSize: 14, color: COLORS.medium, textAlign: 'center', marginTop: 8, lineHeight: 20 },
    emptyText: { fontSize: 14, color: COLORS.medium, textAlign: 'center' },
    exploreBtn: { backgroundColor: COLORS.orange, borderRadius: 50, paddingHorizontal: 30, paddingVertical: 14, marginTop: 24, ...SHADOWS.sm },
    exploreBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    retryBtn: { backgroundColor: COLORS.orange, borderRadius: 50, paddingHorizontal: 24, paddingVertical: 10, marginTop: 12 },
    retryText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
