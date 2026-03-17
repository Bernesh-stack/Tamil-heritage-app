import React, { useState, useEffect } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity,
    StyleSheet, StatusBar, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

export default function ProfileScreen({ navigation }) {
    const [user, setUser] = useState({ name: 'User', email: '', isAdmin: false });

    useEffect(() => {
        AsyncStorage.getItem('currentUser').then(raw => {
            if (raw) setUser(JSON.parse(raw));
        });
    }, []);

    const handleSignOut = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out', style: 'destructive', onPress: async () => {
                    await AsyncStorage.multiRemove(['authToken', 'currentUser']);
                    navigation.replace('Login');
                },
            },
        ]);
    };

    const initials = user.name
        ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.pageBg} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerBrand}>
                    <View style={styles.logoCircle}>
                        <MaterialCommunityIcons name="temple-hindu" size={18} color="#fff" />
                    </View>
                    <Text style={styles.headerTitle}>Tamil Heritage</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Text style={styles.langText}>தமிழ்</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Ionicons name="notifications-outline" size={22} color={COLORS.dark} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Profile Card */}
                <View style={styles.card}>
                    {/* Avatar */}
                    <View style={styles.avatarWrap}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{initials}</Text>
                        </View>
                        <TouchableOpacity style={styles.cameraBtn}>
                            <Ionicons name="camera" size={14} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>

                    <View style={styles.roleBadge}>
                        <Text style={styles.roleText}>{user.isAdmin ? 'ADMIN' : 'USER ROLE'}</Text>
                    </View>

                    <TouchableOpacity style={styles.editBtn} activeOpacity={0.85}>
                        <Feather name="edit-2" size={14} color={COLORS.dark} />
                        <Text style={styles.editBtnText}>Edit</Text>
                    </TouchableOpacity>
                </View>

                {/* Activity Overview */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Activity Overview</Text>

                    {/* Top two cards */}
                    <View style={styles.activityRow}>
                        <View style={styles.activityItem}>
                            <Ionicons name="bookmark-outline" size={24} color={COLORS.orange} />
                            <Text style={styles.activityNum}>24</Text>
                            <Text style={styles.activityLabel}>Saved Sites</Text>
                        </View>
                        <View style={styles.activityItem}>
                            <MaterialCommunityIcons name="history" size={24} color={COLORS.orange} />
                            <Text style={styles.activityNum}>128</Text>
                            <Text style={styles.activityLabel}>Recently Viewed</Text>
                        </View>
                    </View>

                    {/* Feedback row */}
                    <TouchableOpacity style={styles.feedbackRow} activeOpacity={0.85}>
                        <View style={styles.feedbackLeft}>
                            <MaterialCommunityIcons name="message-text-outline" size={24} color={COLORS.orange} />
                            <View style={{ marginLeft: 14 }}>
                                <Text style={styles.activityNum}>15</Text>
                                <Text style={styles.activityLabel}>Feedback Submitted</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={COLORS.light} />
                    </TouchableOpacity>
                </View>

                {/* Sign Out */}
                <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} activeOpacity={0.88}>
                    <MaterialCommunityIcons name="logout" size={20} color="#E74C3C" />
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: COLORS.pageBg },
    scrollContent: { padding: 16, paddingBottom: 40, gap: 16 },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 12, backgroundColor: COLORS.pageBg },
    headerBrand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    logoCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.orange, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.dark },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    iconBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center' },
    langText: { fontSize: 11, fontWeight: '700', color: COLORS.dark },

    // Card
    card: { backgroundColor: COLORS.white, borderRadius: 20, padding: 20, ...SHADOWS.md, borderWidth: 1.5, borderColor: COLORS.border },
    cardTitle: { fontSize: 17, fontWeight: '800', color: COLORS.dark, marginBottom: 16 },

    // Profile
    avatarWrap: { alignSelf: 'center', marginBottom: 14, position: 'relative' },
    avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: COLORS.orange, alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: 32, fontWeight: '800', color: '#fff' },
    cameraBtn: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.orangeDark, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
    userName: { fontSize: 22, fontWeight: '800', color: COLORS.dark, textAlign: 'center' },
    userEmail: { fontSize: 13, color: COLORS.medium, textAlign: 'center', marginTop: 4 },
    roleBadge: { alignSelf: 'center', marginTop: 10, paddingHorizontal: 16, paddingVertical: 5, borderRadius: 20, borderWidth: 1.5, borderColor: COLORS.green, backgroundColor: '#EAFAF1' },
    roleText: { fontSize: 11, fontWeight: '700', color: COLORS.greenDark, letterSpacing: 0.8 },
    editBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, alignSelf: 'center', marginTop: 14, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 50, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white },
    editBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.dark },

    // Activity
    activityRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
    activityItem: { flex: 1, backgroundColor: COLORS.inputBg, borderRadius: 14, padding: 16, alignItems: 'flex-start', gap: 4 },
    activityNum: { fontSize: 26, fontWeight: '800', color: COLORS.dark },
    activityLabel: { fontSize: 12, color: COLORS.medium, fontWeight: '500' },
    feedbackRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.inputBg, borderRadius: 14, padding: 16 },
    feedbackLeft: { flexDirection: 'row', alignItems: 'center' },

    // Sign Out
    signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: COLORS.white, borderRadius: 16, paddingVertical: 18, borderWidth: 1.5, borderColor: '#FDECEA', ...SHADOWS.sm },
    signOutText: { fontSize: 16, fontWeight: '700', color: '#E74C3C' },
});
