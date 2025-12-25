
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import type { CVData } from '@/types/cv';
import { PDFHeader } from './shared/PDFHeader';
import { registerPDFFonts } from './shared/pdf-fonts';

registerPDFFonts();

const styles = StyleSheet.create({
    page: {
        padding: 50,
        backgroundColor: '#ffffff',
    },
    recipientSection: {
        marginTop: 20,
        marginBottom: 30,
    },
    recipientText: {
        fontSize: 11,
        color: '#374151',
        marginBottom: 4,
    },
    date: {
        fontSize: 11,
        color: '#6b7280',
        marginBottom: 20,
    },
    body: {
        fontSize: 11,
        lineHeight: 1.6,
        color: '#1f2937',
        textAlign: 'justify',
    },
    signOff: {
        marginTop: 40,
    },
    signOffTitle: {
        fontSize: 11,
        color: '#6b7280',
        marginBottom: 10,
    },
    signOffName: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#111827',
    },
    rtl: {
        fontFamily: 'Cairo',
        textAlign: 'right',
    },
    ltr: {
        fontFamily: 'Inter',
        textAlign: 'left',
    }
});

interface CoverLetterPDFProps {
    data: CVData;
}

export const CoverLetterPDF = ({ data }: CoverLetterPDFProps) => {
    const isRTL = data.contentLanguage === 'ar';
    const directionStyle = isRTL ? styles.rtl : styles.ltr;
    const primaryColor = data.theme || '#2563eb';
    const coverLetter = data.coverLetter;

    if (!coverLetter) return null;

    return (
        <Document>
            <Page size="A4" style={[styles.page, directionStyle]}>
                <PDFHeader
                    personalInfo={data.personalInfo}
                    contentLanguage={data.contentLanguage}
                    primaryColor={primaryColor}
                />

                <View style={[styles.recipientSection, directionStyle]}>
                    <Text style={styles.date}>{new Date().toLocaleDateString(data.contentLanguage === 'ar' ? 'ar-EG' : data.contentLanguage === 'fr' ? 'fr-FR' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</Text>

                    <Text style={styles.recipientText}>{isRTL ? 'إلى مدير التوظيف' : 'To: Hiring Manager'}</Text>
                    {coverLetter.companyName && <Text style={styles.recipientText}>{coverLetter.companyName}</Text>}
                </View>

                <View style={styles.body}>
                    <Text style={directionStyle}>
                        {coverLetter.content}
                    </Text>
                </View>

                <View style={[styles.signOff, directionStyle]}>
                    <Text style={styles.signOffTitle}>{isRTL ? 'مع خالص التقدير،' : 'Sincerely,'}</Text>
                    <Text style={styles.signOffName}>{data.personalInfo.fullName}</Text>
                </View>
            </Page>
        </Document>
    );
};
