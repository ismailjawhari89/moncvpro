import React from 'react';
import { BlockRendererProps } from '../../types';
import { cn, getFontSizeClass } from '../../utils';
import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';

export const HeaderBlock: React.FC<BlockRendererProps> = ({ data, template, block }) => {
    const { personalInfo } = data;
    const { primary, text, background } = template.palette;
    const { settings = {} } = block;

    const align = settings.align || 'left';
    const showPhoto = settings.showPhoto !== false;
    const photoShape = settings.photoShape || 'circle'; // circle, square, rounded
    const inverseText = settings.inverseText || false;

    const textColor = inverseText ? 'text-white' : 'text-gray-900';
    const subTextColor = inverseText ? 'text-gray-200' : 'text-gray-600';
    const accentColorStyle = { color: inverseText ? 'white' : primary };

    return (
        <div
            className={cn(
                "flex flex-col gap-4 mb-6",
                align === 'center' && "items-center text-center",
                align === 'right' && "items-end text-right",
                align === 'left' && "items-start text-left"
            )}
            style={{ color: inverseText ? '#fff' : text }}
        >
            <div className={cn("flex gap-6 w-full",
                align === 'center' ? "flex-col items-center" : "flex-row",
                align === 'right' && "flex-row-reverse"
            )}>
                {showPhoto && personalInfo.photoUrl && (
                    <div className={cn(
                        "relative shrink-0 overflow-hidden border-4",
                        photoShape === 'circle' && "rounded-full",
                        photoShape === 'rounded' && "rounded-2xl",
                        photoShape === 'square' && "rounded-none",
                    )} style={{ borderColor: template.palette.background === '#ffffff' ? '#f3f4f6' : 'rgba(255,255,255,0.2)', width: '100px', height: '100px' }}>
                        <img
                            src={personalInfo.photoUrl}
                            alt={personalInfo.fullName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="flex-1 flex flex-col justify-center">
                    <h1 className={cn("font-bold leading-tight", getFontSizeClass(template.metadata.baseFontSize || 14, 2.5))}
                        style={{ color: inverseText ? 'white' : text }}>
                        {personalInfo.fullName || 'Your Name'}
                    </h1>
                    <h2 className={cn("font-medium mt-1", getFontSizeClass(template.metadata.baseFontSize || 14, 1.2))}
                        style={accentColorStyle}>
                        {personalInfo.profession || 'Professional Title'}
                    </h2>

                    {/* Horizontal Contact (if not using separate Contact block) */}
                    {!!settings.showIcons && (
                        <div className={cn("flex flex-wrap gap-3 mt-3 text-sm",
                            align === 'center' ? "justify-center" : (align === 'right' ? "justify-end" : "justify-start")
                        )} style={{ color: subTextColor }}>
                            {/* Simplified inline contact for header */}
                            {personalInfo.email && <span>{personalInfo.email}</span>}
                            {personalInfo.phone && <span>{personalInfo.phone}</span>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
