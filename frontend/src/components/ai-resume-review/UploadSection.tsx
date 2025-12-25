'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle, Loader2, Zap } from 'lucide-react';
import { validateFile } from '@/utils/resume-upload';
import { useTranslations } from 'next-intl';

interface UploadSectionProps {
    onAnalyze: (file: File | null, text: string) => void;
    isAnalyzing: boolean;
}

export default function UploadSection({ onAnalyze, isAnalyzing }: UploadSectionProps) {
    const t = useTranslations('ai-resume-review.uploadSection');
    const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [text, setText] = useState('');
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            setFile(null);
        } else {
            setError(null);
            setFile(file);
        }
    };

    const handleSubmit = () => {
        if (activeTab === 'upload' && !file) {
            setError(t('errors.selectFile'));
            return;
        }
        if (activeTab === 'text' && text.trim().length < 50) {
            setError(t('errors.minCharacters'));
            return;
        }
        onAnalyze(activeTab === 'upload' ? file : null, activeTab === 'text' ? text : '');
    };

    return (
        <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Tabs */}
            <div className="flex border-b border-gray-100">
                <button
                    className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors
                        ${activeTab === 'upload' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                    `}
                    onClick={() => setActiveTab('upload')}
                >
                    <Upload size={18} />
                    {t('tabs.upload')}
                </button>
                <button
                    className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors
                        ${activeTab === 'text' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                    `}
                    onClick={() => setActiveTab('text')}
                >
                    <FileText size={18} />
                    {t('tabs.text')}
                </button>
            </div>

            <div className="p-8">
                {activeTab === 'upload' ? (
                    <div
                        className={`relative border-2 border-dashed rounded-xl p-10 transition-all text-center
                            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
                            ${file ? 'border-green-500 bg-green-50' : ''}
                        `}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept=".pdf,.docx,.doc,.txt"
                            onChange={handleChange}
                        />

                        {file ? (
                            <div className="flex flex-col items-center animate-fade-in">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                                    <CheckCircle size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{file.name}</h3>
                                <p className="text-sm text-gray-500 mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFile(null);
                                    }}
                                    className="text-red-500 text-sm hover:underline flex items-center gap-1"
                                >
                                    <X size={14} /> {t('file.remove')}
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                                    <Upload size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{t('dropzone.title')}</h3>
                                <p className="text-gray-500 mb-6">{t('dropzone.subtitle')}</p>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    {t('dropzone.button')}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="relative">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder={t('text.placeholder')}
                            className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                        />
                        <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                            {t('text.characterCount', { count: text.length })}
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm animate-shake">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleSubmit}
                        disabled={isAnalyzing || (activeTab === 'upload' && !file) || (activeTab === 'text' && !text)}
                        className={`w-full sm:w-auto px-10 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2
                            ${(isAnalyzing || (activeTab === 'upload' && !file) || (activeTab === 'text' && !text)) ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}
                        `}
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                {t('analyzing')}
                            </>
                        ) : (
                            <>
                                <Zap size={20} />
                                {t('analyzeButton')}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
