// src/screens/HeritageScreen.js
import React, { useState } from 'react';
import {
    View, Text, TextInput, Image, ScrollView, TouchableOpacity,
    StyleSheet, StatusBar, Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

const SITES = [
    {
        id: '1',
        name: 'Brihadisvara Temple',
        location: 'THANJAVUR',
        description: 'UNESCO World Heritage Site',
        detail: 'Thanjavur',
        image: require('../../assets/images/brihadeeswarar.png'),
    },
    {
        id: '2',
        name: 'Meenakshi Amman',
        location: 'MADURAI',
        description: 'Iconic Dravidian Architecture',
        detail: 'Madurai',
        image: require('../../assets/images/meenakshi.png'),
    },
    {
        id: '3',
        name: 'Shore Temple',
        location: 'MAHABALIPURAM',
        description: 'Shorefront Rock-cut Temple',
        detail: 'Mahabalipuram',
        image: require('../../assets/images/shore.png'),
    },
];

const FILTERS = ['All Locations', 'Madurai', 'Thanjavur'];

export default function HeritageScreen() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All Locations');
    const [bookmarked, setBookmarked] = useState({});

    const toggleBookmark = (id) => setBookmarked(b => ({ ...b, [id]: !b[id] }));

    const filtered = SITES.filter(s => {
        const q = search.toLowerCase();
        const matchSearch = s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q);
        const matchFilter = filter === 'All Locations' || s.detail === filter;
        return matchSearch && matchFilter;
    });

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
                        <Text style={styles.brandTop}>DIGITAL PRESERVATION</Text>
                        <Text style={styles.brandBtm}>Heritage Sites</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.langBadge}>
                    <Text style={styles.langText}>EN</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Hero */}
                <View style={styles.hero}>
                    <Text style={styles.heroTitle}>Explore Heritage</Text>
                    <Text style={styles.heroSub}>Discover the timeless wonders of Tamil Nadu</Text>
                </View>

                {/* Search */}
                <View style={styles.searchBar}>
                    <Feather name="search" size={18} color={COLORS.light} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search Sites..."
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

                {/* Cards */}
                <View style={styles.cardList}>
                    {filtered.length === 0 ? (
                        <View style={styles.emptyWrap}>
                            <MaterialCommunityIcons name="temple-hindu" size={40} color={COLORS.light} />
                            <Text style={styles.emptyText}>No sites match your search.</Text>
                        </View>
                    ) : (
                        filtered.map(site => (
                            <View key={site.id} style={styles.card}>
                                {/* Image */}
                                <View style={styles.cardImgWrap}>
                                    <Image source={site.image} style={styles.cardImg} resizeMode="cover" />
                                    {/* Location badge */}
                                    <View style={styles.locationBadge}>
                                        <Ionicons name="location-sharp" size={10} color="#fff" />
                                        <Text style={styles.locationText}>{site.location}</Text>
                                    </View>
                                    {/* Bookmark */}
                                    <TouchableOpacity style={styles.bookmarkBtn} onPress={() => toggleBookmark(site.id)}>
                                        <Ionicons
                                            name={bookmarked[site.id] ? 'bookmark' : 'bookmark-outline'}
                                            size={16}
                                            color={bookmarked[site.id] ? COLORS.orange : COLORS.dark}
                                        />
                                    </TouchableOpacity>
                                </View>
                                {/* Body */}
                                <View style={styles.cardBody}>
                                    <View style={styles.cardInfo}>
                                        <Text style={styles.cardName}>{site.name}</Text>
                                        <Text style={styles.cardDesc}>{site.description}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.btnView}
                                        onPress={() => Alert.alert(`🏛️ ${site.name}`, `${site.description}\n\nLocation: ${site.detail}`)}
                                        activeOpacity={0.88}
                                    >
                                        <Text style={styles.btnViewText}>View</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
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

    topBar: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20, paddingTop: 14, paddingBottom: 8,
        backgroundColor: COLORS.pageBg,
    },
    brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    hamburger: { gap: 5 },
    hamLine: { width: 22, height: 2.5, backgroundColor: COLORS.dark, borderRadius: 2 },
    brandInfo: {},
    brandTop: { fontSize: 9, fontWeight: '700', letterSpacing: 2, color: COLORS.medium, textTransform: 'uppercase' },
    brandBtm: { fontSize: 15, fontWeight: '800', color: COLORS.dark },
    langBadge: {
        borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 8,
        paddingHorizontal: 10, paddingVertical: 5,
    },
    langText: { fontSize: 11, fontWeight: '700', color: COLORS.dark },

    hero: { paddingHorizontal: 20, paddingTop: 6 },
    heroTitle: { fontSize: 28, fontWeight: '800', color: COLORS.dark },
    heroSub: { fontSize: 13, color: COLORS.medium, marginTop: 4 },

    searchBar: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: COLORS.white, borderRadius: 50,
        marginHorizontal: 20, marginTop: 14,
        paddingHorizontal: 16, paddingVertical: 12,
        ...SHADOWS.sm,
        borderWidth: 1, borderColor: COLORS.border,
    },
    searchInput: { flex: 1, fontSize: 14, color: COLORS.dark },

    filterRow: { paddingHorizontal: 20, paddingTop: 14, gap: 10 },
    chip: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 50, flexShrink: 0 },
    chipActive: { backgroundColor: COLORS.green },
    chipInactive: { backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.border },
    chipText: { fontSize: 13, fontWeight: '600' },
    chipTextActive: { color: '#fff' },
    chipTextInactive: { color: COLORS.dark },

    cardList: { padding: 20, gap: 20 },

    card: {
        backgroundColor: COLORS.white, borderRadius: 16,
        overflow: 'hidden', ...SHADOWS.md,
    },
    cardImgWrap: { width: '100%', height: 200, position: 'relative' },
    cardImg: { width: '100%', height: '100%' },

    locationBadge: {
        position: 'absolute', bottom: 10, left: 12,
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: 'rgba(0,0,0,0.55)',
        borderRadius: 50, paddingHorizontal: 10, paddingVertical: 4,
    },
    locationText: { fontSize: 10, fontWeight: '700', color: '#fff', letterSpacing: 1.2 },

    bookmarkBtn: {
        position: 'absolute', top: 10, right: 10,
        width: 32, height: 32, borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.92)',
        alignItems: 'center', justifyContent: 'center',
        ...SHADOWS.sm,
    },

    cardBody: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', padding: 14,
    },
    cardInfo: { flex: 1, marginRight: 10 },
    cardName: { fontSize: 17, fontWeight: '800', color: COLORS.dark },
    cardDesc: { fontSize: 12.5, color: COLORS.medium, marginTop: 3 },

    btnView: {
        backgroundColor: COLORS.green, borderRadius: 50,
        paddingHorizontal: 20, paddingVertical: 10,
        shadowColor: COLORS.green, shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
    },
    btnViewText: { fontSize: 14, fontWeight: '700', color: '#fff' },

    emptyWrap: { alignItems: 'center', paddingTop: 40, gap: 12 },
    emptyText: { fontSize: 14, color: COLORS.light },
});
