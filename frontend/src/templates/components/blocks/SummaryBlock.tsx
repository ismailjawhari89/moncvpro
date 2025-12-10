import React from 'react';
import { BlockRendererProps } from '../../types';
import { cn } from '../../utils';

export const SummaryBlock: React.FC<BlockRendererProps> = ({ data, template, block }) => {
    const { summary } = data;
    if (!summary) return null;

    const { primary, text } = template.palette;
    const { settings = {} } = block;
    const inverseText = settings.inverseText || false;

    return (
        <div className="mb-6">
            {settings.showLabel !== false && (
                <h3 className="font-bold uppercase tracking-wider mb-2 border-b pb-1"
                    style={{
                        color: inverseText ? 'white' : primary,
                        borderColor: inverseText ? 'rgba(255,255,255,0.2)' : template.palette.muted
                    }}>
                    Profile
                </h3>
            )}
            <p className={cn("text-sm leading-relaxed", !!settings.largeText && "text-base")}
                style={{ color: inverseText ? 'rgba(255,255,255,0.9)' : text }}>
                {summary}
            </p>
        </div>
    );
};
