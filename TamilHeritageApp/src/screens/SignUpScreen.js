import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, ScrollView,
    StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView,
    Platform, StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';
import { API_BASE } from '../constants/api';

import { 
    validateName, 
    validateEmail, 
    validatePassword, 
    validateConfirmPassword, 
    validatePhone 
} from '../utils/validation';

function Field({ label, optional, icon, rightIcon, value, onChangeText, placeholder,
    secureTextEntry, keyboardType, errorKey, autoCapitalize, errors, onBlur }) {
    return (
        <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
                <Text style={styles.fieldLabel}>{label}</Text>
                {optional ? <Text style={styles.optionalTag}>OPTIONAL</Text> : null}
            </View>
            <View style={[styles.inputWrap, errors[errorKey] ? styles.inputError : null]}>
                {icon}
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.light}
                    value={value}
                    onChangeText={onChangeText}
                    onBlur={onBlur}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType || 'default'}
                    autoCapitalize={autoCapitalize || 'none'}
                    autoCorrect={false}
                />
                {rightIcon}
            </View>
            {errors[errorKey] ? <Text style={styles.errText}>{errors[errorKey]}</Text> : null}
        </View>
    );
}

export default function SignUpScreen({ navigation }) {
    const [form, setForm] = useState({
        fullName: '', email: '', password: '', confirmPassword: '', phone: '',
    });
    const [errors, setErrors] = useState({});
    const [showPass, setShowPass] = useState(false);
    const [showCPass, setShowCPass] = useState(false);
    const [termsAccepted, setTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ type: '', msg: '' });

    const set = (key, val) => {
        setForm(f => ({ ...f, [key]: val }));
        // Clear error when user starts typing
        if (errors[key]) {
            setErrors(prev => {
                const newErrs = { ...prev };
                delete newErrs[key];
                return newErrs;
            });
        }
    };

    const validateField = (name, value) => {
        let error = null;
        switch (name) {
            case 'fullName': error = validateName(value); break;
            case 'email': error = validateEmail(value); break;
            case 'password': error = validatePassword(value); break;
            case 'confirmPassword': error = validateConfirmPassword(form.password, value); break;
            case 'phone': error = validatePhone(value); break;
        }
        setErrors(prev => ({ ...prev, [name]: error }));
        return !error;
    };

    const validateAll = () => {
        const e = {};
        const nameErr = validateName(form.fullName);
        const emailErr = validateEmail(form.email);
        const passErr = validatePassword(form.password);
        const cPassErr = validateConfirmPassword(form.password, form.confirmPassword);
        const phoneErr = validatePhone(form.phone);

        if (nameErr) e.fullName = nameErr;
        if (emailErr) e.email = emailErr;
        if (passErr) e.password = passErr;
        if (cPassErr) e.confirmPassword = cPassErr;
        if (phoneErr) e.phone = phoneErr;
        if (!termsAccepted) e.terms = 'Please accept the Terms & Privacy Policy.';

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleRegister = async () => {
        if (!validateAll()) return;
        setLoading(true);
        setToast({ type: '', msg: '' });
        
        try {
            const res = await fetch(`${API_BASE}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.fullName.trim(),
                    email: form.email.trim().toLowerCase(),
                    password: form.password,
                    phone: form.phone,
                }),
            });
            
            const data = await res.json();
            if (!res.ok) {
                setToast({ type: 'error', msg: data.message || 'Registration failed.' });
                return;
            }
            setToast({ type: 'success', msg: '✓ Account created! Redirecting…' });
            setTimeout(() => navigation.replace('Login'), 1200);
        } catch (error) {
            console.error('Signup error:', error);
            setToast({ type: 'error', msg: 'Network error. Please check your connection.' });
        } finally {
            setLoading(false);
        }
    };

    const isFormInvalid = 
        !form.fullName || 
        !form.email || 
        !form.password || 
        form.password !== form.confirmPassword || 
        !termsAccepted || 
        Object.values(errors).some(e => e !== null);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.pageBg} />
            <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

                <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={24} color={COLORS.dark} />
                    </TouchableOpacity>
                    <View style={styles.logoCircle}>
                        <MaterialCommunityIcons name="temple-hindu" size={24} color="#fff" />
                    </View>
                    <View style={{ width: 38 }} />
                </View>

                <View style={styles.header}>
                    <Text style={styles.title}>Create User Account</Text>
                    <Text style={styles.subtitle}>Join us in preserving and exploring{'\n'}the rich heritage of Tamil culture.</Text>
                </View>

                <View style={styles.card}>
                    {toast.msg ? (
                        <View style={[styles.toast, toast.type === 'error' ? styles.toastError : styles.toastSuccess]}>
                            <Text style={[styles.toastText, { color: toast.type === 'error' ? COLORS.error : COLORS.greenDark }]}>{toast.msg}</Text>
                        </View>
                    ) : null}

                    <Field label="Full Name" icon={<Ionicons name="person-outline" size={18} color={COLORS.light} />}
                        value={form.fullName} onChangeText={v => set('fullName', v)}
                        onBlur={() => validateField('fullName', form.fullName)}
                        placeholder="e.g. Arun Kumar" errorKey="fullName" autoCapitalize="words" errors={errors} />

                    <Field label="Email Address" icon={<MaterialCommunityIcons name="email-outline" size={18} color={COLORS.light} />}
                        value={form.email} onChangeText={v => set('email', v)}
                        onBlur={() => validateField('email', form.email)}
                        placeholder="name@example.com" keyboardType="email-address" errorKey="email" errors={errors} />

                    <Field label="Password" icon={<MaterialCommunityIcons name="lock-outline" size={18} color={COLORS.light} />}
                        rightIcon={<TouchableOpacity onPress={() => setShowPass(s => !s)}><Ionicons name={showPass ? 'eye-outline' : 'eye-off-outline'} size={18} color={COLORS.light} /></TouchableOpacity>}
                        value={form.password} onChangeText={v => set('password', v)}
                        onBlur={() => validateField('password', form.password)}
                        placeholder="••••••••" secureTextEntry={!showPass} errorKey="password" errors={errors} />

                    <Field label="Confirm Password" icon={<MaterialCommunityIcons name="shield-lock-outline" size={18} color={COLORS.light} />}
                        rightIcon={<TouchableOpacity onPress={() => setShowCPass(s => !s)}><Ionicons name={showCPass ? 'eye-outline' : 'eye-off-outline'} size={18} color={COLORS.light} /></TouchableOpacity>}
                        value={form.confirmPassword} onChangeText={v => set('confirmPassword', v)}
                        onBlur={() => validateField('confirmPassword', form.confirmPassword)}
                        placeholder="••••••••" secureTextEntry={!showCPass} errorKey="confirmPassword" errors={errors} />

                    <Field label="Phone Number" optional icon={<Ionicons name="call-outline" size={18} color={COLORS.light} />}
                        value={form.phone} onChangeText={v => set('phone', v)}
                        onBlur={() => validateField('phone', form.phone)}
                        placeholder="Exactly 10 digits" keyboardType="phone-pad" errorKey="phone" errors={errors} />

                    <TouchableOpacity style={styles.termsRow} onPress={() => setTerms(t => !t)} activeOpacity={0.8}>
                        <View style={[styles.checkbox, termsAccepted ? styles.checkboxChecked : null]}>
                            {termsAccepted ? <Ionicons name="checkmark" size={12} color="#fff" /> : null}
                        </View>
                        <Text style={styles.termsText}>
                            I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text> regarding digital preservation.
                        </Text>
                    </TouchableOpacity>
                    {errors.terms ? <Text style={styles.errText}>{errors.terms}</Text> : null}

                    <TouchableOpacity 
                        style={[styles.btnPrimary, (loading || isFormInvalid) ? { backgroundColor: COLORS.light, shadowOpacity: 0 } : null]} 
                        onPress={handleRegister} 
                        disabled={loading || isFormInvalid} 
                        activeOpacity={0.88}
                    >
                        {loading
                            ? <ActivityIndicator color="#fff" />
                            : <><Text style={styles.btnPrimaryText}>Register Account</Text><Ionicons name="person-add-outline" size={18} color="#fff" style={{ marginLeft: 8 }} /></>
                        }
                    </TouchableOpacity>
                </View>

                <View style={styles.footerWrap}>
                    <Text style={styles.footerText}>
                        Already have an account?{' '}
                        <Text style={styles.footerLink} onPress={() => navigation.navigate('Login')}>Login</Text>
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.adminLink}>ADMIN LOGIN</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: COLORS.pageBg },
    scrollContent: { paddingBottom: 40 },
    topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 },
    backBtn: { padding: 8 },
    logoCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.orange, alignItems: 'center', justifyContent: 'center', ...SHADOWS.md },
    header: { paddingHorizontal: 24, marginTop: 14, alignItems: 'center' },
    title: { fontSize: 26, fontWeight: '800', color: COLORS.orange, textAlign: 'center', lineHeight: 32 },
    subtitle: { fontSize: 13, color: COLORS.medium, textAlign: 'center', marginTop: 6, lineHeight: 20 },
    card: { backgroundColor: COLORS.white, borderRadius: 24, marginHorizontal: 16, marginTop: 22, padding: 22, ...SHADOWS.md },
    toast: { borderRadius: 10, padding: 12, marginBottom: 14, alignItems: 'center' },
    toastError: { backgroundColor: '#FDECEA', borderWidth: 1, borderColor: '#F5C6C2' },
    toastSuccess: { backgroundColor: '#EAFAF1', borderWidth: 1, borderColor: '#A9DFBF' },
    toastText: { fontSize: 13, fontWeight: '600' },
    fieldGroup: { marginBottom: 16 },
    fieldLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    fieldLabel: { fontSize: 13, fontWeight: '600', color: COLORS.dark },
    optionalTag: { fontSize: 10, fontWeight: '400', color: COLORS.light, letterSpacing: 0.5 },
    inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.inputBg, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 13, gap: 10, borderWidth: 1.5, borderColor: 'transparent' },
    inputError: { borderColor: COLORS.error, backgroundColor: '#FFF5F5' },
    input: { flex: 1, fontSize: 14, color: COLORS.dark },
    errText: { fontSize: 11, color: COLORS.error, marginTop: 5, paddingLeft: 4 },
    termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 18, marginBottom: 4 },
    checkbox: { width: 20, height: 20, borderRadius: 5, borderWidth: 1.5, borderColor: COLORS.light, alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0 },
    checkboxChecked: { backgroundColor: COLORS.orange, borderColor: COLORS.orange },
    termsText: { flex: 1, fontSize: 12.5, color: COLORS.medium, lineHeight: 19 },
    termsLink: { color: COLORS.orange, fontWeight: '600' },
    btnPrimary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.orange, borderRadius: 50, paddingVertical: 16, marginTop: 20, shadowColor: COLORS.orange, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 },
    btnPrimaryText: { fontSize: 16, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },
    footerWrap: { alignItems: 'center', marginTop: 22, paddingBottom: 10 },
    footerText: { fontSize: 13.5, color: COLORS.medium },
    footerLink: { color: COLORS.orange, fontWeight: '700' },
    adminLink: { color: COLORS.orange, fontSize: 13, fontWeight: '700', letterSpacing: 1, marginTop: 10 },
});
