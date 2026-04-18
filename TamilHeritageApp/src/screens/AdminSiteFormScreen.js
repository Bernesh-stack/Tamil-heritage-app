import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, ScrollView,
    StyleSheet, StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api';
import { COLORS, SHADOWS } from '../constants/theme';

export default function AdminSiteFormScreen({ route, navigation }) {
    const { site } = route.params || {}; // If site exists, we are UPDATING
    const isEditing = !!site;

    const [formData, setFormData] = useState({
        name: site?.name || '',
        location: site?.location || '',
        detail: site?.detail || '',
        builtBy: site?.builtBy || '',
        overview: site?.overview || '',
        history: site?.history || '',
        significance: site?.significance || '',
        googleMapsUrl: site?.googleMapsUrl || '',
    });

    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        const { name, location, overview } = formData;

        if (!name.trim() || !location.trim() || !overview.trim()) {
            return Alert.alert('Error', 'Name, Address, and Overview are required.');
        }

        setLoading(true);
        try {
            if (isEditing) {
                await api.put(`/api/heritage-sites/${site._id}`, formData);
                Alert.alert('Success', 'Site updated successfully!');
            } else {
                await api.post('/api/heritage-sites', formData);
                Alert.alert('Success', 'Site added successfully!');
            }
            navigation.goBack();
        } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{isEditing ? 'Update Site' : 'Add New Site'}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.label}>Site Name *</Text>
                <TextInput style={styles.input} value={formData.name} onChangeText={(t) => setFormData({ ...formData, name: t })} placeholder="e.g. Meenakshi Temple" />

                <Text style={styles.label}>Place Address *</Text>
                <TextInput style={styles.input} value={formData.location} onChangeText={(t) => setFormData({ ...formData, location: t })} placeholder="Full address" />

                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Built By</Text>
                        <TextInput style={styles.input} value={formData.builtBy} onChangeText={(t) => setFormData({ ...formData, builtBy: t })} placeholder="Dynasty/King" />
                    </View>
                    <View style={{ width: 16 }} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Region Name</Text>
                        <TextInput style={styles.input} value={formData.detail} onChangeText={(t) => setFormData({ ...formData, detail: t })} placeholder="City/District" />
                    </View>
                </View>

                <Text style={styles.label}>Overview *</Text>
                <TextInput style={[styles.input, styles.textArea]} value={formData.overview} onChangeText={(t) => setFormData({ ...formData, overview: t })} multiline numberOfLines={4} placeholder="Short overview..." />

                <Text style={styles.label}>History</Text>
                <TextInput style={[styles.input, styles.textArea]} value={formData.history} onChangeText={(t) => setFormData({ ...formData, history: t })} multiline numberOfLines={4} placeholder="Historical context..." />

                <Text style={styles.label}>Significance</Text>
                <TextInput style={[styles.input, styles.textArea]} value={formData.significance} onChangeText={(t) => setFormData({ ...formData, significance: t })} multiline numberOfLines={4} placeholder="Architectural significance..." />

                <Text style={styles.label}>Google Map Link</Text>
                <TextInput style={styles.input} value={formData.googleMapsUrl} onChangeText={(t) => setFormData({ ...formData, googleMapsUrl: t })} placeholder="Paste Google Maps URL" />

                <TouchableOpacity style={[styles.saveBtn, loading && { opacity: 0.7 }]} onPress={handleSave} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>{isEditing ? 'Update Site' : 'Create Site'}</Text>}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.dark },
    container: { padding: 20 },
    label: { fontSize: 14, fontWeight: '600', color: COLORS.medium, marginBottom: 8, marginTop: 12 },
    input: { backgroundColor: COLORS.inputBg, borderRadius: 12, padding: 14, fontSize: 15, color: COLORS.dark },
    textArea: { height: 100, textAlignVertical: 'top' },
    row: { flexDirection: 'row' },
    saveBtn: { backgroundColor: COLORS.orange, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 32, ...SHADOWS.md },
    saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
