import React from 'react';
import { useCVStore, Education } from '@/stores/useCVStore';
import { Card, InputField } from '@/components/ui/FormFields';
import { Trash2, Plus } from 'lucide-react';

interface EducationSectionProps {
    isDark?: boolean;
}

export default function EducationSection({ isDark }: EducationSectionProps) {
    const education = useCVStore((state) => state.cvData.education);
    const addEducation = useCVStore((state) => state.addEducation);
    const removeEducation = useCVStore((state) => state.removeEducation);
    const updateEducation = useCVStore((state) => state.updateEducation);

    const handleAdd = () => {
        addEducation({
            id: `edu-${Date.now()}`,
            institution: '',
            degree: '',
            field: '',
            startDate: '',
            endDate: '',
            current: false,
            graduationYear: '', // Added to match interface
        });
    };

    return (
        <div className="space-y-6">
            {education.map((edu, index) => (
                <Card key={edu.id} isDark={isDark} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Education #{index + 1}
                        </h3>
                        <button
                            onClick={() => removeEducation(edu.id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            label="Institution"
                            value={edu.institution}
                            onChange={(val) => updateEducation(edu.id, 'institution', val)}
                            placeholder="University Name"
                            isDark={isDark}
                        />
                        <InputField
                            label="Degree"
                            value={edu.degree}
                            onChange={(val) => updateEducation(edu.id, 'degree', val)}
                            placeholder="Bachelor's Degree"
                            isDark={isDark}
                        />
                        <InputField
                            label="Field of Study"
                            value={edu.field}
                            onChange={(val) => updateEducation(edu.id, 'field', val)}
                            placeholder="Computer Science"
                            isDark={isDark}
                        />
                        <InputField
                            label="Start Date"
                            type="month"
                            value={edu.startDate || ''}
                            onChange={(val) => updateEducation(edu.id, 'startDate', val)}
                            isDark={isDark}
                        />
                        <InputField
                            label="End Date"
                            type="month"
                            value={edu.endDate || ''}
                            onChange={(val) => updateEducation(edu.id, 'endDate', val)}
                            isDark={isDark}
                        />
                    </div>
                </Card>
            ))}
            <button
                onClick={handleAdd}
                className={`w-full py-3 border-2 border-dashed rounded-xl transition-all ${isDark
                    ? 'border-gray-600 hover:border-blue-500 text-gray-400 hover:text-blue-400'
                    : 'border-gray-300 hover:border-blue-500 text-gray-600 hover:text-blue-600'
                    } flex items-center justify-center gap-2 font-medium`}
            >
                <Plus size={20} />
                Add Education
            </button>
        </div>
    );
}
