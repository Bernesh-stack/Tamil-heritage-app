import React, { useState, useEffect } from 'react';
import {
    View, Text, ScrollView, RefreshControl,
    StyleSheet, StatusBar, TouchableOpacity,
    ActivityIndicator, TextInput
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import api from '../api';
import { COLORS, SHADOWS } from '../constants/theme';

export default function AdminLogsScreen() {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('ALL'); // ALL, CREATE, UPDATE, DELETE

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/admin/logs');
            setLogs(res.data);
            applyFilters(res.data, search, filter);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = (allLogs, searchText, actionFilter) => {
        let filtered = allLogs;

        if (actionFilter !== 'ALL') {
            filtered = filtered.filter(log => log.action.includes(actionFilter));
        }

        if (searchText) {
            filtered = filtered.filter(log => 
                log.details.toLowerCase().includes(searchText.toLowerCase()) ||
                log.adminId?.name?.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        setFilteredLogs(filtered);
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    useEffect(() => {
        applyFilters(logs, search, filter);
    }, [search, filter]);

    const getLogIcon = (action) => {
        if (action.includes('DELETE')) return { name: 'delete-outline', color: '#EF4444', bg: '#FEE2E2' };
        if (action.includes('CREATE')) return { name: 'plus-circle-outline', color: '#22C55E', bg: '#DCFCE7' };
        return { name: 'pencil-outline', color: '#F59E0B', bg: '#FEF3C7' };
    };

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.pageBg} />
            
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>System Activity Logs</Text>
                <TouchableOpacity onPress={fetchLogs} style={styles.refreshBtn}>
                    <Ionicons name="refresh" size={20} color={COLORS.orange} />
                </TouchableOpacity>
            </View>

            {/* Search and Filter */}
            <View style={styles.controlRow}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={18} color={COLORS.medium} style={styles.searchIcon} />
                    <TextInput 
                        style={styles.searchInput}
                        placeholder="Search by detail or admin..."
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            <View style={styles.filterRow}>
                {['ALL', 'CREATE', 'UPDATE', 'DELETE'].map((f) => (
                    <TouchableOpacity 
                        key={f} 
                        style={[styles.filterChip, filter === f && styles.filterChipActive]}
                        onPress={() => setFilter(f)}
                    >
                        <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchLogs} colors={[COLORS.orange]} />}
            >
                {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => {
                        const iconCfg = getLogIcon(log.action);
                        return (
                            <View key={log._id} style={styles.logCard}>
                                <View style={[styles.logIcon, { backgroundColor: iconCfg.bg }]}>
                                    <MaterialCommunityIcons name={iconCfg.name} size={22} color={iconCfg.color} />
                                </View>
                                <View style={styles.logContent}>
                                    <Text style={styles.logDetails}>{log.details}</Text>
                                    <View style={styles.logMeta}>
                                        <Text style={styles.adminBadge}>{log.adminId?.name || 'Unknown Admin'}</Text>
                                        <Text style={styles.dot}>•</Text>
                                        <Text style={styles.timeText}>
                                            {new Date(log.createdAt).toLocaleDateString()} at {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })
                ) : !loading ? (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="clipboard-text-search-outline" size={64} color={COLORS.light} />
                        <Text style={styles.emptyTitle}>No logs found</Text>
                        <Text style={styles.emptySub}>Try adjusting your search or filters.</Text>
                    </View>
                ) : (
                    <ActivityIndicator size="large" color={COLORS.orange} style={{ marginTop: 40 }} />
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: COLORS.pageBg },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 20, 
        paddingTop: 60, 
        paddingBottom: 20,
        backgroundColor: COLORS.white
    },
    headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.dark },
    refreshBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.orangeBg, alignItems: 'center', justifyContent: 'center' },
    controlRow: { padding: 20, paddingBottom: 10 },
    searchContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: COLORS.white, 
        borderRadius: 16, 
        paddingHorizontal: 15,
        ...SHADOWS.sm,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, height: 50, fontSize: 14, color: COLORS.dark },
    filterRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, paddingBottom: 15 },
    filterChip: { 
        paddingHorizontal: 16, 
        paddingVertical: 8, 
        borderRadius: 20, 
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    filterChipActive: { backgroundColor: COLORS.orange, borderColor: COLORS.orange },
    filterText: { fontSize: 12, fontWeight: '700', color: COLORS.medium },
    filterTextActive: { color: COLORS.white },
    scrollContent: { padding: 20, paddingBottom: 40 },
    logCard: { 
        flexDirection: 'row', 
        backgroundColor: COLORS.white, 
        borderRadius: 20, 
        padding: 16, 
        marginBottom: 12,
        ...SHADOWS.sm,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)'
    },
    logIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
    logContent: { flex: 1 },
    logDetails: { fontSize: 15, fontWeight: '700', color: COLORS.dark, marginBottom: 8, lineHeight: 20 },
    logMeta: { flexDirection: 'row', alignItems: 'center' },
    adminBadge: { fontSize: 11, fontWeight: '800', color: COLORS.orange, backgroundColor: COLORS.orangeBg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
    dot: { marginHorizontal: 6, color: COLORS.light },
    timeText: { fontSize: 12, color: COLORS.medium, fontWeight: '500' },
    emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.medium, marginTop: 16 },
    emptySub: { fontSize: 14, color: COLORS.light, marginTop: 8 }
});
