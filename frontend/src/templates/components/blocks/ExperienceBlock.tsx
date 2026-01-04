
import React from 'react';
import { TemplateBlock, Experience } from '../../types';

interface ExperienceBlockProps {
    blockSettings: TemplateBlock;
    data: Experience[];
    locale?: string;
}

export const ExperienceBlock: React.FC<ExperienceBlockProps> = ({
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
        jobTitleSize,
        jobTitleWeight,
        jobTitleColor,
        companySize,
        companyWeight,
        companyColor,
        dateSize,
        dateColor,
        descriptionSize,
        descriptionColor,
        descriptionLineHeight,
        showBullets,
        bulletColor
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

    const itemContainerStyles: React.CSSProperties = {
        marginBottom: itemSpacing,
    };

    // Header can be reused flex layout
    const headerStyles: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: '4px',
        flexDirection: isRTL ? 'row-reverse' : 'row',
    };

    return (
        <div style={containerStyles}>
            {sectionTitle && <h3 style={titleStyles}>{sectionTitle}</h3>}

            {data.map((item, index) => (
                <div key={item.id || index} style={itemContainerStyles}>
                    {/* Top Row: Job Title and Date */}
                    <div style={headerStyles}>
                        <span style={{ fontSize: jobTitleSize, fontWeight: jobTitleWeight, color: jobTitleColor }}>
                            {item.jobTitle}
                        </span>
                        <span style={{ fontSize: dateSize, color: dateColor, whiteSpace: 'nowrap' }}>
                            {item.startDate} {item.endDate ? ` - ${item.endDate}` : (item.current ? (isRTL ? ' - الحاضر' : ' - Present') : '')}
                        </span>
                    </div>

                    {/* Company Name */}
                    <div style={{
                        fontSize: companySize,
                        fontWeight: companyWeight,
                        color: companyColor,
                        marginBottom: '6px'
                    }}>
                        {item.company} {item.location && `• ${item.location}`}
                    </div>

                    {/* Description */}
                    {item.description && (
                        <div style={{
                            fontSize: descriptionSize,
                            color: descriptionColor,
                            lineHeight: descriptionLineHeight,
                            whiteSpace: 'pre-wrap'
                        }}>
                            {/* Parse bullets manually if needed, or just display text */}
                            {item.description.split('\n').map((line, i) => (
                                <div key={i} style={{ display: 'flex', gap: '6px' }}>
                                    {showBullets && line.trim().startsWith('•') ? null : (showBullets && <span style={{ color: bulletColor }}>•</span>)}
                                    <span>{line.replace(/^[•-]\s*/, '')}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
