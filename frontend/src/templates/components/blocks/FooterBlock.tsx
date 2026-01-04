
import React from 'react';
import { TemplateBlock } from '../../types';

interface FooterBlockProps {
    blockSettings: TemplateBlock;
    data: any; // Could be certificates or metadata
    locale?: string;
}

export const FooterBlock: React.FC<FooterBlockProps> = ({
    blockSettings,
    data, // unused for now unless certificates are passed
    locale = 'en',
}) => {
    const { settings } = blockSettings;
    const isRTL = locale === 'ar';

    if (!blockSettings.enabled) return null;

    const {
        showSeparator,
        separatorColor,
        separatorHeight,
        marginTop,
        fontSize,
        fontColor,
        textAlign
    } = settings;

    const containerStyles: React.CSSProperties = {
        marginTop,
        direction: isRTL ? 'rtl' : 'ltr',
        textAlign: textAlign as any || 'center',
        paddingTop: '8px',
        borderTop: showSeparator ? `${separatorHeight} solid ${separatorColor}` : 'none'
    };

    const textStyles: React.CSSProperties = {
        fontSize,
        color: fontColor,
        margin: 0,
    };

    return (
        <footer style={containerStyles}>
            <p style={textStyles}>
                {/* Placeholder content - can be dynamic based on 'data' later */}
                {/* e.g. "References available upon request" or page numbers if handled by PDF engine */}
            </p>
        </footer>
    );
};
