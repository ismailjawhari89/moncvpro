import { useCVStore } from '@/stores/useCVStore';
import { Language } from '@/types/cv';
import { Card, InputField } from '@/components/ui/FormFields';
import { Trash2, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface LanguagesSectionProps {
    isDark?: boolean;
}

export default function LanguagesSection({ isDark }: LanguagesSectionProps) {
    const t = useTranslations('cv-form.languages');
    const languages = useCVStore((state) => state.cvData.languages);
    // ...
    const addLanguage = useCVStore((state) => state.addLanguage);
    const removeLanguage = useCVStore((state) => state.removeLanguage);
    const updateLanguage = useCVStore((state) => state.updateLanguage);

    const handleAdd = () => {
        addLanguage({
            id: `lang-${Date.now()}`,
            name: '',
            proficiency: 'conversational',
        });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {languages.map((lang) => (
                    <Card key={lang.id} isDark={isDark} className="p-4">
                        <div className="flex items-center gap-3">
                            <InputField
                                label=""
                                value={lang.name}
                                onChange={(val) => updateLanguage(lang.id, 'name', val)}
                                placeholder={t('name')}
                                isDark={isDark}
                                className="flex-1"
                            />
                            <select
                                value={lang.proficiency}
                                onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value as any)}
                                className={`px-3 py-2 rounded-lg border ${isDark
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                    } focus:ring-2 focus:ring-blue-500 outline-none`}
                            >
                                <option value="basic">{t('levels.basic')}</option>
                                <option value="conversational">{t('levels.conversational')}</option>
                                <option value="fluent">{t('levels.fluent')}</option>
                                <option value="native">{t('levels.native')}</option>
                            </select>
                            <button
                                onClick={() => removeLanguage(lang.id)}
                                className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
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
