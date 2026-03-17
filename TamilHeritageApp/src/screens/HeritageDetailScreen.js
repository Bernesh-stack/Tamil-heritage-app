import React, { useState } from 'react';
import {
    View, Text, Image, ScrollView, TouchableOpacity,
    StyleSheet, StatusBar, Alert, Share,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

const IMAGE_MAP = {
    brihadeeswarar: require('../../assets/images/brihadeeswarar.png'),
    meenakshi:      require('../../assets/images/meenakshi.png'),
    shore:          require('../../assets/images/shore.png'),
};

// Static detail data keyed by imageKey
const SITE_DETAILS = {
    brihadeeswarar: {
        label:     'UNESCO WORLD HERITAGE SITE',
        fullName:  'Brihadisvara Temple',
        location:  'Thanjavur, Tamil Nadu',
        year:      '1010 AD',
        dynasty:   'Chola',
        architect: 'KunjaraMallan',
        height:    '216 ft',
        history: [
            'The Brihadisvara Temple, also known as Rajarajeswaram, is a magnificent Hindu temple dedicated to Shiva located in Thanjavur, Tamil Nadu, India. It is one of the largest South Indian temples and an exemplary example of fully realized Tamil architecture.',
            'Built by Raja Raja Chola I between 1003 and 1010 AD, the temple is part of the UNESCO World Heritage Site known as the "Great Living Chola Temples". The temple\'s vimana tower above the sanctum is one of the tallest in South India.',
            'The entire temple structure is made out of granite, the nearest sources of which are about 60 km to the west of temple. It remains the first complete granite temple in the world.',
        ],
        quote: '"The temple is a testament to the Chola dynasty\'s architectural brilliance and their devotion to Saivism."',
        gallery: ['brihadeeswarar', 'meenakshi', 'shore'],
    },
    meenakshi: {
        label:     'DRAVIDIAN ARCHITECTURE',
        fullName:  'Meenakshi Amman Temple',
        location:  'Madurai, Tamil Nadu',
        year:      '1623 AD',
        dynasty:   'Nayak',
        architect: 'Vishwanatha',
        height:    '170 ft',
        history: [
            'The Meenakshi Amman Temple is a historic Hindu temple located on the southern bank of the Vaigai River in Madurai, Tamil Nadu, India. It is dedicated to Meenakshi, a form of Parvati, and her consort, Sundareswarar, a form of Shiva.',
            'The temple forms the heart and lifeline of the 2,500-year-old city of Madurai and is a significant symbol for the Tamil people. The temple complex houses 14 gateway towers known as gopurams.',
            'The tallest tower is the southern tower, standing at 170 ft. The temple attracts an estimated 15,000 to 20,000 visitors per day and around 30,000 during festivals.',
        ],
        quote: '"Meenakshi temple is a living testament to the grandeur of Dravidian architecture and Tamil devotion."',
        gallery: ['meenakshi', 'brihadeeswarar', 'shore'],
    },
    shore: {
        label:     'UNESCO WORLD HERITAGE SITE',
        fullName:  'Shore Temple',
        location:  'Mahabalipuram, Tamil Nadu',
        year:      '700 AD',
        dynasty:   'Pallava',
        architect: 'Narasimhavarman II',
        height:    '60 ft',
        history: [
            'The Shore Temple is a complex of temples and shrines that overlooks the shore of the Bay of Bengal. It is located in Mahabalipuram, a UNESCO World Heritage Site in Tamil Nadu, India.',
            'Built during the reign of Narasimhavarman II of the Pallava dynasty around 700 AD, it is one of the oldest structural stone temples of South India.',
            'The temple complex consists of two Shiva shrines and a Vishnu shrine. The site is exposed to the sea breeze and has suffered significant erosion over the centuries.',
        ],
        quote: '"The Shore Temple stands as a silent witness to the maritime glory and artistic mastery of the Pallava dynasty."',
        gallery: ['shore', 'brihadeeswarar', 'meenakshi'],
    },
};

export default function HeritageDetailScreen({ route, navigation }) {
    const { site } = route.params;
    const [favorited, setFavorited] = useState(false);
    const details = SITE_DETAILS[site.imageKey] || SITE_DETAILS.brihadeeswarar;
    const heroImage = IMAGE_MAP[site.imageKey];

    const handleShare = async () => {
        await Share.share({ message: `Explore ${details.fullName} — ${details.location}` });
    };

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
                    <TouchableOpacity style={styles.headerBtn} onPress={handleShare}>
                        <Ionicons name="share-social-outline" size={22} color={COLORS.dark} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerBtn} onPress={() => setFavorited(f => !f)}>
                        <Ionicons
                            name={favorited ? 'heart' : 'heart-outline'}
                            size={22}
                            color={favorited ? '#E74C3C' : COLORS.dark}
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
                    <Text style={styles.unescoLabel}>{details.label}</Text>
                    <Text style={styles.siteName}>{details.fullName}</Text>
                    <View style={styles.locationRow}>
                        <Ionicons name="location-outline" size={14} color={COLORS.medium} />
                        <Text style={styles.locationText}>{details.location}</Text>
                        <Text style={styles.dot}> • </Text>
                        <Text style={styles.yearText}>{details.year}</Text>
                    </View>

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>DYNASTY</Text>
                            <Text style={styles.statValue}>{details.dynasty}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>ARCHITECT</Text>
                            <Text style={styles.statValue}>{details.architect}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>HEIGHT</Text>
                            <Text style={styles.statValue}>{details.height}</Text>
                        </View>
                    </View>
                </View>

                {/* Historical Significance */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Historical Significance</Text>
                    <Text style={styles.bodyText}>{details.history[0]}</Text>
                    <Text style={styles.bodyText}>{details.history[1]}</Text>

                    {/* Quote Block */}
                    <View style={styles.quoteBlock}>
                        <Text style={styles.quoteText}>{details.quote}</Text>
                    </View>

                    <Text style={styles.bodyText}>{details.history[2]}</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionCard}>
                    <TouchableOpacity
                        style={styles.btnPrimary}
                        onPress={() => Alert.alert('Nearby Attractions', 'Coming soon!')}
                        activeOpacity={0.88}
                    >
                        <MaterialCommunityIcons name="compass-outline" size={20} color="#fff" />
                        <Text style={styles.btnPrimaryText}>View Nearby Attractions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.btnSecondary}
                        onPress={() => Alert.alert('Get Directions', 'Opening maps…')}
                        activeOpacity={0.88}
                    >
                        <MaterialCommunityIcons name="map-outline" size={20} color={COLORS.dark} />
                        <Text style={styles.btnSecondaryText}>Get Directions</Text>
                    </TouchableOpacity>
                </View>

                {/* Photo Gallery */}
                <View style={styles.gallerySection}>
                    <Text style={styles.sectionTitle}>Photo Gallery</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryRow}>
                        {details.gallery.map((key, idx) => (
                            <TouchableOpacity key={idx} activeOpacity={0.9}>
                                <Image source={IMAGE_MAP[key]} style={styles.galleryImg} resizeMode="cover" />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: COLORS.pageBg },
    scrollContent: { paddingBottom: 40 },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10, backgroundColor: '#fff', ...SHADOWS.sm },
    headerBtn: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.inputBg },
    headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.dark },
    headerRight: { flexDirection: 'row', gap: 8 },

    // Hero
    heroWrap: { width: '100%', height: 260, position: 'relative' },
    heroImg: { width: '100%', height: '100%' },
    heroGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, backgroundColor: 'rgba(0,0,0,0.35)' },

    // Info Card
    infoCard: { backgroundColor: COLORS.white, marginHorizontal: 16, marginTop: -20, borderRadius: 20, padding: 20, ...SHADOWS.md, zIndex: 10 },
    unescoLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: COLORS.orange, marginBottom: 6 },
    siteName: { fontSize: 26, fontWeight: '800', color: COLORS.dark, lineHeight: 32, marginBottom: 8 },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
    locationText: { fontSize: 13, color: COLORS.medium, marginLeft: 4 },
    dot: { fontSize: 13, color: COLORS.light },
    yearText: { fontSize: 13, color: COLORS.medium },
    statsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.inputBg, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 10 },
    statItem: { flex: 1, alignItems: 'center' },
    statLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1, color: COLORS.light, marginBottom: 4 },
    statValue: { fontSize: 14, fontWeight: '700', color: COLORS.orange },
    statDivider: { width: 1, height: 32, backgroundColor: COLORS.border },

    // Historical Section
    section: { marginHorizontal: 16, marginTop: 24 },
    sectionTitle: { fontSize: 20, fontWeight: '800', color: COLORS.dark, marginBottom: 14 },
    bodyText: { fontSize: 14, color: COLORS.medium, lineHeight: 22, marginBottom: 12 },
    quoteBlock: { borderLeftWidth: 4, borderLeftColor: COLORS.orange, backgroundColor: COLORS.orangeBg, borderRadius: 8, padding: 16, marginVertical: 12 },
    quoteText: { fontSize: 14, fontStyle: 'italic', color: COLORS.dark, lineHeight: 22 },

    // Action Buttons
    actionCard: { backgroundColor: COLORS.white, marginHorizontal: 16, marginTop: 24, borderRadius: 20, padding: 20, gap: 12, ...SHADOWS.md },
    btnPrimary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: COLORS.orange, borderRadius: 14, paddingVertical: 16, shadowColor: COLORS.orange, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 5 },
    btnPrimaryText: { fontSize: 15, fontWeight: '700', color: '#fff' },
    btnSecondary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: COLORS.inputBg, borderRadius: 14, paddingVertical: 16 },
    btnSecondaryText: { fontSize: 15, fontWeight: '700', color: COLORS.dark },

    // Gallery
    gallerySection: { marginTop: 28, paddingLeft: 16 },
    galleryRow: { paddingRight: 16, gap: 12, paddingTop: 4 },
    galleryImg: { width: 160, height: 120, borderRadius: 14 },
});
