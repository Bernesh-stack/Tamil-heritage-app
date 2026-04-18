import React, { useState, useEffect } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity,
    StyleSheet, StatusBar, Alert, TextInput, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

import api from '../api';

export default function AdminDashboardScreen({ navigation }) {
    const [adminName, setAdminName] = useState('Heritage Admin');
    const [feedbacks, setFeedbacks] = useState([]);
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, totalSites: 0, totalFeedback: 0, status: 'Active' });
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        builtBy: '',
        detail: '',
        overview: '',
        history: '',
        significance: '',
        googleMapsUrl: '',
        latitude: '',
        longitude: ''
    });

    const handleAddSite = async () => {
        if (!formData.name || !formData.location || !formData.overview) {
            return Alert.alert('Error', 'Name, Address and Overview are required.');
        }

        setFormLoading(true);
        try {
            await api.post('/api/heritage-sites', formData);
            Alert.alert('Success', 'Heritage site added successfully!');
            setShowAddForm(false);
            setFormData({
                name: '', location: '', builtBy: '', detail: '',
                overview: '', history: '', significance: '', googleMapsUrl: '',
                latitude: '', longitude: ''
            });
            fetchData(); // Refresh stats
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to add site');
        } finally {
            setFormLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const [fbRes, statsRes, logsRes] = await Promise.all([
                api.get('/api/feedback'),
                api.get('/api/admin/stats'),
                api.get('/api/admin/logs')
            ]);
            setFeedbacks(fbRes.data);
            setStats(statsRes.data);
            setLogs(logsRes.data);
        } catch (error) {
            console.error('Error fetching admin dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        AsyncStorage.getItem('currentUser').then(raw => {
            if (raw) { const u = JSON.parse(raw); setAdminName(u.name || 'Heritage Admin'); }
        });
        fetchData();
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
                        <TouchableOpacity 
                            style={[styles.mgmtBtnPrimary, showAddForm && { backgroundColor: COLORS.dark }]} 
                            onPress={() => setShowAddForm(!showAddForm)}
                        >
                            <Ionicons name={showAddForm ? "close-circle-outline" : "add-circle-outline"} size={26} color="#fff" />
                            <Text style={styles.mgmtBtnPrimaryText}>{showAddForm ? 'Cancel' : 'Add Site'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.mgmtBtnSecondary} onPress={() => navigation.navigate('Explore')}>
                            <Ionicons name="location-outline" size={26} color={COLORS.dark} />
                            <Text style={styles.mgmtBtnSecondaryText}>Update Site</Text>
                        </TouchableOpacity>
                    </View>

                    {showAddForm && (
                        <View style={styles.addFormContainer}>
                            <Text style={styles.formTitle}>Add New Heritage Site</Text>
                            
                            <Text style={styles.label}>Name of the Place *</Text>
                            <TextInput 
                                style={styles.input} 
                                value={formData.name}
                                onChangeText={t => setFormData({...formData, name: t})}
                                placeholder="e.g. Meenakshi Temple"
                            />

                            <Text style={styles.label}>Place Address *</Text>
                            <TextInput 
                                style={styles.input} 
                                value={formData.location}
                                onChangeText={t => setFormData({...formData, location: t})}
                                placeholder="Full address details"
                            />

                            <View style={styles.row}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Built By</Text>
                                    <TextInput 
                                        style={styles.input} 
                                        value={formData.builtBy}
                                        onChangeText={t => setFormData({...formData, builtBy: t})}
                                        placeholder="Dynasty/King"
                                    />
                                </View>
                                <View style={{ width: 12 }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Region Name</Text>
                                    <TextInput 
                                        style={styles.input} 
                                        value={formData.detail}
                                        onChangeText={t => setFormData({...formData, detail: t})}
                                        placeholder="City/District"
                                    />
                                </View>
                            </View>

                            <Text style={styles.label}>Overview *</Text>
                            <TextInput 
                                style={[styles.input, styles.textArea]} 
                                value={formData.overview}
                                onChangeText={t => setFormData({...formData, overview: t})}
                                multiline numberOfLines={3}
                                placeholder="Short overview of the site"
                            />

                            <Text style={styles.label}>History</Text>
                            <TextInput 
                                style={[styles.input, styles.textArea]} 
                                value={formData.history}
                                onChangeText={t => setFormData({...formData, history: t})}
                                multiline numberOfLines={3}
                                placeholder="Historical background"
                            />

                            <Text style={styles.label}>Significance</Text>
                            <TextInput 
                                style={[styles.input, styles.textArea]} 
                                value={formData.significance}
                                onChangeText={t => setFormData({...formData, significance: t})}
                                multiline numberOfLines={3}
                                placeholder="Architectural/Cultural significance"
                            />

                            <Text style={styles.label}>Google Map Address / Link</Text>
                            <TextInput 
                                style={styles.input} 
                                value={formData.googleMapsUrl}
                                onChangeText={t => setFormData({...formData, googleMapsUrl: t})}
                                placeholder="Paste Google Maps link here"
                            />

                            <View style={styles.row}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Latitude (Optional)</Text>
                                    <TextInput 
                                        style={styles.input} 
                                        value={formData.latitude}
                                        onChangeText={t => setFormData({...formData, latitude: t})}
                                        placeholder="Optional coords"
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View style={{ width: 12 }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Longitude (Optional)</Text>
                                    <TextInput 
                                        style={styles.input} 
                                        value={formData.longitude}
                                        onChangeText={t => setFormData({...formData, longitude: t})}
                                        placeholder="Optional coords"
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            <TouchableOpacity 
                                style={[styles.submitBtn, formLoading && { opacity: 0.7 }]} 
                                onPress={handleAddSite}
                                disabled={formLoading}
                            >
                                {formLoading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.submitBtnText}>Submit Site Details</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Feedback & Community */}
                <View style={styles.section}>
                {/* Analytics Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Analytics & Reporting</Text>
                </View>

                <View style={styles.analyticsCard}>
                    <View style={styles.analyticsDecor} />
                    <View style={styles.analyticsTop}>
                        <Text style={styles.analyticsLabel}>TOTAL ENGAGEMENT</Text>
                        <View style={styles.analyticsNumRow}>
                            <Text style={styles.analyticsNum}>{stats.totalUsers + (stats.totalHeritageSites || 0) * 10 + feedbacks.length * 5}</Text>
                            <Text style={styles.analyticsGrowth}>+12%</Text>
                        </View>
                    </View>

                    <View style={styles.analyticsGrid}>
                        <View style={styles.statsBox}>
                            <Text style={styles.statsLabel}>Total Users</Text>
                            <Text style={styles.statsVal}>{stats.totalUsers || 0}</Text>
                        </View>
                        <View style={styles.statsBox}>
                            <Text style={styles.statsLabel}>Heritage Sites</Text>
                            <Text style={styles.statsVal}>{stats.totalHeritageSites || 0}</Text>
                        </View>
                        <View style={styles.statsBox}>
                            <Text style={styles.statsLabel}>Avg Rating</Text>
                            <Text style={styles.statsVal}>{(feedbacks.reduce((acc, f) => acc + (f.rating || 0), 0) / (feedbacks.length || 1)).toFixed(1)}</Text>
                        </View>
                        <View style={styles.statsBox}>
                            <Text style={styles.statsLabel}>Total Feedback</Text>
                            <Text style={styles.statsVal}>{feedbacks.length}</Text>
                        </View>
                    </View>

                    <TouchableOpacity 
                        style={styles.analyticsBtn}
                        onPress={() => Alert.alert('Analytics Report', 'This would typically trigger a PDF/CSV download in a production app.')}
                    >
                        <Ionicons name="bar-chart" size={20} color="#fff" />
                        <Text style={styles.analyticsBtnText}>View Full Report</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.downloadBtn}
                        onPress={() => Alert.alert('Export', 'Downloading latest data...')}
                    >
                        <Ionicons name="download" size={16} color={COLORS.light} />
                        <Text style={styles.downloadBtnText}>Export JSON Data</Text>
                    </TouchableOpacity>
                </View>

                {/* Feedback Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Feedback & Community</Text>
                </View>

                {feedbacks.length > 0 ? (
                    feedbacks.map((item) => (
                        <View key={item._id} style={styles.feedbackCard}>
                            <View style={styles.fbHeader}>
                                <View style={styles.fbAvatar}>
                                    <Text style={styles.fbAvatarText}>
                                        {(item.userId?.name || 'U').charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                                <View style={styles.fbMeta}>
                                    <Text style={styles.fbName}>{item.userId?.name || 'Anonymous User'}</Text>
                                    <View style={styles.starsSmall}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Ionicons 
                                                key={star} 
                                                name="star" 
                                                size={12} 
                                                color={star <= (item.rating || 0) ? COLORS.orange : COLORS.border} 
                                            />
                                        ))}
                                    </View>
                                </View>
                                <Text style={styles.fbSite}>{item.siteId?.name || 'General'}</Text>
                            </View>

                            {item.message ? (
                                <Text style={styles.fbMsg} numberOfLines={3}>
                                    "{item.message}"
                                </Text>
                            ) : null}

                            <View style={styles.fbActions}>
                                <TouchableOpacity style={styles.fbReply}>
                                    <Text style={styles.fbReplyText}>Reply</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.fbArchive}>
                                    <Text style={styles.fbArchiveText}>Archive</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.feedbackCard}>
                        <Text style={{ textAlign: 'center', color: COLORS.light, fontWeight: '700' }}>No feedback received yet.</Text>
                    </View>
                )}
                </View>

                {/* Activity Logs */}
                <View style={[styles.section, { marginTop: 10 }]}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="history" size={20} color={COLORS.dark} />
                        <Text style={styles.sectionTitle}>Admin Activity Logs</Text>
                        <View style={styles.newBadge}>
                            <Text style={styles.newBadgeText}>LIVE</Text>
                        </View>
                    </View>

                    {logs.length > 0 ? (
                        <View style={styles.logsContainer}>
                            {logs.map((log) => (
                                <View key={log._id} style={styles.logItem}>
                                    <View style={[
                                        styles.logIcon, 
                                        { backgroundColor: log.action.includes('DELETE') ? '#FEE2E2' : log.action.includes('CREATE') ? '#DCFCE7' : '#FEF3C7' }
                                    ]}>
                                        <MaterialCommunityIcons 
                                            name={
                                                log.action.includes('DELETE') ? 'delete-outline' : 
                                                log.action.includes('CREATE') ? 'plus-circle-outline' : 
                                                'pencil-outline'
                                            } 
                                            size={18} 
                                            color={
                                                log.action.includes('DELETE') ? '#EF4444' : 
                                                log.action.includes('CREATE') ? '#22C55E' : 
                                                '#F59E0B'
                                            } 
                                        />
                                    </View>
                                    <View style={styles.logInfo}>
                                        <Text style={styles.logText} numberOfLines={2}>{log.details}</Text>
                                        <View style={styles.logMeta}>
                                            <Text style={styles.logAdmin}>{log.adminId?.name || 'Admin'}</Text>
                                            <Text style={styles.logDot}>•</Text>
                                            <Text style={styles.logTime}>{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.feedbackCard}>
                            <Text style={{ textAlign: 'center', color: COLORS.light, fontWeight: '700' }}>No activity logged yet.</Text>
                        </View>
                    )}
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
    // Feedback & Community Redesign
    feedbackCard: { 
        backgroundColor: COLORS.white, 
        borderRadius: 24, 
        padding: 20, 
        marginBottom: 16,
        ...SHADOWS.md, 
        borderWidth: 1, 
        borderColor: 'rgba(212, 130, 26, 0.1)' 
    },
    fbHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    fbAvatar: { 
        width: 48, 
        height: 48, 
        borderRadius: 24, 
        backgroundColor: COLORS.orangeBg, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginRight: 12,
        borderWidth: 2,
        borderColor: COLORS.orangeLight
    },
    fbAvatarText: { fontSize: 18, fontWeight: '800', color: COLORS.orange },
    fbMeta: { flex: 1 },
    fbName: { fontSize: 15, fontWeight: '800', color: COLORS.dark },
    fbSite: { fontSize: 11, color: COLORS.medium, marginTop: 2, fontWeight: '600' },
    starsSmall: { flexDirection: 'row', gap: 2, marginTop: 4 },
    fbMsg: { 
        fontSize: 14, 
        color: COLORS.medium, 
        lineHeight: 22, 
        marginBottom: 16, 
        fontStyle: 'italic',
        backgroundColor: COLORS.inputBg,
        padding: 12,
        borderRadius: 16
    },
    fbActions: { flexDirection: 'row', gap: 12 },
    fbReply: { 
        flex: 1, 
        backgroundColor: COLORS.dark,
        paddingVertical: 12, 
        borderRadius: 14, 
        alignItems: 'center' 
    },
    fbReplyText: { fontSize: 13, fontWeight: '700', color: '#fff' },
    fbArchive: { 
        flex: 1, 
        paddingVertical: 12, 
        borderRadius: 14, 
        borderWidth: 1.5, 
        borderColor: COLORS.border, 
        alignItems: 'center' 
    },
    fbArchiveText: { fontSize: 13, fontWeight: '700', color: COLORS.medium },

    // Analytics & Reporting Redesign
    analyticsCard: { 
        backgroundColor: COLORS.dark, 
        borderRadius: 28, 
        padding: 24, 
        overflow: 'hidden',
        ...SHADOWS.lg 
    },
    analyticsDecor: {
        position: 'absolute',
        top: -20,
        right: -20,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.orange,
        opacity: 0.1
    },
    analyticsTop: { marginBottom: 24 },
    analyticsLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 2, color: COLORS.light, marginBottom: 8 },
    analyticsNumRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
    analyticsNum: { fontSize: 40, fontWeight: '900', color: '#fff' },
    analyticsGrowth: { fontSize: 14, fontWeight: '700', color: COLORS.green, marginBottom: 6 },
    analyticsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
    statsBox: { 
        flex: 1, 
        minWidth: '45%', 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        borderRadius: 20, 
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
    },
    statsLabel: { fontSize: 11, color: COLORS.light, marginBottom: 6, fontWeight: '600' },
    statsVal: { fontSize: 22, fontWeight: '800', color: '#fff' },
    analyticsBtn: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 10, 
        backgroundColor: COLORS.orange, 
        borderRadius: 18, 
        paddingVertical: 16,
        ...SHADOWS.md
    },
    analyticsBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
    downloadBtn: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 10, 
        marginTop: 12,
        paddingVertical: 12
    },
    downloadBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.light },

    // Existing Form Styles
    addFormContainer: { backgroundColor: COLORS.white, borderRadius: 24, padding: 24, marginTop: 10, ...SHADOWS.md, borderWidth: 1, borderColor: COLORS.border },
    formTitle: { fontSize: 18, fontWeight: '800', color: COLORS.dark, marginBottom: 18 },
    label: { fontSize: 13, fontWeight: '700', color: COLORS.medium, marginBottom: 8, marginTop: 12 },
    input: { backgroundColor: COLORS.inputBg, borderRadius: 14, padding: 14, fontSize: 14, color: COLORS.dark },
    textArea: { height: 90, textAlignVertical: 'top' },
    row: { flexDirection: 'row' },
    submitBtn: { backgroundColor: COLORS.orange, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 24, ...SHADOWS.lg },
    submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

    // Logs Styles
    logsContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...SHADOWS.sm
    },
    logItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        gap: 12
    },
    logIcon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logInfo: {
        flex: 1
    },
    logText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.dark,
        marginBottom: 2
    },
    logMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    logAdmin: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.orange
    },
    logDot: {
        fontSize: 10,
        color: COLORS.medium
    },
    logTime: {
        fontSize: 11,
        color: COLORS.medium,
        fontWeight: '500'
    }
});
