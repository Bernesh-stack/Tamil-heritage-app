import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const ICON_MAP = {
    Map: { lib: 'Ionicons', name: 'map-outline' },
    Saved: { lib: 'Ionicons', name: 'bookmark-outline' },
    Profile: { lib: 'Feather', name: 'user' },
};

export default function PlaceholderScreen({ route }) {
    const screenName = route?.name || 'Coming Soon';
    const iconCfg = ICON_MAP[screenName];

    const renderIcon = () => {
        if (!iconCfg) return null;
        if (iconCfg.lib === 'Ionicons')
            return <Ionicons name={iconCfg.name} size={56} color={COLORS.light} />;
        return <Feather name={iconCfg.name} size={56} color={COLORS.light} />;
    };

    return (
        <View style={styles.screen}>
            {renderIcon()}
            <Text style={styles.title}>{screenName}</Text>
            <Text style={styles.sub}>This feature is coming soon.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.pageBg, gap: 12 },
    title: { fontSize: 22, fontWeight: '700', color: COLORS.medium },
    sub: { fontSize: 14, color: COLORS.light },
});
