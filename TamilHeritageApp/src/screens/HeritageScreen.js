import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, TextInput, Image, ScrollView, TouchableOpacity,
    StyleSheet, StatusBar, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import api from '../api';
import { COLORS, SHADOWS } from '../constants/theme';
import HeritageCard from '../components/HeritageCard';

const FILTERS = ['All Locations', 'Madurai', 'Thanjavur', 'Mahabalipuram'];

export default function HeritageScreen({ navigation }) {
    const [sites, setSites] = useState([]);
    const [savedSiteIds, setSavedSiteIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All Locations');
    const [language, setLanguage] = useState('EN'); // EN or TA

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [sitesRes, savedRes] = await Promise.all([
                api.get('/api/heritage-sites'),
                api.get('/api/saved-sites'),
            ]);
            setSites(sitesRes.data);
            setSavedSiteIds(new Set(savedRes.data.map(s => s.siteId?._id || s.siteId)));
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Could not load heritage sites. Please check your connection.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const toggleBookmark = async (siteId) => {
        const isSaved = savedSiteIds.has(siteId);
        try {
            if (isSaved) {
                await api.delete(`/api/saved-sites/${siteId}`);
                setSavedSiteIds(prev => {
                    const next = new Set(prev);
                    next.delete(siteId);
                    return next;
                });
            } else {
                await api.post('/api/saved-sites', { siteId });
                setSavedSiteIds(prev => new Set(prev).add(siteId));
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to update saved sites. Please try again.');
        }
    };

    const toggleLanguage = () => {
        setLanguage(l => (l === 'EN' ? 'TA' : 'EN'));
    };

    const filtered = sites.filter(s => {
        const q = search.toLowerCase();
        const matchSearch = s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q);
        const matchFilter = filter === 'All Locations' || s.location.includes(filter) || s.detail === filter;
        return matchSearch && matchFilter;
    });

    const getTranslation = (key) => {
        if (language === 'EN') return key;
        const translations = {
            'Explore Heritage': 'பாரம்பரியத்தை ஆராயுங்கள்',
            'Discover the timeless wonders of Tamil Nadu': 'தமிழ்நாட்டின் காலமற்ற அதிசயங்களைக் கண்டறியுங்கள்',
            'Search Sites...': 'தளங்களைத் தேடுங்கள்...',
            'Loading heritage sites…': 'பாரம்பரிய தளங்களை ஏற்றுகிறது...',
            'No sites match your search.': 'உங்கள் தேடலுக்கு எந்தத் தளங்களும் பொருந்தவில்லை.',
            'View': 'காண்க',
            'Heritage Sites': 'பாரம்பரிய இடங்கள்',
            'DIGITAL PRESERVATION': 'டிஜிட்டல் பாதுகாப்பு',
        };
        return translations[key] || key;
    };

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.pageBg} />

            {/* Top Bar */}
            <View style={styles.topBar}>
                <View style={styles.brandRow}>
                    <TouchableOpacity style={styles.hamburger}>
                        <View style={styles.hamLine} />
                        <View style={styles.hamLine} />
                        <View style={styles.hamLine} />
                    </TouchableOpacity>
                    <View style={styles.brandInfo}>
                        <Text style={styles.brandTop}>{getTranslation('DIGITAL PRESERVATION')}</Text>
                        <Text style={styles.brandBtm}>{getTranslation('Heritage Sites')}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.langBadge} onPress={toggleLanguage}>
                    <Text style={styles.langText}>{language}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Hero */}
                <View style={styles.hero}>
                    <Text style={styles.heroTitle}>{getTranslation('Explore Heritage')}</Text>
                    <Text style={styles.heroSub}>{getTranslation('Discover the timeless wonders of Tamil Nadu')}</Text>
                </View>

                {/* Search */}
                <View style={styles.searchBar}>
                    <Feather name="search" size={18} color={COLORS.light} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={getTranslation('Search Sites...')}
                        placeholderTextColor={COLORS.light}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                {/* Filter Chips */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
                    {FILTERS.map(f => (
                        <TouchableOpacity
                            key={f}
                            style={[styles.chip, filter === f ? styles.chipActive : styles.chipInactive]}
                            onPress={() => setFilter(f)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.chipText, filter === f ? styles.chipTextActive : styles.chipTextInactive]}>{f}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Content */}
                <View style={styles.cardList}>
                    {loading ? (
                        <View style={styles.centerWrap}>
                            <ActivityIndicator size="large" color={COLORS.orange} />
                            <Text style={styles.loadingText}>{getTranslation('Loading heritage sites…')}</Text>
                        </View>
                    ) : error ? (
                        <View style={styles.centerWrap}>
                            <MaterialCommunityIcons name="wifi-off" size={40} color={COLORS.light} />
                            <Text style={styles.emptyText}>{error}</Text>
                            <TouchableOpacity style={styles.retryBtn} onPress={fetchData}>
                                <Text style={styles.retryText}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    ) : filtered.length === 0 ? (
                        <View style={styles.centerWrap}>
                            <MaterialCommunityIcons name="temple-hindu" size={40} color={COLORS.light} />
                            <Text style={styles.emptyText}>{getTranslation('No sites match your search.')}</Text>
                        </View>
                    ) : (
                        filtered.map(site => (
                            <HeritageCard
                                key={site._id}
                                site={site}
                                isBookmarked={savedSiteIds.has(site._id)}
                                onBookmarkPress={() => toggleBookmark(site._id)}
                                onPress={() => navigation.navigate('SiteDetails', { siteId: site._id })}
                            />
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: COLORS.pageBg },
    scrollContent: { paddingBottom: 20 },
    topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 8, backgroundColor: COLORS.pageBg },
    brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    hamburger: { gap: 5 },
    hamLine: { width: 22, height: 2.5, backgroundColor: COLORS.dark, borderRadius: 2 },
    brandInfo: {},
    brandTop: { fontSize: 9, fontWeight: '700', letterSpacing: 2, color: COLORS.medium, textTransform: 'uppercase' },
    brandBtm: { fontSize: 15, fontWeight: '800', color: COLORS.dark },
    langBadge: { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
    langText: { fontSize: 11, fontWeight: '700', color: COLORS.dark },
    hero: { paddingHorizontal: 20, paddingTop: 6 },
    heroTitle: { fontSize: 28, fontWeight: '800', color: COLORS.dark },
    heroSub: { fontSize: 13, color: COLORS.medium, marginTop: 4 },
    searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.white, borderRadius: 50, marginHorizontal: 20, marginTop: 14, paddingHorizontal: 16, paddingVertical: 12, ...SHADOWS.sm, borderWidth: 1, borderColor: COLORS.border },
    searchInput: { flex: 1, fontSize: 14, color: COLORS.dark },
    filterRow: { paddingHorizontal: 20, paddingTop: 14, gap: 10 },
    chip: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 50, flexShrink: 0 },
    chipActive: { backgroundColor: COLORS.green },
    chipInactive: { backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.border },
    chipText: { fontSize: 13, fontWeight: '600' },
    chipTextActive: { color: '#fff' },
    chipTextInactive: { color: COLORS.dark },
    cardList: { padding: 20, gap: 20 },
    centerWrap: { alignItems: 'center', paddingTop: 40, gap: 12 },
    loadingText: { fontSize: 14, color: COLORS.medium, marginTop: 8 },
    emptyText: { fontSize: 14, color: COLORS.light, textAlign: 'center' },
    retryBtn: { backgroundColor: COLORS.orange, borderRadius: 50, paddingHorizontal: 24, paddingVertical: 10, marginTop: 4 },
    retryText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    card: { backgroundColor: COLORS.white, borderRadius: 16, overflow: 'hidden', ...SHADOWS.md },
    cardImgWrap: { width: '100%', height: 200, position: 'relative' },
    cardImg: { width: '100%', height: '100%' },
    locationBadge: { position: 'absolute', bottom: 10, left: 12, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 50, paddingHorizontal: 10, paddingVertical: 4 },
    locationText: { fontSize: 10, fontWeight: '700', color: '#fff', letterSpacing: 1.2 },
    bookmarkBtn: { position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center', ...SHADOWS.sm },
    cardBody: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
    cardInfo: { flex: 1, marginRight: 10 },
    cardName: { fontSize: 17, fontWeight: '800', color: COLORS.dark },
    cardDesc: { fontSize: 12.5, color: COLORS.medium, marginTop: 3 },
    btnView: { backgroundColor: COLORS.green, borderRadius: 50, paddingHorizontal: 20, paddingVertical: 10, shadowColor: COLORS.green, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
    btnViewText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
