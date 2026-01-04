
import React from 'react';
import { TemplateBlock, Skill } from '../../types';

interface SkillsBlockProps {
    blockSettings: TemplateBlock;
    data: Skill[];
    locale?: string;
}

export const SkillsBlock: React.FC<SkillsBlockProps> = ({
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
        groupByCategory,
        categorySpacing,
        categoryTitleSize,
        categoryTitleWeight,
        categoryTitleColor,
        skillSize,
        skillColor,
        skillSpacing
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

    // Group skills by category if enabled
    const groupedSkills = React.useMemo(() => {
        if (!groupByCategory) {
            return { 'All': data };
        }
        return data.reduce((acc, skill) => {
            const cat = skill.category || 'Other';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(skill);
            return acc;
        }, {} as Record<string, Skill[]>);
    }, [data, groupByCategory]);

    return (
        <div style={containerStyles}>
            {sectionTitle && <h3 style={titleStyles}>{sectionTitle}</h3>}

            {Object.entries(groupedSkills).map(([category, skills], index) => (
                <div key={category + index} style={{ marginBottom: categorySpacing }}>
                    {groupByCategory && category !== 'All' && (
                        <div style={{
                            fontSize: categoryTitleSize,
                            fontWeight: categoryTitleWeight,
                            color: categoryTitleColor,
                            marginBottom: '4px',
                            textTransform: 'uppercase'
                        }}>
                            {category}
                        </div>
                    )}

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: skillSpacing }}>
                        {skills.map((skill, i) => (
                            <span key={i} style={{ fontSize: skillSize, color: skillColor }}>
                                {skill.name}{i < skills.length - 1 ? ',' : ''}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
