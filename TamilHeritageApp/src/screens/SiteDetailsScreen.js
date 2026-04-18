import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, Image, ScrollView, TouchableOpacity,
    StyleSheet, StatusBar, Alert, Share, ActivityIndicator,
    Linking,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../api';
import { COLORS, SHADOWS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const IMAGE_MAP = {
    brihadeeswarar: require('../../assets/images/brihadeeswarar.png'),
    meenakshi:      require('../../assets/images/meenakshi.png'),
    shore:          require('../../assets/images/shore.png'),
    gangaikonda:    require('../../assets/images/gangaikonda.png'),
    airavatesvara:  require('../../assets/images/airavatesvara.png'),
    kapaleeshwarar: require('../../assets/images/kapaleeshwarar.png'),
    ramanathaswamy: require('../../assets/images/ramanathaswamy.png'),
    vivekananda:    require('../../assets/images/vivekananda.png'),
    nayakkar:       require('../../assets/images/nayakkar.png'),
    srirangam:      require('../../assets/images/srirangam.png'),
    gingee:         require('../../assets/images/gingee.png'),
    chidambaram:    require('../../assets/images/chidambaram.png'),
    nagaraja:       require('../../assets/images/nagaraja.png'),
};

const PLACEHOLDER_SITE = require('../../assets/images/brihadeeswarar.png');

export default function SiteDetailsScreen({ route, navigation }) {
    const { siteId } = route.params;
    const { user } = useAuth();
    const [site, setSite] = useState(null);
    const [loading, setLoading] = useState(true);
    const [favorited, setFavorited] = useState(false);

    const trackView = useCallback(async () => {
        try {
            const { data } = await api.put(`/api/users/view-site/${siteId}`);
            if (data.triggerFeedback) {
                Alert.alert(
                    "Smart Feedback",
                    "Would you like to give feedback?",
                    [
                        { text: "No", style: "cancel" },
                        { 
                            text: "Yes", 
                            onPress: () => Alert.alert("Feedback", "Feedback form coming soon! Thank you for your interest.") 
                        }
                    ]
                );
            }
        } catch (err) {
            console.log('Error tracking view:', err);
        }
    }, [siteId]);

    const fetchDetails = useCallback(async () => {
        setLoading(true);
        try {
            const [siteRes, savedRes] = await Promise.all([
                api.get(`/api/heritage-sites/${siteId}`),
                api.get('/api/saved-sites'),
            ]);
            setSite(siteRes.data);
            const isSaved = savedRes.data.some(s => (s.siteId?._id || s.siteId) === siteId);
            setFavorited(isSaved);
            
            // Track view after details are loaded
            trackView();
        } catch (err) {
            Alert.alert('Error', 'Could not load site details.');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    }, [siteId, navigation, trackView]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    const handleToggleFavorite = async () => {
        try {
            if (favorited) {
                await api.delete(`/api/saved-sites/${siteId}`);
            } else {
                await api.post('/api/saved-sites', { siteId });
            }
            setFavorited(!favorited);
        } catch (err) {
            Alert.alert('Error', 'Failed to update favorite status.');
        }
    };

    const handleShare = async () => {
        if (!site) return;
        await Share.share({ message: `Explore ${site.name} — ${site.location}. Discover more on Tamil Heritage App!` });
    };

    const handleDeleteSite = () => {
        Alert.alert(
            "Delete Site",
            "Are you sure you want to permanently remove this heritage site?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`/api/heritage-sites/${siteId}`);
                            Alert.alert("Success", "Site removed successfully.");
                            navigation.goBack();
                        } catch (err) {
                            Alert.alert("Error", "Failed to delete site.");
                        }
                    }
                }
            ]
        );
    };

    const handleGetDirections = () => {
        if (site.googleMapsUrl) {
            Linking.openURL(site.googleMapsUrl).catch(() => Alert.alert('Error', 'Could not open Google Maps.'));
        } else if (site.latitude && site.longitude) {
            const url = `https://www.google.com/maps?q=${site.latitude},${site.longitude}`;
            Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open Google Maps.'));
        } else {
            Alert.alert('Directions not available', 'No address or coordinates provided for this site.');
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderWrap}>
                <ActivityIndicator size="large" color={COLORS.orange} />
                <Text style={styles.loaderText}>Loading details…</Text>
            </View>
        );
    }

    if (!site) return null;

    const heroImage = (site.imageKey && IMAGE_MAP[site.imageKey]) 
        ? IMAGE_MAP[site.imageKey] 
        : (site.image ? { uri: site.image } : PLACEHOLDER_SITE);

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color={COLORS.dark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Site Details</Text>
                <View style={styles.headerRight}>
                    {user?.isAdmin && (
                        <>
                            <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate('AdminSiteForm', { site })}>
                                <Ionicons name="create-outline" size={22} color={COLORS.orange} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerBtn} onPress={handleDeleteSite}>
                                <Ionicons name="trash-outline" size={22} color="#E74C3C" />
                            </TouchableOpacity>
                        </>
                    )}
                    <TouchableOpacity style={styles.headerBtn} onPress={handleShare}>
                        <Ionicons name="share-social-outline" size={22} color={COLORS.dark} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerBtn} onPress={handleToggleFavorite}>
                        <Ionicons
                            name={favorited ? 'bookmark' : 'bookmark-outline'}
                            size={22}
                            color={favorited ? COLORS.orange : COLORS.dark}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Hero Image */}
                <View style={styles.heroWrap}>
                    <Image source={heroImage} style={styles.heroImg} resizeMode="cover" />
                    <View style={styles.heroGradient} />
                </View>

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <Text style={styles.unescoLabel}>HISTORICAL HERITAGE — {site.category?.toUpperCase() || 'CULTURAL SITE'}</Text>
                    <Text style={styles.siteName}>{site.name}</Text>
                    <View style={styles.locationRow}>
                        <Ionicons name="location-outline" size={14} color={COLORS.medium} />
                        <Text style={styles.locationText}>{site.location}</Text>
                        <Text style={styles.dot}> • </Text>
                        <Text style={styles.yearText}>{site.year || site.detail}</Text>
                    </View>

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>BUILT BY</Text>
                            <Text style={styles.statValue}>{site.builtBy || 'Ancient Civilizations'}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>REGION</Text>
                            <Text style={styles.statValue}>{site.detail}</Text>
                        </View>
                    </View>
                </View>

                {/* Description Sections */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Overview</Text>
                    <Text style={styles.bodyText}>{site.overview || site.description}</Text>
                    
                    {site.history && (
                        <>
                            <Text style={styles.sectionTitle}>History</Text>
                            <Text style={styles.bodyText}>{site.history}</Text>
                        </>
                    )}

                    {site.significance && (
                        <>
                            <Text style={styles.sectionTitle}>Significance</Text>
                            <Text style={styles.bodyText}>{site.significance}</Text>
                        </>
                    )}

                    {!site.history && !site.significance && (
                        <>
                            <Text style={styles.sectionTitle}>Details</Text>
                            <Text style={styles.bodyText}>
                                {site.fullDescription || "This site stands as a monumental achievement of Tamil architecture and craftsmanship."}
                            </Text>
                        </>
                    )}

                    {/* Action Buttons */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={styles.btnAction}
                            onPress={() => Alert.alert('Nearby Attractions', 'Exploring nearby spots…')}
                        >
                            <MaterialCommunityIcons name="compass-outline" size={20} color="#fff" />
                            <Text style={styles.btnActionText}>Nearby Attractions</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btnAction, { backgroundColor: COLORS.inputBg }]}
                            onPress={handleGetDirections}
                        >
                            <MaterialCommunityIcons name="map-marker-outline" size={20} color={COLORS.dark} />
                            <Text style={[styles.btnActionText, { color: COLORS.dark }]}>Get Directions</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Nearby Attractions - Horizontal Scroll */}
                <View style={styles.gallerySection}>
                    <Text style={styles.sectionTitle}>Nearby Attractions</Text>
                    {site.nearbyPlaces && site.nearbyPlaces.length > 0 ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryRow}>
                            {site.nearbyPlaces.map((place, idx) => (
                                <View key={idx} style={styles.nearbyCard}>
                                    <View style={styles.nearbyIconWrap}>
                                        <MaterialCommunityIcons name="map-marker-radius" size={24} color={COLORS.orange} />
                                    </View>
                                    <Text style={styles.nearbyName}>{place.name}</Text>
                                    <Text style={styles.nearbyCat}>{place.category}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    ) : (
                        <Text style={styles.fallbackText}>No nearby attractions available</Text>
                    )}
                </View>

                {/* Photo Gallery - Dummy */}
                <View style={styles.gallerySection}>
                    <Text style={styles.sectionTitle}>Photo Gallery</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryRow}>
                        {['brihadeeswarar', 'meenakshi', 'shore'].map((key, idx) => (
                            <Image key={idx} source={IMAGE_MAP[key]} style={styles.galleryImg} />
                        ))}
                    </ScrollView>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: COLORS.pageBg },
    loaderWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.pageBg },
    loaderText: { marginTop: 12, color: COLORS.medium, fontSize: 14 },
    scrollContent: { paddingBottom: 40 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10, backgroundColor: '#fff', ...SHADOWS.sm },
    headerBtn: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.inputBg },
    headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.dark },
    headerRight: { flexDirection: 'row', gap: 8 },
    heroWrap: { width: '100%', height: 260, position: 'relative' },
    heroImg: { width: '100%', height: '100%' },
    heroGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, backgroundColor: 'rgba(0,0,0,0.35)' },
    infoCard: { backgroundColor: COLORS.white, marginHorizontal: 16, marginTop: -24, borderRadius: 20, padding: 20, ...SHADOWS.md, zIndex: 10 },
    unescoLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: COLORS.orange, marginBottom: 6 },
    siteName: { fontSize: 24, fontWeight: '800', color: COLORS.dark, lineHeight: 30, marginBottom: 8 },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
    locationText: { fontSize: 13, color: COLORS.medium, marginLeft: 4 },
    dot: { fontSize: 13, color: COLORS.light },
    yearText: { fontSize: 13, color: COLORS.medium },
    statsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.inputBg, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 10 },
    statItem: { flex: 1, alignItems: 'center' },
    statLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1, color: COLORS.light, marginBottom: 4 },
    statValue: { fontSize: 14, fontWeight: '700', color: COLORS.orange },
    statDivider: { width: 1, height: 32, backgroundColor: COLORS.border },
    section: { marginHorizontal: 20, marginTop: 24 },
    sectionTitle: { fontSize: 19, fontWeight: '800', color: COLORS.dark, marginBottom: 12, marginTop: 16 },
    bodyText: { fontSize: 14.5, color: COLORS.medium, lineHeight: 24, marginBottom: 16 },
    actionRow: { gap: 12, marginTop: 10 },
    btnAction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: COLORS.orange, borderRadius: 12, paddingVertical: 15 },
    btnActionText: { fontSize: 14, fontWeight: '700', color: '#fff' },
    gallerySection: { marginTop: 24, paddingLeft: 20 },
    galleryRow: { paddingRight: 20, gap: 12 },
    galleryImg: { width: 180, height: 130, borderRadius: 16 },
    nearbyCard: { width: 150, backgroundColor: '#fff', borderRadius: 16, padding: 12, ...SHADOWS.sm, alignItems: 'center' },
    nearbyIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.inputBg, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    nearbyName: { fontSize: 14, fontWeight: '700', color: COLORS.dark, textAlign: 'center', marginBottom: 2 },
    nearbyCat: { fontSize: 11, color: COLORS.medium },
    fallbackText: { fontSize: 14, color: COLORS.light, fontStyle: 'italic', marginTop: 8 },
});
