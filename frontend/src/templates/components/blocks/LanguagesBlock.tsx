import React from 'react';
import { BlockRendererProps } from '../../types';

export const LanguagesBlock: React.FC<BlockRendererProps> = ({ data, template, block }) => {
    const { languages } = data;
    if (!languages || languages.length === 0) return null;

    const { primary, text, muted } = template.palette;
    const { settings = {} } = block;
    const inverse = settings.inverseText || false;

    return (
        <div className="mb-6">
            <h3 className="font-bold uppercase tracking-wider mb-3 border-b pb-1"
                style={{ color: inverse ? 'white' : primary, borderColor: inverse ? 'rgba(255,255,255,0.2)' : muted + '40' }}>
                Languages
            </h3>
            <div className="space-y-2">
                {languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between items-center">
                        <span className="text-sm font-medium" style={{ color: inverse ? 'white' : text }}>{lang.name}</span>
                        <span className="text-xs" style={{ color: inverse ? 'rgba(255,255,255,0.7)' : muted }}>{lang.proficiency}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
