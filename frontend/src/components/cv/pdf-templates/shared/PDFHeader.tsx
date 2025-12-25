
import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import type { PersonalInfo } from '@/types/cv';

const headerStyles = StyleSheet.create({
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
    rtl: {
        textAlign: 'right',
        fontFamily: 'Cairo',
    },
    ltr: {
        textAlign: 'left',
        fontFamily: 'Inter',
    },
    rtlRow: {
        flexDirection: 'row-reverse',
    }
});

interface PDFHeaderProps {
    personalInfo: PersonalInfo;
    contentLanguage: 'en' | 'ar' | 'fr';
    primaryColor: string;
}

export const PDFHeader = ({ personalInfo, contentLanguage, primaryColor }: PDFHeaderProps) => {
    const isRTL = contentLanguage === 'ar';
    const directionStyle = isRTL ? headerStyles.rtl : headerStyles.ltr;
    const rowDirectionStyle = isRTL ? headerStyles.rtlRow : {};

    return (
        <View style={[headerStyles.header, { borderBottomColor: primaryColor }]}>
            <Text style={[headerStyles.name, directionStyle]}>{personalInfo.fullName}</Text>
            <View style={[headerStyles.contactRow, rowDirectionStyle]}>
                {personalInfo.email && <Text style={directionStyle}>✉️ {personalInfo.email}</Text>}
                {personalInfo.phone && <Text style={directionStyle}>📱 {personalInfo.phone}</Text>}
                {personalInfo.address && <Text style={directionStyle}>📍 {personalInfo.address}</Text>}
            </View>
        </View>
    );
};
