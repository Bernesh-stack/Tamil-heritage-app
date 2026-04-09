import React, { useState, useEffect } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity,
    StyleSheet, StatusBar, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

const FEEDBACK_DATA = [
    { id: '1', name: 'Anbu Selvan', site: 'Brihadisvara Temple', time: '2h ago', msg: 'The AR visualization for the Vimana is incredible. Could we add more historical context for the murals in the inner sanctum?' },
    { id: '2', name: 'Meena Krishnan', site: 'Mahabalipuram', time: '5h ago', msg: 'Found a small typo in the description of the Shore Temple. It says 7th century, but the signage here says 8th.' },
    { id: '3', name: 'Rahul Dev', site: 'Meenakshi Temple', time: '8h ago', msg: 'The audio guide feature is very helpful. Would love to see more regional language options added.' },
];

export default function AdminDashboardScreen({ navigation }) {
    const [adminName, setAdminName] = useState('Heritage Admin');

    useEffect(() => {
        AsyncStorage.getItem('currentUser').then(raw => {
            if (raw) { const u = JSON.parse(raw); setAdminName(u.name || 'Heritage Admin'); }
        });
    }, []);

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.pageBg} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.adminAvatar}>
                        <MaterialCommunityIcons name="shield-account" size={20} color="#fff" />
                    </View>
                    <View>
                        <Text style={styles.adminName}>{adminName}</Text>
                        <Text style={styles.adminSub}>TAMIL PRESERVATION</Text>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Ionicons name="notifications-outline" size={22} color={COLORS.dark} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Ionicons name="search-outline" size={22} color={COLORS.dark} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Site Management */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="bank-outline" size={20} color={COLORS.dark} />
                        <Text style={styles.sectionTitle}>Site Management</Text>
                    </View>
                    <View style={styles.mgmtRow}>
                        <TouchableOpacity style={styles.mgmtBtnPrimary} onPress={() => Alert.alert('Add Site', 'Coming soon!')}>
                            <Ionicons name="add-circle-outline" size={26} color="#fff" />
                            <Text style={styles.mgmtBtnPrimaryText}>Add Site</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.mgmtBtnSecondary} onPress={() => Alert.alert('Update', 'Coming soon!')}>
                            <Ionicons name="location-outline" size={26} color={COLORS.dark} />
                            <Text style={styles.mgmtBtnSecondaryText}>Update</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.mgmtBtnSecondary} onPress={() => Alert.alert('Delete', 'Coming soon!')}>
                            <Ionicons name="close-circle-outline" size={26} color="#E74C3C" />
                            <Text style={[styles.mgmtBtnSecondaryText, { color: '#E74C3C' }]}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Feedback & Community */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="comment-multiple-outline" size={20} color={COLORS.dark} />
                        <Text style={styles.sectionTitle}>Feedback & Community</Text>
                        <View style={styles.newBadge}><Text style={styles.newBadgeText}>12 New</Text></View>
                    </View>
                    {FEEDBACK_DATA.map(fb => (
                        <View key={fb.id} style={styles.feedbackCard}>
                            <View style={styles.fbHeader}>
                                <View style={styles.fbAvatar}>
                                    <Text style={styles.fbAvatarText}>{fb.name[0]}</Text>
                                </View>
                                <View style={styles.fbMeta}>
                                    <Text style={styles.fbName}>{fb.name}</Text>
                                    <Text style={styles.fbSite}>{fb.site} • {fb.time}</Text>
                                </View>
                                <TouchableOpacity>
                                    <Ionicons name="ellipsis-vertical" size={18} color={COLORS.light} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.fbMsg}>{fb.msg}</Text>
                            <View style={styles.fbActions}>
                                <TouchableOpacity style={styles.fbReply}>
                                    <Text style={styles.fbReplyText}>Reply</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.fbArchive}>
                                    <Text style={styles.fbArchiveText}>Archive</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Analytics */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="chart-bar" size={20} color={COLORS.dark} />
                        <Text style={styles.sectionTitle}>Analytics & Reporting</Text>
                    </View>
                    <View style={styles.analyticsCard}>
                        <View style={styles.analyticsTop}>
                            <View>
                                <Text style={styles.analyticsLabel}>MONTHLY ENGAGEMENT</Text>
                                <View style={styles.analyticsNumRow}>
                                    <Text style={styles.analyticsNum}>24.8k</Text>
                                    <Text style={styles.analyticsGrowth}> ↑12%</Text>
                                </View>
                            </View>
                            <View style={styles.barChart}>
                                {[40, 65, 50, 80, 70, 90].map((h, i) => (
                                    <View key={i} style={[styles.bar, { height: h * 0.5, opacity: i === 5 ? 1 : 0.5 }]} />
                                ))}
                            </View>
                        </View>
                        <View style={styles.analyticsStats}>
                            <View style={styles.analyticsStat}>
                                <Text style={styles.analyticsStatLabel}>Active Sites</Text>
                                <Text style={styles.analyticsStatVal}>142</Text>
                            </View>
                            <View style={styles.analyticsStat}>
                                <Text style={styles.analyticsStatLabel}>Preservation Score</Text>
                                <Text style={styles.analyticsStatVal}>94/100</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.analyticsBtn} onPress={() => Alert.alert('Analytics Report', 'Coming soon!')}>
                            <MaterialCommunityIcons name="chart-line" size={18} color="#fff" />
                            <Text style={styles.analyticsBtnText}>Analytics Report</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.downloadBtn} onPress={() => Alert.alert('Download Report', 'Coming soon!')}>
                            <MaterialCommunityIcons name="download" size={18} color={COLORS.white} />
                            <Text style={styles.downloadBtnText}>Download Report</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: COLORS.pageBg },
    scrollContent: { padding: 16, paddingBottom: 40, gap: 20 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 12, backgroundColor: COLORS.pageBg },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    adminAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.orange, alignItems: 'center', justifyContent: 'center' },
    adminName: { fontSize: 16, fontWeight: '800', color: COLORS.dark },
    adminSub: { fontSize: 9, fontWeight: '700', letterSpacing: 1.5, color: COLORS.orange },
    headerRight: { flexDirection: 'row', gap: 8 },
    iconBtn: { width: 38, height: 38, borderRadius: 10, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center' },
    section: { gap: 12 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.dark, flex: 1 },
    newBadge: { backgroundColor: COLORS.orangeBg, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: COLORS.orange },
    newBadgeText: { fontSize: 11, fontWeight: '700', color: COLORS.orange },
    mgmtRow: { flexDirection: 'row', gap: 12 },
    mgmtBtnPrimary: { flex: 1, backgroundColor: COLORS.orange, borderRadius: 16, paddingVertical: 18, alignItems: 'center', gap: 8, ...SHADOWS.md },
    mgmtBtnPrimaryText: { fontSize: 13, fontWeight: '700', color: '#fff' },
    mgmtBtnSecondary: { flex: 1, backgroundColor: COLORS.white, borderRadius: 16, paddingVertical: 18, alignItems: 'center', gap: 8, borderWidth: 1.5, borderColor: COLORS.border, ...SHADOWS.sm },
    mgmtBtnSecondaryText: { fontSize: 13, fontWeight: '700', color: COLORS.dark },
    feedbackCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, ...SHADOWS.sm, borderWidth: 1, borderColor: COLORS.border },
    fbHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    fbAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.inputBg, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    fbAvatarText: { fontSize: 16, fontWeight: '700', color: COLORS.medium },
    fbMeta: { flex: 1 },
    fbName: { fontSize: 14, fontWeight: '700', color: COLORS.dark },
    fbSite: { fontSize: 11, color: COLORS.light, marginTop: 1 },
    fbMsg: { fontSize: 13, color: COLORS.medium, lineHeight: 20, marginBottom: 12 },
    fbActions: { flexDirection: 'row', gap: 10 },
    fbReply: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center' },
    fbReplyText: { fontSize: 13, fontWeight: '700', color: COLORS.orange },
    fbArchive: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center' },
    fbArchiveText: { fontSize: 13, fontWeight: '600', color: COLORS.medium },
    analyticsCard: { backgroundColor: '#1A1A2E', borderRadius: 20, padding: 20, gap: 14 },
    analyticsTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    analyticsLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1.5, color: '#9999BB', marginBottom: 4 },
    analyticsNumRow: { flexDirection: 'row', alignItems: 'baseline' },
    analyticsNum: { fontSize: 32, fontWeight: '800', color: '#fff' },
    analyticsGrowth: { fontSize: 13, fontWeight: '700', color: COLORS.green },
    barChart: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 45 },
    bar: { width: 8, backgroundColor: COLORS.orange, borderRadius: 4 },
    analyticsStats: { flexDirection: 'row', gap: 12 },
    analyticsStat: { flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 14 },
    analyticsStatLabel: { fontSize: 10, color: '#9999BB', marginBottom: 4 },
    analyticsStatVal: { fontSize: 18, fontWeight: '800', color: '#fff' },
    analyticsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.orange, borderRadius: 14, paddingVertical: 14 },
    analyticsBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
    downloadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 14, paddingVertical: 14 },
    downloadBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
