import React from 'react';
import { BlockRendererProps } from '../../types';

export const EducationBlock: React.FC<BlockRendererProps> = ({ data, template, block }) => {
    const { education } = data;
    if (!education || education.length === 0) return null;

    const { primary, text, muted } = template.palette;

    return (
        <div className="mb-6">
            <h3 className="font-bold uppercase tracking-wider mb-4 border-b pb-1"
                style={{ color: primary, borderColor: muted + '40' }}>
                Education
            </h3>
            <div className="space-y-4">
                {education.map((edu) => (
                    <div key={edu.id}>
                        <div className="flex justify-between items-baseline">
                            <h4 className="font-bold text-sm" style={{ color: text }}>
                                {edu.degree} in {edu.field}
                            </h4>
                            <span className="text-xs font-medium" style={{ color: muted }}>
                                {edu.graduationYear || edu.endDate}
                            </span>
                        </div>
                        <div className="text-sm" style={{ color: primary }}>
                            {edu.institution}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
