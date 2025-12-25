import { useCVStore } from '@/stores/useCVStore';
import { Skill } from '@/types/cv';
import { Card, InputField } from '@/components/ui/FormFields';
import { Trash2, Plus } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';
import { useTranslations } from 'next-intl';

interface SkillsManagerProps {
    isDark?: boolean;
}

export default function SkillsManager({ isDark }: SkillsManagerProps) {
    const t = useTranslations('cv-form.skills');
    const skills = useCVStore((state) => state.cvData.skills);
    // ...
    const addSkill = useCVStore((state) => state.addSkill);
    const removeSkill = useCVStore((state) => state.removeSkill);
    const updateSkill = useCVStore((state) => state.updateSkill);

    const handleAdd = () => {
        const newSkill: Skill = {
            id: `skill-${Date.now()}`,
            name: '',
            level: 3,
            category: 'technical',
        };
        addSkill(newSkill);
    };

    const handleRemove = (id: string) => {
        removeSkill(id);
    };

    const handleUpdate = (id: string, field: keyof Skill, value: any) => {
        updateSkill(id, field, value);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill) => (
                    <Card key={skill.id} isDark={isDark} className="p-4">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <InputField
                                    label=""
                                    value={skill.name}
                                    onChange={(val) => handleUpdate(skill.id, 'name', val)}
                                    placeholder={t('placeholders.name')}
                                    isDark={isDark}
                                    className="flex-1"
                                />
                                <button
                                    onClick={() => handleRemove(skill.id)}
                                    className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg mt-auto"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            {/* Level Slider */}
                            <div className="px-1">
                                <div className="flex justify-between text-xs mb-2 text-gray-500">
                                    <span>{t('level')}: {skill.level}/5</span>
                                </div>
                                <Slider.Root
                                    className="relative flex items-center select-none touch-none w-full h-5"
                                    value={[skill.level]}
                                    max={5}
                                    min={1}
                                    step={1}
                                    onValueChange={(value) => handleUpdate(skill.id, 'level', value[0])}
                                >
                                    <Slider.Track className="bg-gray-200 dark:bg-gray-700 relative grow rounded-full h-[3px]">
                                        <Slider.Range className="absolute bg-blue-600 rounded-full h-full" />
                                    </Slider.Track>
                                    <Slider.Thumb
                                        className="block w-5 h-5 bg-white border-2 border-blue-600 shadow-[0_2px_10px] shadow-black/10 rounded-[10px] hover:bg-blue-50 focus:outline-none focus:shadow-[0_0_0_4px] focus:shadow-blue-600/20 cursor-pointer"
                                        aria-label={t('level')}
                                    />
                                </Slider.Root>
                            </div>
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
