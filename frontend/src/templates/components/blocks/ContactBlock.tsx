import React from 'react';
import { BlockRendererProps } from '../../types';
import { cn } from '../../utils';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

export const ContactBlock: React.FC<BlockRendererProps> = ({ data, template, block }) => {
    const { personalInfo } = data;
    const { primary, text, muted } = template.palette;
    const { settings = {} } = block;

    // settings.layout = 'list' | 'row'
    // settings.inverseText = boolean

    const isRow = settings.layout === 'row';
    const inverse = settings.inverseText || false;
    const color = inverse ? 'white' : text;
    const iconColor = inverse ? 'rgba(255,255,255,0.8)' : primary;

    const items = [
        { icon: Mail, value: personalInfo.email, label: 'Email' },
        { icon: Phone, value: personalInfo.phone, label: 'Phone' },
        { icon: MapPin, value: personalInfo.address, label: 'Address' },
        { icon: Linkedin, value: personalInfo.linkedin, label: 'LinkedIn' },
        { icon: Github, value: personalInfo.github, label: 'GitHub' },
    ].filter(i => i.value);

    return (
        <div className={cn("mb-6", isRow ? "flex flex-wrap gap-4 text-sm" : "space-y-3")}>
            {!isRow && <h3 className="font-bold uppercase tracking-wider mb-3 border-b pb-1"
                style={{ color: inverse ? 'white' : primary, borderColor: inverse ? 'rgba(255,255,255,0.2)' : muted + '40' }}>
                Contact
            </h3>}

            {items.map((item, idx) => {
                const Icon = item.icon;
                return (
                    <div key={idx} className={cn("flex items-center gap-2", isRow && "mr-4")}>
                        <Icon size={16} style={{ color: iconColor }} />
                        <span style={{ color }} className="text-sm">
                            {item.value}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
