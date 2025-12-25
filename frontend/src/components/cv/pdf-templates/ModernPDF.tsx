
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import type { CVData } from '@/types/cv';
import { PDFHeader } from './shared/PDFHeader';
import { registerPDFFonts } from './shared/pdf-fonts';

registerPDFFonts();

const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#ffffff',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 2,
        paddingBottom: 10,
    },
    name: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 6,
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        fontSize: 10,
        color: '#4b5563',
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        paddingBottom: 4,
    },
    summary: {
        fontSize: 10.5,
        lineHeight: 1.6,
        color: '#374151',
    },
    experienceItem: {
        marginBottom: 12,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 2,
    },
    itemTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#111827',
    },
    itemDate: {
        fontSize: 9,
        color: '#6b7280',
    },
    itemSubtitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#4b5563',
        marginBottom: 4,
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 3,
        paddingLeft: 4,
    },
    bulletIcon: {
        width: 12,
        fontSize: 10,
        color: '#9ca3af',
    },
    bulletText: {
        flex: 1,
        fontSize: 10,
        lineHeight: 1.4,
        color: '#4b5563',
    },
    skillGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    skillBadge: {
        fontSize: 9,
        padding: '3 8',
        borderRadius: 4,
        backgroundColor: '#f3f4f6',
        color: '#1e40af',
        borderWidth: 0.5,
        borderColor: '#d1d5db',
    },
    rtl: {
        fontFamily: 'Cairo',
        textAlign: 'right',
    },
    ltr: {
        fontFamily: 'Inter',
        textAlign: 'left',
    },
    rtlRow: {
        flexDirection: 'row-reverse',
    }
});

interface ModernPDFProps {
    data: CVData;
}

export const ModernPDF = ({ data }: ModernPDFProps) => {
    const isRTL = data.contentLanguage === 'ar';
    const directionStyle = isRTL ? styles.rtl : styles.ltr;
    const rowDirectionStyle = isRTL ? styles.rtlRow : {};
    const primaryColor = data.theme || '#2563eb';

    return (
        <Document>
            <Page size="A4" style={[styles.page, directionStyle]}>
                <PDFHeader
                    personalInfo={data.personalInfo}
                    contentLanguage={data.contentLanguage}
                    primaryColor={primaryColor}
                />

                {/* Summary */}
                {data.summary && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, directionStyle, { color: primaryColor }]}>
                            {isRTL ? 'النبذة المهنية' : 'Professional Summary'}
                        </Text>
                        <Text style={[styles.summary, directionStyle]}>{data.summary}</Text>
                    </View>
                )}

                {/* Experience */}
                {data.experiences.length > 0 && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, directionStyle, { color: primaryColor }]}>
                            {isRTL ? 'الخبرات المهنية' : 'Work Experience'}
                        </Text>
                        {data.experiences.map((exp) => (
                            <View key={exp.id} style={styles.experienceItem}>
                                <View style={[styles.itemHeader, rowDirectionStyle]}>
                                    <Text style={styles.itemTitle}>{exp.position}</Text>
                                    <Text style={styles.itemDate}>
                                        {exp.startDate} - {exp.current ? (isRTL ? 'الحالي' : 'Present') : exp.endDate}
                                    </Text>
                                </View>
                                <Text style={[styles.itemSubtitle, directionStyle]}>{exp.company}</Text>
                                {exp.achievements?.map((ach, i) => (
                                    <View key={i} style={[styles.bulletPoint, rowDirectionStyle]}>
                                        <Text style={[styles.bulletIcon, directionStyle]}>•</Text>
                                        <Text style={[styles.bulletText, directionStyle]}>{ach}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {/* Skills */}
                {data.skills.length > 0 && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, directionStyle, { color: primaryColor }]}>
                            {isRTL ? 'المهارات' : 'Skills'}
                        </Text>
                        <View style={[styles.skillGrid, rowDirectionStyle]}>
                            {data.skills.map((skill) => (
                                <Text key={skill.id} style={styles.skillBadge}>
                                    {skill.name}
                                </Text>
                            ))}
                        </View>
                    </View>
                )}
            </Page>
        </Document>
    );
};
