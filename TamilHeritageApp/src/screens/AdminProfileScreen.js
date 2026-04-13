import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet,
    StatusBar, Alert, Modal, TextInput, Image, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS, SHADOWS } from '../constants/theme';

export default function AdminProfileScreen({ navigation }) {
    const [user, setUser] = useState({ name: 'Heritage Admin', email: '', isAdmin: true });
    const [photoUri, setPhotoUri] = useState(null);
    const [editVisible, setEditVisible] = useState(false);
    const [editName, setEditName] = useState('');
    const { logout } = useAuth();

    const loadUserInfo = useCallback(async () => {
        try {
            const raw = await AsyncStorage.getItem('currentUser');
            if (raw) {
                const u = JSON.parse(raw);
                setUser(u);
                setEditName(u.name);
            }
            
            const photo = await AsyncStorage.getItem('adminProfilePhoto');
            if (photo) {
                setPhotoUri(photo);
            }
        } catch (error) {
            console.error('Error loading admin profile:', error);
        }
    }, []);

    useEffect(() => {
        loadUserInfo();
    }, [loadUserInfo]);

    const handleSignOut = () => {
        if (Platform.OS === 'web') {
            if (window.confirm('Are you sure you want to sign out?')) {
                logout();
            }
            return;
        }

        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out', style: 'destructive', onPress: async () => {
                    await logout();
                },
            },
        ]);
    };

    const handlePickPhoto = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') { Alert.alert('Permission needed', 'Please allow access to your photo library.'); return; }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, aspect: [1, 1], quality: 0.7,
        });
        if (!result.canceled && result.assets?.[0]?.uri) {
            const uri = result.assets[0].uri;
            setPhotoUri(uri);
            await AsyncStorage.setItem('adminProfilePhoto', uri);
        }
    };

    const handleSaveName = async () => {
        if (!editName.trim()) return;
        const updated = { ...user, name: editName.trim() };
        setUser(updated);
        await AsyncStorage.setItem('currentUser', JSON.stringify(updated));
        setEditVisible(false);
    };

    const initials = user.name
        ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : 'A';

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={22} color={COLORS.dark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Admin Profile</Text>
                <TouchableOpacity style={styles.signOutIconBtn} onPress={handleSignOut}>
                    <MaterialCommunityIcons name="logout" size={20} color={COLORS.orange} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Profile Card */}
                <View style={styles.card}>
                    <TouchableOpacity style={styles.avatarWrap} onPress={handlePickPhoto} activeOpacity={0.85}>
                        {photoUri
                            ? <Image source={{ uri: photoUri }} style={styles.avatarImg} />
                            : <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
                        }
                        <View style={styles.onlineDot} />
                        <View style={styles.cameraBtn}>
                            <Ionicons name="camera" size={12} color="#fff" />
                        </View>
                    </TouchableOpacity>

                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>

                    <View style={styles.adminBadge}>
                        <Text style={styles.adminBadgeText}>ADMINISTRATOR</Text>
                    </View>

                    {/* Edit Profile only — no share, no security */}
                    <TouchableOpacity
                        style={styles.editBtn}
                        onPress={() => { setEditName(user.name); setEditVisible(true); }}
                        activeOpacity={0.85}
                    >
                        <Feather name="edit-2" size={14} color={COLORS.dark} />
                        <Text style={styles.editBtnText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* Activity Overview */}
                <View style={styles.card}>
                    <View style={styles.cardTitleRow}>
                        <Text style={styles.cardTitle}>Activity Overview</Text>
                        <Text style={styles.liveTag}>Live Data</Text>
                    </View>
                    <View style={styles.activityGrid}>
                        <View style={styles.activityItem}>
                            <MaterialCommunityIcons name="bank-outline" size={22} color={COLORS.orange} />
                            <Text style={styles.activityNum}>1,284</Text>
                            <Text style={styles.activityLabel}>HERITAGE SITES</Text>
                            <Text style={styles.activityGrowth}>↑+12%</Text>
                        </View>
                        <View style={styles.activityItem}>
                            <MaterialCommunityIcons name="account-group-outline" size={22} color={COLORS.orange} />
                            <Text style={styles.activityNum}>42.5k</Text>
                            <Text style={styles.activityLabel}>REGISTERED USERS</Text>
                            <Text style={styles.activityGrowth}>↑+5.2%</Text>
                        </View>
                        <View style={styles.activityItem}>
                            <MaterialCommunityIcons name="message-text-outline" size={22} color={COLORS.orange} />
                            <Text style={styles.activityNum}>892</Text>
                            <Text style={styles.activityLabel}>FEEDBACK RECEIVED</Text>
                            <Text style={[styles.activityGrowth, { color: COLORS.orange }]}>⊕14 New</Text>
                        </View>
                        <View style={styles.activityItem}>
                            <MaterialCommunityIcons name="access-point" size={22} color={COLORS.green} />
                            <Text style={[styles.activityNum, { color: COLORS.green }]}>Active</Text>
                            <Text style={styles.activityLabel}>SYSTEM ACTIVITY</Text>
                            <Text style={[styles.activityGrowth, { color: COLORS.green }]}>99.9% Uptime</Text>
                        </View>
                    </View>
                </View>

                {/* Sign Out */}
                <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} activeOpacity={0.88}>
                    <MaterialCommunityIcons name="logout" size={20} color="#E74C3C" />
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* Edit Name Modal */}
            <Modal visible={editVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Edit Name</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={editName}
                            onChangeText={setEditName}
                            placeholder="Enter your name"
                            placeholderTextColor={COLORS.light}
                            autoFocus
                        />
                        <View style={styles.modalBtns}>
                            <TouchableOpacity style={styles.modalCancel} onPress={() => setEditVisible(false)}>
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalSave} onPress={handleSaveName}>
                                <Text style={styles.modalSaveText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: COLORS.pageBg },
    scrollContent: { padding: 16, paddingBottom: 40, gap: 16 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10, backgroundColor: '#fff', ...SHADOWS.sm },
    backBtn: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.inputBg },
    headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.dark },
    signOutIconBtn: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.orangeBg },
    card: { backgroundColor: COLORS.white, borderRadius: 20, padding: 20, ...SHADOWS.md, borderWidth: 1.5, borderColor: COLORS.border },
    cardTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
    cardTitle: { fontSize: 17, fontWeight: '800', color: COLORS.dark },
    liveTag: { fontSize: 11, fontWeight: '700', color: COLORS.orange },
    avatarWrap: { alignSelf: 'center', marginBottom: 14, position: 'relative' },
    avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: COLORS.orange, alignItems: 'center', justifyContent: 'center' },
    avatarImg: { width: 90, height: 90, borderRadius: 45 },
    avatarText: { fontSize: 32, fontWeight: '800', color: '#fff' },
    onlineDot: { position: 'absolute', bottom: 4, right: 4, width: 14, height: 14, borderRadius: 7, backgroundColor: COLORS.green, borderWidth: 2, borderColor: '#fff' },
    cameraBtn: { position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: 13, backgroundColor: COLORS.orangeDark, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
    userName: { fontSize: 22, fontWeight: '800', color: COLORS.dark, textAlign: 'center' },
    userEmail: { fontSize: 13, color: COLORS.medium, textAlign: 'center', marginTop: 4 },
    adminBadge: { alignSelf: 'center', marginTop: 10, paddingHorizontal: 20, paddingVertical: 6, borderRadius: 20, backgroundColor: COLORS.orange },
    adminBadgeText: { fontSize: 11, fontWeight: '800', color: '#fff', letterSpacing: 1 },
    editBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, alignSelf: 'stretch', marginTop: 14, paddingVertical: 12, borderRadius: 50, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.orangeBg },
    editBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.dark },
    activityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    activityItem: { width: '47%', backgroundColor: COLORS.inputBg, borderRadius: 14, padding: 14, gap: 3 },
    activityNum: { fontSize: 22, fontWeight: '800', color: COLORS.dark },
    activityLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8, color: COLORS.light },
    activityGrowth: { fontSize: 11, fontWeight: '700', color: COLORS.green },
    signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: COLORS.white, borderRadius: 16, paddingVertical: 18, borderWidth: 1.5, borderColor: '#FDECEA', ...SHADOWS.sm },
    signOutText: { fontSize: 16, fontWeight: '700', color: '#E74C3C' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
    modalCard: { backgroundColor: '#fff', borderRadius: 20, padding: 24, width: '82%', ...SHADOWS.lg },
    modalTitle: { fontSize: 18, fontWeight: '800', color: COLORS.dark, marginBottom: 16 },
    modalInput: { backgroundColor: COLORS.inputBg, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: COLORS.dark, borderWidth: 1.5, borderColor: COLORS.border, marginBottom: 20 },
    modalBtns: { flexDirection: 'row', gap: 12 },
    modalCancel: { flex: 1, paddingVertical: 13, borderRadius: 50, borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center' },
    modalCancelText: { fontSize: 14, fontWeight: '600', color: COLORS.medium },
    modalSave: { flex: 1, paddingVertical: 13, borderRadius: 50, backgroundColor: COLORS.orange, alignItems: 'center' },
    modalSaveText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
