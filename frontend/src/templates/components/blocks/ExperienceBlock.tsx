import React from 'react';
import { BlockRendererProps } from '../../types';
import { cn } from '../../utils';

export const ExperienceBlock: React.FC<BlockRendererProps> = ({ data, template, block }) => {
    const { experiences } = data;
    if (!experiences || experiences.length === 0) return null;

    const { primary, text, muted } = template.palette;
    const { settings = {} } = block;

    return (
        <div className="mb-6">
            <h3 className="font-bold uppercase tracking-wider mb-4 border-b pb-1"
                style={{ color: primary, borderColor: muted + '40' }}>
                Experience
            </h3>
            <div className="space-y-4">
                {experiences.map((exp) => (
                    <div key={exp.id}>
                        <div className="flex justify-between items-baseline mb-1">
                            <h4 className="font-bold text-base" style={{ color: text }}>
                                {exp.position}
                            </h4>
                            <span className="text-xs font-medium whitespace-nowrap" style={{ color: muted }}>
                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </span>
                        </div>
                        <div className="text-sm font-medium mb-2" style={{ color: primary }}>
                            {exp.company}
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: text }}>
                            {exp.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
