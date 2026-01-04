/**
 * TemplateRenderer Component
 * Renders a CV using a template definition
 */

import React from 'react';
import { TemplateDefinition, CVData } from '../types';
import { blockComponents } from './blocks';

interface TemplateRendererProps {
    template: TemplateDefinition;
    data: CVData;
    atsMode?: boolean;
    locale?: string;
    customizations?: Partial<TemplateDefinition['design']>;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
    template,
    data,
    atsMode = false,
    locale = 'en',
    customizations,
}) => {
    const isRTL = locale === 'ar';

    // Merge customizations with template design
    const design = customizations
        ? { ...template.design, ...customizations }
        : template.design;

    // Apply ATS optimizations
    const activeStructure = React.useMemo(() => {
        if (!atsMode) return template;

        // Clone template to avoid mutation
        const atsTemplate = JSON.parse(JSON.stringify(template));

        // ATS overrides:
        // 1. Disable photo
        if (atsTemplate.blocks.header && atsTemplate.blocks.header.settings) {
            atsTemplate.blocks.header.settings.showPhoto = false;
        }

        return atsTemplate;
    }, [template, atsMode]);

    // Use the active structure (either original or ATS-optimized)
    const renderTemplate = activeStructure;

    // Container styles based on template design
    const containerStyles: React.CSSProperties = {
        fontFamily: isRTL && renderTemplate.rtl?.settings.fontFamily
            ? renderTemplate.rtl.settings.fontFamily
            : design.typography.fontFamily,
        backgroundColor: design.colors.background,
        color: design.colors.text,
        padding: design.spacing.documentMargin,
        direction: isRTL ? 'rtl' : 'ltr',
        maxWidth: '210mm', // A4 width
        margin: '0 auto',
    };

    // Two-column layout styles
    const layoutStyles: React.CSSProperties = renderTemplate.layout.type === 'two-column'
        ? {
            display: 'grid',
            gridTemplateColumns: `${renderTemplate.layout.columns.left?.width} ${renderTemplate.layout.columns.right?.width}`,
            gap: design.spacing.columnGap,
            marginTop: design.spacing.sectionGap,
        }
        : {};

    // Render a block component
    const renderBlock = (blockName: string, blockData: any) => {
        const block = renderTemplate.blocks[blockName];
        if (!block || !block.enabled) return null;

        const BlockComponent = blockComponents[block.type as keyof typeof blockComponents];
        if (!BlockComponent) {
            console.warn(`Block component not found: ${block.type}`);
            return null;
        }

        return (
            <BlockComponent
                key={blockName}
                blockSettings={block}
                data={blockData}
                locale={locale}
            />
        );
    };

    // Render sections for a column
    const renderColumn = (sections: string[]) => {
        return sections.map((section) => {
            switch (section) {
                case 'contact':
                    return renderBlock('contact', data.personalInfo);
                case 'summary':
                    return renderBlock('summary', data.personalInfo);
                case 'experience':
                    return renderBlock('experience', data.experience);
                case 'education':
                    return renderBlock('education', data.education);
                case 'skills':
                    return renderBlock('skills', data.skills);
                case 'languages':
                    return renderBlock('languages', data.languages);
                default:
                    return null;
            }
        });
    };

    return (
        <div style={containerStyles} className="cv-template">
            {/* Header */}
            {renderBlock('header', data.personalInfo)}

            {/* Two-column layout */}
            {renderTemplate.layout.type === 'two-column' ? (
                <div style={layoutStyles}>
                    {/* Left Column */}
                    <div className="cv-column-left">
                        {renderTemplate.layout.columns.left &&
                            renderColumn(renderTemplate.layout.columns.left.sections)}
                    </div>

                    {/* Right Column */}
                    <div className="cv-column-right">
                        {renderTemplate.layout.columns.right &&
                            renderColumn(renderTemplate.layout.columns.right.sections)}
                    </div>
                </div>
            ) : (
                /* Single column layout */
                <div>
                    {renderTemplate.layout.columns.center &&
                        renderColumn(renderTemplate.layout.columns.center.sections)}
                </div>
            )}

            {/* Footer */}
            {renderBlock('footer', {})}
        </div>
    );
};

export default TemplateRenderer;
