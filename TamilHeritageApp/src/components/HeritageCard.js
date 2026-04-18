import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

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

export default function HeritageCard({ site, isBookmarked, onBookmarkPress, onPress }) {
    const cardImage = (site.imageKey && IMAGE_MAP[site.imageKey]) 
        ? IMAGE_MAP[site.imageKey] 
        : (site.image ? { uri: site.image } : IMAGE_MAP.brihadeeswarar);

    return (
        <View style={styles.card}>
            <View style={styles.cardImgWrap}>
                <Image 
                    source={cardImage} 
                    style={styles.cardImg} 
                    resizeMode="cover" 
                    onError={(e) => console.log('Image load error for:', site.name, e.nativeEvent.error)}
                />
                <View style={styles.locationBadge}>
                    <Ionicons name="location-sharp" size={10} color="#fff" />
                    <Text style={styles.locationText}>{site.location}</Text>
                </View>
                <TouchableOpacity style={styles.bookmarkBtn} onPress={onBookmarkPress}>
                    <Ionicons
                        name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                        size={16}
                        color={isBookmarked ? COLORS.orange : COLORS.dark}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.cardBody}>
                <View style={styles.cardInfo}>
                    <Text style={styles.cardName}>{site.name}</Text>
                    <Text style={styles.cardDesc} numberOfLines={2}>{site.description}</Text>
                </View>
                <TouchableOpacity
                    style={styles.btnView}
                    onPress={onPress}
                    activeOpacity={0.88}
                >
                    <Text style={styles.btnViewText}>View</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: COLORS.white, borderRadius: 16, overflow: 'hidden', ...SHADOWS.md, marginBottom: 20 },
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
