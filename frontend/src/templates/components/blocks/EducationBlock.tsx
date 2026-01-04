
import React from 'react';
import { TemplateBlock, Education } from '../../types';

interface EducationBlockProps {
    blockSettings: TemplateBlock;
    data: Education[];
    locale?: string;
}

export const EducationBlock: React.FC<EducationBlockProps> = ({
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
        degreeSize,
        degreeWeight,
        degreeColor,
        institutionSize,
        institutionWeight,
        institutionColor,
        dateSize,
        dateColor,
        descriptionSize,
        descriptionColor
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

    return (
        <div style={containerStyles}>
            {sectionTitle && <h3 style={titleStyles}>{sectionTitle}</h3>}

            {data.map((item, index) => (
                <div key={item.id || index} style={itemContainerStyles}>
                    {/* Degree */}
                    <div style={{ fontSize: degreeSize, fontWeight: degreeWeight, color: degreeColor, marginBottom: '2px' }}>
                        {item.degree}
                    </div>

                    {/* Institution & Date Row */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                        marginBottom: '4px'
                    }}>
                        <span style={{ fontSize: institutionSize, fontWeight: institutionWeight, color: institutionColor }}>
                            {item.institution} {item.location && `• ${item.location}`}
                        </span>
                        <span style={{ fontSize: dateSize, color: dateColor }}>
                            {item.startDate} {item.endDate ? `- ${item.endDate}` : ''}
                        </span>
                    </div>

                    {/* Description / GPA */}
                    {(item.description || item.gpa) && (
                        <div style={{ fontSize: descriptionSize, color: descriptionColor }}>
                            {item.gpa && <div><strong>GPA:</strong> {item.gpa}</div>}
                            {item.description}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
