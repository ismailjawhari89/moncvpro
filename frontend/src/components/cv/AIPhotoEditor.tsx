
import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
    Upload,
    ZoomIn,
    ZoomOut,
    RotateCw,
    Wand2,
    Shirt,
    Image as ImageIcon,
    Save,
    X,
    Loader2,
    Sparkles,
    Palette,
    User,
    Check,
    Undo2,
    RotateCcw
} from 'lucide-react';

interface AIPhotoEditorProps {
    currentPhotoUrl?: string;
    onSave: (newPhotoUrl: string) => void;
    onClose: () => void;
}

export default function AIPhotoEditor({ currentPhotoUrl, onSave, onClose }: AIPhotoEditorProps) {
    const t = useTranslations('aiPhotoEditor');

    // Outfit options
    const OUTFIT_OPTIONS = useMemo(() => [
        { id: 'formal-suit', label: t('outfits.formal-suit'), icon: '👔', prompt: 'a professional formal black business suit with white shirt and tie' },
        { id: 'blazer', label: t('outfits.blazer'), icon: '🧥', prompt: 'a smart casual navy blazer with light blue oxford shirt, no tie' },
        { id: 'professor', label: t('outfits.professor'), icon: '👨‍🏫', prompt: 'an academic tweed jacket with elbow patches and turtleneck sweater' },
        { id: 'shirt', label: t('outfits.shirt'), icon: '👕', prompt: 'a crisp white dress shirt with collar, professional look' },
        { id: 'hoodie', label: t('outfits.hoodie'), icon: '🧑‍💻', prompt: 'a comfortable gray tech hoodie, startup style' },
        { id: 'scrubs', label: t('outfits.scrubs'), icon: '👨‍⚕️', prompt: 'professional blue medical scrubs with white coat' },
    ], [t]);

    // Color options for outfit
    const COLOR_OPTIONS = useMemo(() => [
        { id: 'black', label: t('colors.black'), color: '#1f2937' },
        { id: 'navy', label: t('colors.navy'), color: '#1e3a5f' },
        { id: 'charcoal', label: t('colors.charcoal'), color: '#374151' },
        { id: 'burgundy', label: t('colors.burgundy'), color: '#7f1d1d' },
        { id: 'white', label: t('colors.white'), color: '#f9fafb' },
        { id: 'beige', label: t('colors.beige'), color: '#d4b896' },
    ], [t]);

    // Background options
    const BACKGROUND_OPTIONS = useMemo(() => [
        { id: 'white', label: t('backgrounds.white'), prompt: 'clean professional white studio background' },
        { id: 'gradient', label: t('backgrounds.gradient'), prompt: 'soft professional gradient background, light gray to white' },
        { id: 'office', label: t('backgrounds.office'), prompt: 'modern professional office background with bokeh effect' },
        { id: 'blur', label: t('backgrounds.blur'), prompt: 'softly blurred current background for professional look' },
    ], [t]);

    const [photo, setPhoto] = useState<string | null>(currentPhotoUrl || null);
    const [originalPhoto, setOriginalPhoto] = useState<string | null>(currentPhotoUrl || null);
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingAction, setProcessingAction] = useState<string>('');
    const [processingProgress, setProcessingProgress] = useState(0);
    const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

    const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    };

    // Active tab
    const [activeTab, setActiveTab] = useState<'enhance' | 'outfit' | 'background'>('enhance');

    // Selected options
    const [selectedOutfit, setSelectedOutfit] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string>('black');
    const [selectedBackground, setSelectedBackground] = useState<string | null>(null);

    // History for undo
    const [history, setHistory] = useState<string[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setPhoto(base64);
                setOriginalPhoto(base64);
                setHistory([base64]);
            };
            reader.readAsDataURL(file);
        }
    };

    // Real AI Processing with API
    const processWithAI = async (action: string, actionLabel: string, prompt: string) => {
        if (!photo) return;

        setIsProcessing(true);
        setProcessingAction(actionLabel);
        setProcessingProgress(0);

        // Progress simulation (Fast pace for Cloud API ~15-30 seconds)
        const progressInterval = setInterval(() => {
            setProcessingProgress(prev => {
                if (prev >= 95) return 95;
                return prev + 4;
            });
        }, 800);

        try {
            // Call the AI API
            const response = await fetch('/api/ai/photo-edit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: photo,
                    action: action,
                    prompt: prompt,
                    color: selectedColor
                })
            });

            const data = await response.json();

            if (response.ok) {
                if (!data.success) {
                    throw new Error(data.message || 'AI generation failed');
                }

                if (data.imageUrl) {
                    setHistory(prev => [...prev, photo]);

                    // Add timestamp to force browser cache refresh
                    const timestamp = new Date().getTime();
                    const freshUrl = data.imageUrl.includes('?')
                        ? `${data.imageUrl}&t=${timestamp}`
                        : `${data.imageUrl}?t=${timestamp}`;

                    setPhoto(freshUrl);
                    setProcessingProgress(100);
                    showNotification('success', t('notifications.success'));
                } else if (data.demo) {
                    setProcessingProgress(100);
                    showNotification('info', t('notifications.demo', { message: data.message }));
                }
            } else {
                throw new Error(data.error || 'Failed to process');
            }
        } catch (error) {
            showNotification('error', t('notifications.error'));
            await applyDemoEffect(action);
        } finally {
            clearInterval(progressInterval);
            setProcessingProgress(100);
            setTimeout(() => {
                setIsProcessing(false);
                setProcessingAction('');
                setProcessingProgress(0);
            }, 500);
        }
    };

    const applyDemoEffect = async (action: string) => {
        return new Promise<void>(resolve => {
            setTimeout(() => {
                resolve();
            }, 1500);
        });
    };

    // Handle Enhance
    const handleEnhance = () => {
        processWithAI(
            'enhance',
            t('enhanceTab.button'),
            'Enhance this portrait photo with professional lighting, sharpen details, improve skin tone naturally, and add subtle professional color grading'
        );
    };

    // Handle Outfit Change
    const handleOutfitChange = (outfitId: string) => {
        const outfit = OUTFIT_OPTIONS.find(o => o.id === outfitId);
        if (outfit) {
            setSelectedOutfit(outfitId);
            const colorName = COLOR_OPTIONS.find(c => c.id === selectedColor)?.label || 'black';
            processWithAI(
                'outfit',
                outfit.label,
                `Replace the person's current clothing with ${outfit.prompt} in ${colorName} color. Keep the exact same face, pose, lighting, and proportions. The new outfit must look photorealistic and naturally integrated.`
            );
        }
    };

    // Handle Background Change
    const handleBackgroundChange = (bgId: string) => {
        const bg = BACKGROUND_OPTIONS.find(b => b.id === bgId);
        if (bg) {
            setSelectedBackground(bgId);
            processWithAI(
                'background',
                bg.label,
                `Remove the current background and replace with ${bg.prompt}. Keep the person exactly as they are with perfect edge detection.`
            );
        }
    };

    // Undo
    const handleUndo = () => {
        if (history.length > 1) {
            const newHistory = [...history];
            newHistory.pop();
            setPhoto(newHistory[newHistory.length - 1]);
            setHistory(newHistory);
        }
    };

    // Reset
    const handleReset = () => {
        if (originalPhoto) {
            setPhoto(originalPhoto);
            setHistory([originalPhoto]);
            setSelectedOutfit(null);
            setSelectedBackground(null);
        }
    };

    const handleSave = () => {
        if (photo) {
            onSave(photo);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-gray-900 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-[650px]"
            >
                {/* Left: Preview Area */}
                <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden flex items-center justify-center">
                    {photo ? (
                        <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-8">
                            <motion.img
                                src={photo}
                                alt="Preview"
                                style={{
                                    scale: zoom,
                                    rotate: rotation,
                                }}
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            />

                            {/* Circular guide overlay */}
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                <div className="border-2 border-dashed border-blue-400/30 rounded-full w-48 h-48 md:w-64 md:h-64" />
                            </div>

                            {/* Processing Overlay */}
                            {isProcessing && (
                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                                    <div className="relative mb-4">
                                        <Loader2 className="w-16 h-16 text-white animate-spin" />
                                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-yellow-400 animate-pulse" />
                                    </div>
                                    <p className="text-white font-bold text-lg mb-2">{processingAction}</p>
                                    <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                            animate={{ width: `${processingProgress}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                    <p className="text-white/60 text-sm mt-2">{t('processing.title')}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center p-8">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Upload className="text-white" size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('upload.title')}</h3>
                            <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
                                {t('upload.description')}
                            </p>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-lg"
                            >
                                {t('upload.button')}
                            </button>
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />

                    {/* Notification Toast */}
                    <AnimatePresence>
                        {notification && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className={`absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-30 max-w-sm w-full mx-4 ${notification.type === 'success' ? 'bg-green-600 text-white' :
                                    notification.type === 'error' ? 'bg-red-600 text-white' :
                                        'bg-blue-600 text-white'
                                    }`}
                            >
                                {notification.type === 'success' && <Check size={20} />}
                                {notification.type === 'error' && <X size={20} />}
                                {notification.type === 'info' && <Sparkles size={20} />}
                                <p className="text-sm font-medium">{notification.message}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right: Controls Panel */}
                <div className="w-full md:w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <Sparkles size={16} className="text-white" />
                            </div>
                            <div>
                                <h2 className="font-bold text-gray-900 dark:text-white">{t('title')}</h2>
                                <p className="text-xs text-gray-500">{t('subtitle')}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 dark:border-gray-800">
                        {[
                            { id: 'enhance', label: t('tabs.enhance'), icon: Wand2 },
                            { id: 'outfit', label: t('tabs.outfit'), icon: Shirt },
                            { id: 'background', label: t('tabs.background'), icon: ImageIcon }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === tab.id
                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* Enhance Tab */}
                        {activeTab === 'enhance' && (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-500">{t('enhanceTab.description')}</p>

                                {/* Quick Adjustments */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase">{t('adjustments.title')}</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span className="flex items-center gap-1"><ZoomOut size={12} /> {t('adjustments.zoom')}</span>
                                            <span>{Math.round(zoom * 100)}%</span>
                                        </div>
                                        <input
                                            type="range" min="0.5" max="2" step="0.1" value={zoom}
                                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span className="flex items-center gap-1"><RotateCw size={12} /> {t('adjustments.rotate')}</span>
                                            <span>{rotation}°</span>
                                        </div>
                                        <input
                                            type="range" min="-180" max="180" step="90" value={rotation}
                                            onChange={(e) => setRotation(parseInt(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                    </div>
                                </div>

                                {/* AI Enhance Button */}
                                <button
                                    onClick={handleEnhance}
                                    disabled={!photo || isProcessing}
                                    className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold flex items-center justify-center gap-3 hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                >
                                    <Wand2 size={20} />
                                    {t('enhanceTab.button')}
                                </button>

                                <p className="text-xs text-gray-400 text-center">
                                    {t('enhanceTab.tip')}
                                </p>
                            </div>
                        )}

                        {/* Outfit Tab */}
                        {activeTab === 'outfit' && (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-500">{t('outfitTab.description')}</p>

                                {/* Color Selection */}
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
                                        <Palette size={12} /> {t('outfitTab.colorTitle')}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {COLOR_OPTIONS.map((color) => (
                                            <button
                                                key={color.id}
                                                onClick={() => setSelectedColor(color.id)}
                                                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${selectedColor === color.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
                                                    }`}
                                                style={{ backgroundColor: color.color }}
                                                title={color.label}
                                            >
                                                {selectedColor === color.id && (
                                                    <Check size={16} className={color.id === 'white' ? 'text-gray-800' : 'text-white'} />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Outfit Options */}
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase">{t('outfitTab.chooseTitle')}</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {OUTFIT_OPTIONS.map((outfit) => (
                                            <button
                                                key={outfit.id}
                                                onClick={() => handleOutfitChange(outfit.id)}
                                                disabled={!photo || isProcessing}
                                                className={`p-3 rounded-xl border-2 text-left transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed ${selectedOutfit === outfit.id
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                                    }`}
                                            >
                                                <div className="text-2xl mb-1">{outfit.icon}</div>
                                                <p className="text-xs font-semibold text-gray-900 dark:text-white">{outfit.label}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Background Tab */}
                        {activeTab === 'background' && (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-500">{t('backgroundTab.description')}</p>

                                <div className="grid grid-cols-2 gap-3">
                                    {BACKGROUND_OPTIONS.map((bg) => (
                                        <button
                                            key={bg.id}
                                            onClick={() => handleBackgroundChange(bg.id)}
                                            disabled={!photo || isProcessing}
                                            className={`p-4 rounded-xl border-2 transition-all hover:scale-[1.02] disabled:opacity-50 ${selectedBackground === bg.id
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                                }`}
                                        >
                                            <div className={`w-full h-12 rounded-lg mb-2 ${bg.id === 'white' ? 'bg-white border border-gray-200' :
                                                bg.id === 'gradient' ? 'bg-gradient-to-br from-gray-100 to-gray-300' :
                                                    bg.id === 'office' ? 'bg-gradient-to-br from-blue-100 to-gray-200' :
                                                        'bg-gradient-to-br from-blue-200/50 to-purple-200/50 backdrop-blur'
                                                }`} />
                                            <p className="text-xs font-semibold text-center text-gray-900 dark:text-white">{bg.label}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
                        {/* Undo/Reset */}
                        {photo && history.length > 1 && (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleUndo}
                                    className="flex-1 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center justify-center gap-1"
                                >
                                    <Undo2 size={14} /> {t('actions.undo')}
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="flex-1 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center justify-center gap-1"
                                >
                                    <RotateCcw size={14} /> {t('actions.reset')}
                                </button>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                {t('actions.cancel')}
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!photo}
                                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                {t('actions.save')}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
