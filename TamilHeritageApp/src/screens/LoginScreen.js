import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, ScrollView,
    StatusBar, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';
import { API_BASE } from '../constants/api';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError('');
        if (!email.trim() || !password) {
            setError('Please enter your email and password.');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Login failed. Please try again.');
                return;
            }
            await AsyncStorage.setItem('authToken', data.token);
            await AsyncStorage.setItem('currentUser', JSON.stringify(data.user));
            navigation.replace('AppTabs');
        } catch (_) {
            setError('Cannot connect to server. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.pageBg} />
            <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

                {/* Top Bar */}
                <View style={styles.topBar}>
                    <View />
                    <View style={styles.logoCircle}>
                        <MaterialCommunityIcons name="temple-hindu" size={24} color="#fff" />
                    </View>
                    <TouchableOpacity style={styles.langBadge}>
                        <Text style={styles.langText}>EN</Text>
                    </TouchableOpacity>
                </View>

                {/* Heading */}
                <View style={styles.header}>
                    <Text style={styles.title}>Digital Preservation</Text>
                    <Text style={styles.subtitle}>EXPLORE ANCIENT TAMIL HERITAGE</Text>
                </View>

                {/* Form Card */}
                <View style={styles.card}>

                    {error ? (
                        <View style={styles.errorBanner}>
                            <Ionicons name="alert-circle-outline" size={16} color={COLORS.error} />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    {/* Email */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>Email Address</Text>
                        <View style={styles.inputWrap}>
                            <MaterialCommunityIcons name="email-outline" size={18} color={COLORS.light} />
                            <TextInput
                                style={styles.input}
                                placeholder="name@example.com"
                                placeholderTextColor={COLORS.light}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                    </View>

                    {/* Password */}
                    <View style={styles.fieldGroup}>
                        <View style={styles.fieldLabelRow}>
                            <Text style={styles.fieldLabel}>Password</Text>
                            <TouchableOpacity>
                                <Text style={styles.forgotLink}>Forgot?</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputWrap}>
                            <MaterialCommunityIcons name="lock-outline" size={18} color={COLORS.light} />
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor={COLORS.light}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPass}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <TouchableOpacity onPress={() => setShowPass(s => !s)}>
                                <Ionicons name={showPass ? 'eye-outline' : 'eye-off-outline'} size={18} color={COLORS.light} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity style={styles.btnLogin} onPress={handleLogin} disabled={loading} activeOpacity={0.88}>
                        {loading
                            ? <ActivityIndicator color="#fff" />
                            : <>
                                <Text style={styles.btnLoginText}>Login</Text>
                                <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
                            </>
                        }
                    </TouchableOpacity>

                    {/* Demo Hint */}
                    <View style={styles.demoCard}>
                        <View style={styles.demoHeader}>
                            <Ionicons name="information-circle-outline" size={15} color={COLORS.orange} />
                            <Text style={styles.demoTitle}>  DEMO – Admin Credentials</Text>
                        </View>
                        <Text style={styles.demoRow}><Text style={styles.demoKey}>Email    </Text>bernesh.in@gmail.com</Text>
                        <Text style={styles.demoRow}><Text style={styles.demoKey}>Password </Text>Heritage@2024!</Text>
                    </View>

                </View>

                {/* Footer */}
                <View style={styles.footerWrap}>
                    <Text style={styles.footerText}>
                        Don't have an account?{' '}
                        <Text style={styles.footerLink} onPress={() => navigation.navigate('SignUp')}>Sign Up</Text>
                    </Text>
                </View>

                {/* Temple Silhouette */}
                <View style={styles.silhouetteWrap}>
                    <View style={styles.silhouette}>
                        <MaterialCommunityIcons name="temple-hindu" size={80} color={COLORS.orange} style={{ opacity: 0.35 }} />
                    </View>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: COLORS.pageBg },
    scrollContent: { paddingBottom: 30 },

    topBar: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16,
    },
    logoCircle: {
        width: 52, height: 52, borderRadius: 26,
        backgroundColor: COLORS.orange,
        alignItems: 'center', justifyContent: 'center',
        ...SHADOWS.md,
    },
    langBadge: {
        borderWidth: 1.5, borderColor: COLORS.orange, borderRadius: 8,
        paddingHorizontal: 10, paddingVertical: 5,
    },
    langText: { fontSize: 11, fontWeight: '700', color: COLORS.orange },

    header: { alignItems: 'center', marginTop: 20, paddingHorizontal: 24 },
    title: { fontSize: 24, fontWeight: '800', color: COLORS.dark, textAlign: 'center' },
    subtitle: { fontSize: 11, fontWeight: '600', letterSpacing: 1.5, color: COLORS.light, marginTop: 4, textAlign: 'center' },

    card: {
        backgroundColor: COLORS.white, borderRadius: 24,
        marginHorizontal: 16, marginTop: 22,
        padding: 22, ...SHADOWS.md,
    },

    errorBanner: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: '#FDECEA', borderWidth: 1, borderColor: '#F5C6C2',
        borderRadius: 10, padding: 12, marginBottom: 14,
    },
    errorText: { flex: 1, fontSize: 13, color: COLORS.error, fontWeight: '500' },

    fieldGroup: { marginBottom: 16 },
    fieldLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    fieldLabel: { fontSize: 13, fontWeight: '600', color: COLORS.dark, marginBottom: 8 },
    forgotLink: { fontSize: 13, fontWeight: '600', color: COLORS.orange },

    inputWrap: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: COLORS.inputBg, borderRadius: 10,
        paddingHorizontal: 14, paddingVertical: 13, gap: 10,
        borderWidth: 1.5, borderColor: 'transparent',
    },
    input: { flex: 1, fontSize: 14, color: COLORS.dark },

    btnLogin: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: COLORS.orange, borderRadius: 50,
        paddingVertical: 16, marginTop: 6,
        shadowColor: COLORS.orange, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
    },
    btnLoginText: { fontSize: 16, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },

    demoCard: {
        marginTop: 14, borderRadius: 10, borderWidth: 1.2,
        borderColor: '#F5C87A', backgroundColor: '#FFFBF0',
        padding: 13,
    },
    demoHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    demoTitle: { fontSize: 11, fontWeight: '700', color: COLORS.orange, letterSpacing: 0.6 },
    demoRow: { fontSize: 12.5, color: COLORS.dark, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', marginTop: 2 },
    demoKey: { fontWeight: '700', color: COLORS.medium },

    footerWrap: { alignItems: 'center', marginTop: 24 },
    footerText: { fontSize: 13.5, color: COLORS.medium, textAlign: 'center' },
    footerLink: { color: COLORS.orange, fontWeight: '700' },

    silhouetteWrap: { alignItems: 'center', marginTop: 20 },
    silhouette: {
        width: 180, height: 120,
        backgroundColor: '#F5D9A8', borderRadius: 14,
        alignItems: 'center', justifyContent: 'flex-end',
        overflow: 'hidden', paddingBottom: 8,
    },
});
