import React from 'react';
import { BlockRendererProps } from '../../types';
import { cn } from '../../utils';

export const SkillsBlock: React.FC<BlockRendererProps> = ({ data, template, block }) => {
    const { skills } = data;
    if (!skills || skills.length === 0) return null;

    const { primary, text, muted } = template.palette;
    const { settings = {} } = block;

    // settings.layout = 'tags' | 'list' | 'bars'
    const layout = settings.layout || 'tags';
    const inverse = settings.inverseText || false;

    return (
        <div className="mb-6">
            <h3 className="font-bold uppercase tracking-wider mb-3 border-b pb-1"
                style={{ color: inverse ? 'white' : primary, borderColor: inverse ? 'rgba(255,255,255,0.2)' : muted + '40' }}>
                Skills
            </h3>

            <div className={cn("flex flex-wrap", layout === 'tags' ? "gap-2" : "flex-col gap-2")}>
                {skills.map((skill) => {
                    if (layout === 'tags') {
                        return (
                            <span key={skill.id} className="px-2 py-1 rounded text-xs font-medium"
                                style={{ backgroundColor: inverse ? 'rgba(255,255,255,0.15)' : primary + '15', color: inverse ? 'white' : primary }}>
                                {skill.name}
                            </span>
                        );
                    }
                    if (layout === 'bars') {
                        return (
                            <div key={skill.id} className="w-full">
                                <div className="flex justify-between text-xs mb-1" style={{ color: inverse ? 'white' : text }}>
                                    <span>{skill.name}</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden" style={{ backgroundColor: inverse ? 'rgba(255,255,255,0.2)' : '#e2e8f0' }}>
                                    <div className="h-full rounded-full"
                                        style={{ width: `${(skill.level / 5) * 100}%`, backgroundColor: inverse ? 'white' : primary }} />
                                </div>
                            </div>
                        );
                    }
                    // list
                    return (
                        <div key={skill.id} className="text-sm" style={{ color: inverse ? 'white' : text }}>
                            • {skill.name}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
