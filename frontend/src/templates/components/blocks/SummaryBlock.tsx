
import React from 'react';
import { TemplateBlock, PersonalInfo } from '../../types';

interface SummaryBlockProps {
    blockSettings: TemplateBlock;
    data: PersonalInfo;
    locale?: string;
}

export const SummaryBlock: React.FC<SummaryBlockProps> = ({
    blockSettings,
    data,
    locale = 'en',
}) => {
    const { settings } = blockSettings;
    const isRTL = locale === 'ar';

    if (!blockSettings.enabled || !data.summary) return null;

    const {
        sectionTitle,
        sectionTitleSize,
        sectionTitleWeight,
        sectionTitleColor,
        sectionTitleTransform,
        borderBottom,
        marginBottom,
        fontSize,
        fontColor,
        lineHeight,
        textAlign
    } = settings;

    const containerStyles: React.CSSProperties = {
        marginBottom,
        direction: isRTL ? 'rtl' : 'ltr',
        textAlign: isRTL ? 'right' : (textAlign || 'left'),
    };

    const titleStyles: React.CSSProperties = {
        fontSize: sectionTitleSize,
        fontWeight: sectionTitleWeight,
        color: sectionTitleColor,
        textTransform: sectionTitleTransform as any,
        borderBottom,
        marginBottom: '8px',
        paddingBottom: '4px',
        display: 'block',
    };

    const textStyles: React.CSSProperties = {
        fontSize,
        color: fontColor,
        lineHeight,
        whiteSpace: 'pre-wrap', // Preserve line breaks
        margin: 0,
    };

    return (
        <div style={containerStyles}>
            {sectionTitle && (
                <h3 style={titleStyles}>{sectionTitle}</h3>
            )}
            <p style={textStyles}>{data.summary}</p>
        </div>
    );
};
