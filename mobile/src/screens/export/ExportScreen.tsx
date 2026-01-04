
import React, { useState } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    Alert,
    StyleSheet
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { cvService } from '../../services/cv.service';

/**
 * Screen to handle CV preview, export and sharing
 */
export function ExportScreen({ route, navigation }) {
    const { cvId } = route.params;
    const [isExporting, setIsExporting] = useState(false);
    const [pdfUri, setPdfUri] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleExport = async (format: string) => {
        try {
            setIsExporting(true);
            // In a real app, the API returns a URL or base64
            // For this demo, we mock the service call
            const response = await cvService.getCV(cvId); // Placeholder

            // Mocking a PDF generation result
            const mockPdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

            setPdfUri(mockPdfUrl);
            setShowPreview(true);

            Alert.alert('Success', `CV Generated in ${format.toUpperCase()} format`);
        } catch (error: any) {
            Alert.alert('Export failed', error.message);
        } finally {
            setIsExporting(false);
        }
    };

    const handleShare = async () => {
        if (!pdfUri) return;

        try {
            const isAvailable = await Sharing.isAvailableAsync();
            if (isAvailable) {
                // We might need to download it first if it's a remote URL
                const fileName = `CV_${cvId}.pdf`;
                const localPath = FileSystem.cacheDirectory + fileName;

                const download = await FileSystem.downloadAsync(pdfUri, localPath);
                await Sharing.shareAsync(download.uri);
            } else {
                Alert.alert('Error', 'Sharing is not available on this device');
            }
        } catch (error: any) {
            Alert.alert('Share failed', error.message);
        }
    };

    if (showPreview && pdfUri) {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.previewHeader}>
                    <TouchableOpacity onPress={() => setShowPreview(false)}>
                        <Text style={styles.headerAction}>Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.previewTitle}>Preview</Text>
                    <TouchableOpacity onPress={handleShare}>
                        <Text style={styles.headerAction}>Share</Text>
                    </TouchableOpacity>
                </View>

                <WebView
                    source={{ uri: pdfUri }}
                    style={{ flex: 1 }}
                    startInLoadingState={true}
                    renderLoading={() => <ActivityIndicator size="large" style={styles.loader} />}
                />

                <View style={styles.previewFooter}>
                    <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                        <Text style={styles.shareButtonText}>Share PDF</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Export Your CV</Text>
            <Text style={styles.subtitle}>Choose a format to download or share your professional resume.</Text>

            <View style={styles.options}>
                <ExportOption
                    title="Professional PDF"
                    description="Best for most applications"
                    onPress={() => handleExport('pdf')}
                    disabled={isExporting}
                />
                <ExportOption
                    title="High Quality PDF"
                    description="Vector-based for premium printing"
                    onPress={() => handleExport('pdf-hq')}
                    disabled={isExporting}
                    premium
                />
                <ExportOption
                    title="ATS-Optimized"
                    description="Optimized for scanner reading"
                    onPress={() => handleExport('pdf-ats')}
                    disabled={isExporting}
                />
            </View>

            {isExporting && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2563eb" />
                    <Text style={styles.loadingText}>Building your professional CV...</Text>
                </View>
            )}
        </ScrollView>
    );
}

function ExportOption({ title, description, onPress, disabled, premium }: any) {
    return (
        <TouchableOpacity
            style={[styles.option, disabled && styles.optionDisabled]}
            onPress={onPress}
            disabled={disabled}
        >
            <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{title}</Text>
                <Text style={styles.optionDescription}>{description}</Text>
            </View>
            {premium && (
                <View style={styles.badge}><Text style={styles.badgeText}>PRO</Text></View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#64748b', marginBottom: 24, lineHeight: 20 },
    options: { gap: 12 },
    option: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8fafc'
    },
    optionDisabled: { opacity: 0.5 },
    optionContent: { flex: 1 },
    optionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
    optionDescription: { fontSize: 12, color: '#64748b', marginTop: 4 },
    badge: { backgroundColor: '#f59e0b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    loadingContainer: { marginTop: 40, alignItems: 'center' },
    loadingText: { marginTop: 12, color: '#64748b' },
    previewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        paddingTop: 50
    },
    headerAction: { color: '#2563eb', fontWeight: '600' },
    previewTitle: { fontWeight: 'bold', fontSize: 16 },
    loader: { position: 'absolute', top: '50%', left: '50%', marginLeft: -20, marginTop: -20 },
    previewFooter: { padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0' },
    shareButton: { backgroundColor: '#2563eb', padding: 16, borderRadius: 12, alignItems: 'center' },
    shareButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
