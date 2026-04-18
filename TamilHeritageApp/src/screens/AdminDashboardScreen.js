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
                overview: '', history: '', significance: '', googleMapsUrl: ''
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
            const [fbRes, statsRes] = await Promise.all([
                api.get('/api/feedback'),
                api.get('/api/admin/stats')
            ]);
            setFeedbacks(fbRes.data);
            setStats(statsRes.data);
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
                        <TouchableOpacity style={styles.mgmtBtnSecondary} onPress={() => navigation.navigate('Explore')}>
                            <Ionicons name="close-circle-outline" size={26} color="#E74C3C" />
                            <Text style={[styles.mgmtBtnSecondaryText, { color: '#E74C3C' }]}>Remove</Text>
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
                                    <Text style={styles.label}>Latitude</Text>
                                    <TextInput 
                                        style={styles.input} 
                                        value={formData.latitude}
                                        onChangeText={t => setFormData({...formData, latitude: t})}
                                        placeholder="e.g. 10.782"
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View style={{ width: 12 }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Longitude</Text>
                                    <TextInput 
                                        style={styles.input} 
                                        value={formData.longitude}
                                        onChangeText={t => setFormData({...formData, longitude: t})}
                                        placeholder="e.g. 79.131"
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
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="comment-multiple-outline" size={20} color={COLORS.dark} />
                        <Text style={styles.sectionTitle}>Feedback & Community</Text>
                        <View style={styles.newBadge}><Text style={styles.newBadgeText}>{feedbacks.length} New</Text></View>
                    </View>
                    {feedbacks.map(fb => (
                        <View key={fb._id} style={styles.feedbackCard}>
                            <View style={styles.fbHeader}>
                                <View style={styles.fbAvatar}>
                                    <Text style={styles.fbAvatarText}>{(fb.userId?.name || 'U')[0]}</Text>
                                </View>
                                <View style={styles.fbMeta}>
                                    <Text style={styles.fbName}>{fb.userId?.name || 'Anonymous'}</Text>
                                    <Text style={styles.fbSite}>{fb.siteId?.name || 'Site'} • {new Date(fb.createdAt).toLocaleDateString()}</Text>
                                </View>
                                <TouchableOpacity>
                                    <Ionicons name="ellipsis-vertical" size={18} color={COLORS.light} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.fbMsg}>{fb.message}</Text>
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
                                    <Text style={styles.analyticsNum}>{stats.totalUsers > 1000 ? (stats.totalUsers/1000).toFixed(1) + 'k' : stats.totalUsers}</Text>
                                    <Text style={styles.analyticsGrowth}> Total Users</Text>
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
                                <Text style={styles.analyticsStatVal}>{stats.totalHeritageSites || 0}</Text>
                            </View>
                            <View style={styles.analyticsStat}>
                                <Text style={styles.analyticsStatLabel}>Total Feedback</Text>
                                <Text style={styles.analyticsStatVal}>{stats.totalFeedback}</Text>
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

    // New Form Styles
    addFormContainer: { backgroundColor: COLORS.white, borderRadius: 20, padding: 20, marginTop: 10, ...SHADOWS.sm, borderWidth: 1, borderColor: COLORS.border },
    formTitle: { fontSize: 16, fontWeight: '800', color: COLORS.dark, marginBottom: 15 },
    label: { fontSize: 12, fontWeight: '700', color: COLORS.medium, marginBottom: 6, marginTop: 10 },
    input: { backgroundColor: COLORS.inputBg, borderRadius: 12, padding: 12, fontSize: 14, color: COLORS.dark },
    textArea: { height: 80, textAlignVertical: 'top' },
    row: { flexDirection: 'row' },
    submitBtn: { backgroundColor: COLORS.orange, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 24, ...SHADOWS.md },
    submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
