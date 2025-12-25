import React from 'react';
import { useCVStore } from '@/stores/useCVStore';
import { Experience } from '@/types/cv';
import { Card, InputField, TextAreaField } from '@/components/ui/FormFields';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ExperienceSectionProps {
    isDark?: boolean;
}

// Sortable Item Component
const SortableExperienceItem = ({ exp, isDark, onRemove, onUpdate }: {
    exp: Experience,
    isDark?: boolean,
    onRemove: (id: string) => void,
    onUpdate: (id: string, field: keyof Experience, value: any) => void
}) => {
    const t = useTranslations('cv-form.experience');
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: exp.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="mb-4">
            <Card isDark={isDark} className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div {...attributes} {...listeners} className="cursor-move text-gray-400 hover:text-gray-600 touch-none">
                            <GripVertical size={20} />
                        </div>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {exp.position || t('position')}
                        </h3>
                    </div>
                    <button
                        onClick={() => onRemove(exp.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label={t('position')}
                        value={exp.position}
                        onChange={(val) => onUpdate(exp.id, 'position', val)}
                        placeholder={t('placeholders.position')}
                        isDark={isDark}
                    />
                    <InputField
                        label={t('company')}
                        value={exp.company}
                        onChange={(val) => onUpdate(exp.id, 'company', val)}
                        placeholder={t('placeholders.company')}
                        isDark={isDark}
                    />
                    <InputField
                        label={t('startDate')}
                        type="month"
                        value={exp.startDate}
                        onChange={(val) => onUpdate(exp.id, 'startDate', val)}
                        isDark={isDark}
                    />
                    <InputField
                        label={t('endDate')}
                        type="month"
                        value={exp.endDate}
                        onChange={(val) => onUpdate(exp.id, 'endDate', val)}
                        isDark={isDark}
                        disabled={exp.current}
                    />
                </div>
                <div className="mt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => onUpdate(exp.id, 'current', e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {t('current')}
                        </span>
                    </label>
                </div>
                <div className="mt-4">
                    <TextAreaField
                        label={t('description')}
                        value={exp.description}
                        onChange={(val) => onUpdate(exp.id, 'description', val)}
                        placeholder={t('placeholders.description')}
                        rows={3}
                        isDark={isDark}
                    />
                </div>
            </Card>
        </div>
    );
};

export default function ExperienceSection({ isDark }: ExperienceSectionProps) {
    const t = useTranslations('cv-form.experience');
    const experiences = useCVStore((state) => state.cvData.experiences);
    const addExperience = useCVStore((state) => state.addExperience);
    const removeExperience = useCVStore((state) => state.removeExperience);
    const updateExperience = useCVStore((state) => state.updateExperience);
    const reorderExperiences = useCVStore((state) => state.reorderExperiences);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = experiences.findIndex((item) => item.id === active.id);
            const newIndex = experiences.findIndex((item) => item.id === over.id);
            reorderExperiences(oldIndex, newIndex);
        }
    };

    const handleAdd = () => {
        addExperience({
            id: `exp-${Date.now()}`,
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            description: '',
            current: false,
        });
    };

    return (
        <div className="space-y-6">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={experiences.map(exp => exp.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {experiences.map((exp) => (
                        <SortableExperienceItem
                            key={exp.id}
                            exp={exp}
                            isDark={isDark}
                            onRemove={removeExperience}
                            onUpdate={updateExperience}
                        />
                    ))}
                </SortableContext>
            </DndContext>

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
