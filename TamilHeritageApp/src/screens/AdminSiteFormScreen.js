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
        description: site?.description || '',
        location: site?.location || '',
        detail: site?.detail || '',
        image: site?.image || '',
        category: site?.category || '',
        latitude: site?.latitude ? String(site.latitude) : '',
        longitude: site?.longitude ? String(site.longitude) : '',
    });

    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        const { name, description, location, image, latitude, longitude } = formData;

        // Validation
        if (!name.trim() || !description.trim() || !location.trim()) {
            return Alert.alert('Error', 'Name, Description, and Location are required.');
        }

        if (image && !image.startsWith('http')) {
            return Alert.alert('Error', 'Image must be a valid URL starting with http/https.');
        }

        setLoading(true);
        try {
            const payload = {
                ...formData,
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null,
            };

            if (isEditing) {
                await api.put(`/api/heritage-sites/${site._id}`, payload);
                Alert.alert('Success', 'Site updated successfully!');
            } else {
                await api.post('/api/heritage-sites', payload);
                Alert.alert('Success', 'Site added successfully!');
            }
            navigation.goBack();
        } catch (err) {
            const msg = err.response?.data?.message || 'Something went wrong';
            Alert.alert('Error', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{isEditing ? 'Update Site' : 'Add New Site'}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.label}>Site Name *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(t) => setFormData({ ...formData, name: t })}
                    placeholder="e.g. Meenakshi Amman Temple"
                />

                <Text style={styles.label}>Location / State *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.location}
                    onChangeText={(t) => setFormData({ ...formData, location: t })}
                    placeholder="e.g. Madurai, Tamil Nadu"
                />

                <Text style={styles.label}>Region (City/District)</Text>
                <TextInput
                    style={styles.input}
                    value={formData.detail}
                    onChangeText={(t) => setFormData({ ...formData, detail: t })}
                    placeholder="e.g. Madurai"
                />

                <Text style={styles.label}>Image URL (Public HTTPS)</Text>
                <TextInput
                    style={styles.input}
                    value={formData.image}
                    onChangeText={(t) => setFormData({ ...formData, image: t })}
                    placeholder="https://example.com/image.jpg"
                />

                <Text style={styles.label}>Category</Text>
                <TextInput
                    style={styles.input}
                    value={formData.category}
                    onChangeText={(t) => setFormData({ ...formData, category: t })}
                    placeholder="Temple / Monument / etc."
                />

                <Text style={styles.label}>Description *</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.description}
                    onChangeText={(t) => setFormData({ ...formData, description: t })}
                    multiline
                    numberOfLines={4}
                    placeholder="Short overview of the site..."
                />

                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Latitude (Optional)</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.latitude}
                            onChangeText={(t) => setFormData({ ...formData, latitude: t })}
                            placeholder="e.g. 9.9197"
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={{ width: 16 }} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Longitude (Optional)</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.longitude}
                            onChangeText={(t) => setFormData({ ...formData, longitude: t })}
                            placeholder="e.g. 78.1194"
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <TouchableOpacity 
                    style={[styles.saveBtn, loading && { opacity: 0.7 }]} 
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveBtnText}>{isEditing ? 'Update Site' : 'Create Site'}</Text>
                    )}
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
