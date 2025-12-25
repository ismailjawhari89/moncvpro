'use client';

import React, { useRef, useState } from 'react';
import { useCVStore } from '@/stores/useCVStore';
import { InputField, TextAreaField } from '@/components/ui/FormFields';
import { Camera, Upload, X, User } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PersonalInfoFormProps {
    isDark?: boolean;
    onEnhancePhoto?: () => void;
}

import { compressImage } from '@/utils/imageUtils';

export default function PersonalInfoForm({ isDark, onEnhancePhoto }: PersonalInfoFormProps) {
    const t = useTranslations('cv-form.personal');
    const personalInfo = useCVStore((state) => state.cvData.personalInfo);
    // ...
    const summary = useCVStore((state) => state.cvData.summary);
    const updatePersonalInfo = useCVStore((state) => state.updatePersonalInfo);
    const updateSummary = useCVStore((state) => state.updateSummary);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleChange = (field: keyof typeof personalInfo, value: string) => {
        updatePersonalInfo({ [field]: value });
    };

    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        // ... (existing implementation)
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert(t('alerts.selectImage'));
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert(t('alerts.imageSize'));
            return;
        }

        setIsUploading(true);

        // Convert to base64 for local storage
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const base64 = reader.result as string;
                // Compress!
                const compressed = await compressImage(base64);
                updatePersonalInfo({ photoUrl: compressed });
            } catch (e) {
                console.error('Image compression error', e);
                // Fallback
                updatePersonalInfo({ photoUrl: reader.result as string });
            } finally {
                setIsUploading(false);
            }
        };
        reader.onerror = () => {
            alert(t('alerts.readFailed'));
            setIsUploading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleRemovePhoto = () => {
        updatePersonalInfo({ photoUrl: '' });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-6">
            {/* Photo Upload Section */}
            <div className="flex flex-col items-center pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="relative group">
                    {/* Photo Preview */}
                    <div className={`w-32 h-32 rounded-full overflow-hidden border-4 ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-100'
                        } flex items-center justify-center transition-all`}>
                        {personalInfo.photoUrl ? (
                            <img
                                src={personalInfo.photoUrl}
                                alt={t('photo')}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User size={48} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                        )}

                        {isUploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </div>

                    {/* Upload Button Overlay */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                        <Camera size={24} className="text-white" />
                    </button>

                    {/* Remove Photo Button */}
                    {personalInfo.photoUrl && (
                        <button
                            onClick={handleRemovePhoto}
                            className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                            title={t('remove')}
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Hidden File Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                />

                <div className="flex gap-2 mt-4">
                    {/* Upload Button */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isDark
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                    >
                        <Upload size={18} />
                        {personalInfo.photoUrl ? t('change') : t('upload')}
                    </button>

                    {/* AI Enhance Button */}
                    {personalInfo.photoUrl && onEnhancePhoto && (
                        <button
                            onClick={onEnhancePhoto}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all hover:scale-105"
                        >
                            <User size={18} />
                            {t('enhance')}
                        </button>
                    )}
                </div>

                <p className={`mt-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {t('photoLimit')}
                </p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    label={t('fullName')}
                    value={personalInfo.fullName}
                    onChange={(val) => handleChange('fullName', val)}
                    placeholder={t('placeholders.fullName')}
                    isDark={isDark}
                    required
                />
                <InputField
                    label={t('profession')}
                    value={personalInfo.profession || ''}
                    onChange={(val) => handleChange('profession', val)}
                    placeholder={t('placeholders.profession')}
                    isDark={isDark}
                    required
                />
                <InputField
                    label={t('email')}
                    type="email"
                    value={personalInfo.email}
                    onChange={(val) => handleChange('email', val)}
                    placeholder={t('placeholders.email')}
                    isDark={isDark}
                    required
                />
                <InputField
                    label={t('phone')}
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(val) => handleChange('phone', val)}
                    placeholder={t('placeholders.phone')}
                    isDark={isDark}
                />
                <InputField
                    label={t('location')}
                    value={personalInfo.address}
                    onChange={(val) => handleChange('address', val)}
                    placeholder={t('placeholders.location')}
                    isDark={isDark}
                />
                <InputField
                    label={t('linkedin')}
                    value={personalInfo.linkedin || ''}
                    onChange={(val) => handleChange('linkedin', val)}
                    placeholder={t('placeholders.linkedin')}
                    isDark={isDark}
                />
                <InputField
                    label={t('github')}
                    value={personalInfo.github || ''}
                    onChange={(val) => handleChange('github', val)}
                    placeholder={t('placeholders.github')}
                    isDark={isDark}
                />
            </div>

            <TextAreaField
                label={t('summary')}
                value={summary}
                onChange={(val) => updateSummary(val)}
                placeholder={t('placeholders.summary')}
                rows={5}
                isDark={isDark}
            />
        </div>
    );
}
