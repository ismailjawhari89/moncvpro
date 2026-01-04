/**
 * HeaderBlock Component
 * Renders the CV header with photo, name, job title, and summary
 */

import React from 'react';
import Image from 'next/image';
import { TemplateBlock, PersonalInfo } from '../../types';

interface HeaderBlockProps {
    blockSettings: TemplateBlock;
    data: PersonalInfo;
    locale?: string;
}

export const HeaderBlock: React.FC<HeaderBlockProps> = ({
    blockSettings,
    data,
    locale = 'en',
}) => {
    const { settings } = blockSettings;
    const isRTL = locale === 'ar';

    if (!blockSettings.enabled) return null;

    const {
        showPhoto,
        photoShape,
        photoSize,
        photoBorder,
        layout,
        alignment,
        backgroundColor,
        textColor,
        nameSize,
        nameWeight,
        nameColor,
        jobTitleSize,
        jobTitleWeight,
        jobTitleColor,
        summaryMaxLines,
        summaryColor,
        summarySize,
        spacing,
    } = settings;

    const photoStyles: React.CSSProperties = {
        width: photoSize,
        height: photoSize,
        borderRadius: photoShape === 'circle' ? '50%' : photoShape === 'rounded' ? '8px' : '0',
        border: photoBorder,
        objectFit: 'cover',
        marginRight: isRTL ? '0' : spacing,
        marginLeft: isRTL ? spacing : '0',
    };

    const containerStyles: React.CSSProperties = {
        display: 'flex',
        flexDirection: layout === 'horizontal' ? 'row' : 'column',
        alignItems: alignment === 'center' ? 'center' : alignment === 'right' ? 'flex-end' : 'flex-start',
        backgroundColor,
        color: textColor,
        gap: spacing,
        marginBottom: spacing,
        direction: isRTL ? 'rtl' : 'ltr',
    };

    const nameStyles: React.CSSProperties = {
        fontSize: nameSize,
        fontWeight: nameWeight,
        color: nameColor,
        margin: '0',
        lineHeight: '1.2',
    };

    const jobTitleStyles: React.CSSProperties = {
        fontSize: jobTitleSize,
        fontWeight: jobTitleWeight,
        color: jobTitleColor,
        margin: '4px 0 0 0',
    };

    const summaryStyles: React.CSSProperties = {
        fontSize: summarySize,
        color: summaryColor,
        margin: '8px 0 0 0',
        lineHeight: '1.6',
        display: '-webkit-box',
        WebkitLineClamp: summaryMaxLines,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };

    return (
        <header style={containerStyles}>
            {showPhoto && data.photoUrl && (
                <div style={photoStyles} className="overflow-hidden relative">
                    <Image
                        src={data.photoUrl}
                        alt={data.fullName}
                        fill
                        className="object-cover"
                        sizes={`${photoSize}`}
                    />
                </div>
            )}

            <div style={{ flex: 1 }}>
                <h1 style={nameStyles}>{data.fullName}</h1>

                {data.jobTitle && (
                    <h2 style={jobTitleStyles}>{data.jobTitle}</h2>
                )}

                {data.summary && (
                    <p style={summaryStyles}>{data.summary}</p>
                )}
            </div>
        </header>
    );
};

export default HeaderBlock;
