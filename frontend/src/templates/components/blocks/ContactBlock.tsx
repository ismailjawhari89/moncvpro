
import React from 'react';
import { TemplateBlock, PersonalInfo } from '../../types';

// Simple Icons to avoid external dependencies
const MailIcon = ({ size = 16, style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);

const PhoneIcon = ({ size = 16, style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
);

const MapPinIcon = ({ size = 16, style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

const LinkIcon = ({ size = 16, style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
);

interface ContactBlockProps {
    blockSettings: TemplateBlock;
    data: PersonalInfo;
    locale?: string;
}

export const ContactBlock: React.FC<ContactBlockProps> = ({
    blockSettings,
    data,
    locale = 'en',
}) => {
    const { settings } = blockSettings;
    const isRTL = locale === 'ar';

    if (!blockSettings.enabled) return null;

    const {
        showIcons,
        layout,
        fontSize,
        fontColor,
        spacing,
        sectionTitle,
        sectionTitleSize,
        sectionTitleWeight,
        sectionTitleColor,
        sectionTitleTransform,
        borderBottom,
        marginBottom,
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
        marginBottom: '8px',
        paddingBottom: '4px',
        display: 'block',
    };

    const listStyles: React.CSSProperties = {
        display: 'flex',
        flexDirection: layout === 'horizontal' ? 'row' : 'column',
        flexWrap: 'wrap',
        gap: spacing,
        marginTop: '4px',
        listStyle: 'none',
        padding: 0,
        margin: 0,
    };

    const itemStyles: React.CSSProperties = {
        fontSize,
        color: fontColor,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexDirection: isRTL ? 'row-reverse' : 'row',
    };

    // Only render items that have data
    const contactItems = [
        { type: 'email', value: data.email, icon: MailIcon },
        { type: 'phone', value: data.phone, icon: PhoneIcon },
        { type: 'location', value: data.location, icon: MapPinIcon },
        { type: 'linkedin', value: (data as any).linkedin, icon: LinkIcon, link: true },
        { type: 'github', value: (data as any).github, icon: LinkIcon, link: true },
    ].filter(item => item.value);

    if (contactItems.length === 0) return null;

    return (
        <div style={containerStyles}>
            {sectionTitle && (
                <span style={titleStyles}>{sectionTitle}</span>
            )}

            <ul style={listStyles}>
                {contactItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <li key={index} style={itemStyles}>
                            {showIcons && <Icon size={14} style={{ flexShrink: 0 }} />}
                            <span style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {item.value}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
