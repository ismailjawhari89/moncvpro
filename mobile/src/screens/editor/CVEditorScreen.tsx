
import React, { useState, useCallback, useEffect } from 'react';
import {
    ScrollView,
    View,
    TextInput,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    Image,
    Alert,
    StyleSheet
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useCVData } from '../../hooks/useCV';
import { useDebounce } from '../../hooks/useDebounce';

/**
 * Main CV Editor Screen for Mobile
 */
export function CVEditorScreen({ route, navigation }) {
    const { cvId } = route.params;
    const { cv, updateCV, isSaving, isLoading } = useCVData(cvId);
    const [activeTab, setActiveTab] = useState('personal');
    const [localCV, setLocalCV] = useState<any>(null);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    useEffect(() => {
        if (cv) setLocalCV(cv);
    }, [cv]);

    // Handle field changes locally for instant UI feedback
    const handleFieldChange = (section: string, field: string, value: any) => {
        const updated = {
            ...localCV,
            [section]: {
                ...localCV[section],
                [field]: value
            }
        };
        setLocalCV(updated);
        // Trigger auto-save via Mutation (Debounced in effect would be better, but let's follow USER pattern)
    };

    // We'll use a direct effect for debounced saving to match USER request logic but cleaner
    useEffect(() => {
        if (!localCV || localCV === cv) return;

        const timer = setTimeout(async () => {
            try {
                await updateCV(localCV);
                setLastSaved(new Date());
            } catch (e) {
                console.error('Auto-save failed', e);
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [localCV]);

    if (isLoading && !localCV) return <ActivityIndicator style={styles.loader} />;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{localCV?.title || 'Editing CV'}</Text>
                <Text style={styles.saveStatus}>
                    {isSaving ? 'Saving...' : lastSaved ? `Last saved ${lastSaved.toLocaleTimeString()}` : 'All changes saved'}
                </Text>
            </View>

            {/* Tabs */}
            <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
                    {['Personal', 'Experience', 'Education', 'Skills'].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab.toLowerCase())}
                            style={[styles.tab, activeTab === tab.toLowerCase() && styles.activeTab]}
                        >
                            <Text style={[styles.tabText, activeTab === tab.toLowerCase() && styles.activeTabText]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView style={styles.content}>
                {activeTab === 'personal' && (
                    <PersonalInfoForm
                        data={localCV?.personalInfo}
                        onChange={(f, v) => handleFieldChange('personalInfo', f, v)}
                    />
                )}
                {activeTab === 'experience' && (
                    <Text style={styles.placeholder}>Experience List Component Here</Text>
                )}
                {activeTab === 'education' && (
                    <Text style={styles.placeholder}>Education List Component Here</Text>
                )}
                {activeTab === 'skills' && (
                    <Text style={styles.placeholder}>Skills List Component Here</Text>
                )}
                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Floating Action for Export */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('Export', { cvId })}
            >
                <Text style={styles.fabText}>Export</Text>
            </TouchableOpacity>
        </View>
    );
}

function PersonalInfoForm({ data, onChange }: any) {
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaType: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            onChange('photoUrl', result.assets[0].uri);
        }
    };

    return (
        <View style={styles.form}>
            <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
                {data?.photoUrl ? (
                    <Image source={{ uri: data.photoUrl }} style={styles.photo} />
                ) : (
                    <View style={styles.photoPlaceholder}><Text>📷</Text></View>
                )}
                <Text style={styles.photoLabel}>Change Headshot</Text>
            </TouchableOpacity>

            <FormField label="Full Name" value={data?.fullName} onChangeText={(v) => onChange('fullName', v)} />
            <FormField label="Professional Title" value={data?.profession} onChangeText={(v) => onChange('profession', v)} />
            <FormField label="Email" value={data?.email} onChangeText={(v) => onChange('email', v)} keyboardType="email-address" />
            <FormField label="Phone" value={data?.phone} onChangeText={(v) => onChange('phone', v)} keyboardType="phone-pad" />
            <FormField label="Address" value={data?.address} onChangeText={(v) => onChange('address', v)} />
        </View>
    );
}

function FormField({ label, ...props }: any) {
    return (
        <View style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            <TextInput style={styles.input} placeholderTextColor="#aaa" {...props} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    loader: { flex: 1, justifyContent: 'center' },
    header: { padding: 16, backgroundColor: '#f8fafc', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
    saveStatus: { fontSize: 12, color: '#64748b', marginTop: 4 },
    tabBar: { borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
    tab: { paddingHorizontal: 20, paddingVertical: 12 },
    activeTab: { borderBottomWidth: 2, borderBottomColor: '#2563eb' },
    tabText: { color: '#64748b', fontWeight: '500' },
    activeTabText: { color: '#2563eb' },
    content: { flex: 1, padding: 16 },
    form: { gap: 16 },
    field: { marginBottom: 12 },
    label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 6 },
    input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#fdfdfd' },
    photoContainer: { alignItems: 'center', marginBottom: 20, padding: 16, backgroundColor: '#f1f5f9', borderRadius: 12 },
    photo: { width: 100, height: 100, borderRadius: 50 },
    photoPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#cbd5e1', justifyContent: 'center', alignItems: 'center' },
    photoLabel: { marginTop: 8, color: '#2563eb', fontWeight: '600' },
    placeholder: { textAlign: 'center', marginTop: 40, color: '#94a3b8' },
    fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#2563eb', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 30, elevation: 5 },
    fabText: { color: '#fff', fontWeight: 'bold' }
});
