import { useCVStore } from '@/stores/useCVStore';
import { Education } from '@/types/cv';
import { Card, InputField } from '@/components/ui/FormFields';
import { Trash2, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface EducationSectionProps {
    isDark?: boolean;
}

export default function EducationSection({ isDark }: EducationSectionProps) {
    const t = useTranslations('cv-form.education');
    const education = useCVStore((state) => state.cvData.education);
    // ...
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
                            {t('title')} #{index + 1}
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
                            label={t('institution')}
                            value={edu.institution}
                            onChange={(val) => updateEducation(edu.id, 'institution', val)}
                            placeholder={t('placeholders.institution')}
                            isDark={isDark}
                        />
                        <InputField
                            label={t('degree')}
                            value={edu.degree}
                            onChange={(val) => updateEducation(edu.id, 'degree', val)}
                            placeholder={t('placeholders.degree')}
                            isDark={isDark}
                        />
                        <InputField
                            label={t('field')}
                            value={edu.field}
                            onChange={(val) => updateEducation(edu.id, 'field', val)}
                            placeholder={t('placeholders.field')}
                            isDark={isDark}
                        />
                        <InputField
                            label={t('startDate')}
                            type="month"
                            value={edu.startDate || ''}
                            onChange={(val) => updateEducation(edu.id, 'startDate', val)}
                            isDark={isDark}
                        />
                        <InputField
                            label={t('endDate')}
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
                {t('add')}
            </button>
        </div>
    );
}
