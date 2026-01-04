
import React from 'react';
import { TemplateBlock, Language } from '../../types';

interface LanguagesBlockProps {
    blockSettings: TemplateBlock;
    data: Language[];
    locale?: string;
}

export const LanguagesBlock: React.FC<LanguagesBlockProps> = ({
    blockSettings,
    data,
    locale = 'en',
}) => {
    const { settings } = blockSettings;
    const isRTL = locale === 'ar';

    if (!blockSettings.enabled || !data || data.length === 0) return null;

    const {
        sectionTitle,
        sectionTitleSize,
        sectionTitleWeight,
        sectionTitleColor,
        sectionTitleTransform,
        borderBottom,
        marginBottom,
        itemSpacing,
        languageSize,
        languageWeight,
        languageColor,
        proficiencySize,
        proficiencyColor,
        showProficiencyLevel
    } = settings;

    const containerStyles: React.CSSProperties = {
        marginBottom,
        direction: isRTL ? 'rtl' : 'ltr',
        textAlign: isRTL ? 'right' : 'left',
    };

    const titleStyles: React.CSSProperties = {
        fontSize: sectionTitleSize,
        fontWeight: sectionTitleWeight,
        color: sectionTitleColor,
        textTransform: sectionTitleTransform as any,
        borderBottom,
        marginBottom: '12px',
        paddingBottom: '4px',
        display: 'block',
    };

    return (
        <div style={containerStyles}>
            {sectionTitle && <h3 style={titleStyles}>{sectionTitle}</h3>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: itemSpacing }}>
                {data.map((lang, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: languageSize, fontWeight: languageWeight, color: languageColor }}>
                            {lang.name}
                        </span>
                        {showProficiencyLevel && (
                            <span style={{ fontSize: proficiencySize, color: proficiencyColor }}>
                                {/* ({lang.proficiency}) - Parentheses logic handled by text alignment usually, but explicit here */}
                                {isRTL ? `(${lang.proficiency})` : `(${lang.proficiency})`}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
