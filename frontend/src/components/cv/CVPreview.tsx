'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCVStore } from '@/stores/useCVStore';
import { TemplateRenderer } from '@/templates/components/TemplateRenderer';
import { ThemeSelector } from './ThemeSelector';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Eye,
    Printer,
    Smartphone,
    Monitor,
    Tablet,
    ZoomIn,
    ZoomOut,
    Maximize2,
    Minimize2,
    Check,
    X,
    Globe,
    RefreshCw
} from 'lucide-react';

// ========== TYPES ==========
interface CVPreviewProps {
    data?: any;
    selectedTemplate?: string;
    onTemplateChange?: (templateId: string) => void;
}

type ViewMode = 'desktop' | 'tablet' | 'mobile';
type PreviewMode = 'normal' | 'print' | 'fullscreen';

// View mode configurations
const viewModeConfig: Record<ViewMode, { width: number; label: string; icon: React.ComponentType<any> }> = {
    desktop: { width: 794, label: 'Desktop', icon: Monitor },
    tablet: { width: 600, label: 'Tablet', icon: Tablet },
    mobile: { width: 375, label: 'Mobile', icon: Smartphone }
};

// Zoom levels
const ZOOM_LEVELS = [0.25, 0.35, 0.42, 0.5, 0.65, 0.75, 0.9, 1.0, 1.25, 1.5];
const DEFAULT_ZOOM_INDEX = 2; // 0.42

// ========== MAIN COMPONENT ==========
export default function CVPreview({ selectedTemplate }: CVPreviewProps) {
    // Get locale from URL params
    const params = useParams();
    const uiLocale = (params?.locale as string) || 'en';
    const isUI_RTL = uiLocale === 'ar';

    // Get the full cvData object from store
    const cvData = useCVStore(state => state.cvData);
    const setContentLanguage = useCVStore(state => state.setContentLanguage);

    // Determine content language (defaults to UI locale if not set, or 'en')
    const contentLocale = cvData.contentLanguage || uiLocale;
    const isContent_RTL = contentLocale === 'ar';

    // Local state
    const [viewMode, setViewMode] = useState<ViewMode>('desktop');
    const [previewMode, setPreviewMode] = useState<PreviewMode>('normal');
    const [zoomIndex, setZoomIndex] = useState(DEFAULT_ZOOM_INDEX);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [showPrintOverlay, setShowPrintOverlay] = useState(false);

    const previewRef = useRef<HTMLDivElement>(null);
    const printFrameRef = useRef<HTMLIFrameElement>(null);

    // Determine template to show
    const activeTemplate = selectedTemplate || cvData.template || 'modern';
    const scaleFactor = ZOOM_LEVELS[zoomIndex];


    // UI labels based on UI locale
    const labels = isUI_RTL ? {
        livePreview: 'المعاينة المباشرة',
        printReady: 'جاهز للطباعة',
        realTime: 'تحديث في الوقت الفعلي',
        zoom: 'تكبير',
        zoomIn: 'تكبير',
        zoomOut: 'تصغير',
        resetZoom: 'إعادة ضبط',
        print: 'طباعة',
        printPreview: 'معاينة الطباعة',
        fullscreen: 'ملء الشاشة',
        exitFullscreen: 'إنهاء',
        desktop: 'سطح المكتب',
        tablet: 'جهاز لوحي',
        mobile: 'جوال'
    } : uiLocale === 'fr' ? {
        livePreview: 'Aperçu en direct',
        printReady: 'Format prêt pour impression',
        realTime: 'Mises à jour en temps réel',
        zoom: 'Zoom',
        zoomIn: 'Zoom avant',
        zoomOut: 'Zoom arrière',
        resetZoom: 'Réinitialiser',
        print: 'Imprimer',
        printPreview: 'Aperçu avant impression',
        fullscreen: 'Plein écran',
        exitFullscreen: 'Quitter',
        desktop: 'Ordinateur',
        tablet: 'Tablette',
        mobile: 'Mobile'
    } : {
        livePreview: 'Live Preview',
        printReady: 'Print-ready format',
        realTime: 'Updates in real-time',
        zoom: 'Zoom',
        zoomIn: 'Zoom In',
        zoomOut: 'Zoom Out',
        resetZoom: 'Reset',
        print: 'Print',
        printPreview: 'Print Preview',
        fullscreen: 'Fullscreen',
        exitFullscreen: 'Exit',
        desktop: 'Desktop',
        tablet: 'Tablet',
        mobile: 'Mobile'
    };

    // ========== HANDLERS ==========
    const handleZoomIn = useCallback(() => {
        setIsTransitioning(true);
        setZoomIndex(prev => Math.min(prev + 1, ZOOM_LEVELS.length - 1));
        setTimeout(() => setIsTransitioning(false), 300);
    }, []);

    const handleZoomOut = useCallback(() => {
        setIsTransitioning(true);
        setZoomIndex(prev => Math.max(prev - 1, 0));
        setTimeout(() => setIsTransitioning(false), 300);
    }, []);

    const handleResetZoom = useCallback(() => {
        setIsTransitioning(true);
        setZoomIndex(DEFAULT_ZOOM_INDEX);
        setTimeout(() => setIsTransitioning(false), 300);
    }, []);

    const handleViewModeChange = useCallback((mode: ViewMode) => {
        setIsTransitioning(true);
        setViewMode(mode);
        setTimeout(() => setIsTransitioning(false), 400);
    }, []);

    const handlePrint = useCallback(() => {
        setShowPrintOverlay(true);
        setTimeout(() => {
            window.print();
            setShowPrintOverlay(false);
        }, 100);
    }, []);

    const toggleFullscreen = useCallback(() => {
        if (previewMode === 'fullscreen') {
            setPreviewMode('normal');
            document.exitFullscreen?.();
        } else {
            setPreviewMode('fullscreen');
            previewRef.current?.requestFullscreen?.();
        }
    }, [previewMode]);

    const togglePrintPreview = useCallback(() => {
        setPreviewMode(prev => prev === 'print' ? 'normal' : 'print');
    }, []);

    // Listen for fullscreen exit
    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && previewMode === 'fullscreen') {
                setPreviewMode('normal');
            }
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, [previewMode]);

    // Get current view dimensions
    const currentWidth = viewModeConfig[viewMode].width;
    const aspectRatio = 1123 / 794; // A4 ratio
    const currentHeight = Math.round(currentWidth * aspectRatio);

    // ========== RENDER ==========
    return (
        <div
            ref={previewRef}
            className={`flex flex-col w-full h-full overflow-hidden relative rounded-xl border shadow-inner transition-all duration-300 ${previewMode === 'fullscreen'
                ? 'fixed inset-0 z-50 rounded-none border-0'
                : previewMode === 'print'
                    ? 'bg-white border-blue-300'
                    : 'bg-gradient-to-b from-gray-100 to-gray-200 border-gray-200'
                }`}
            dir={isUI_RTL ? 'rtl' : 'ltr'}
        >
            {/* ========== HEADER ========== */}
            <motion.div
                initial={false}
                animate={{ y: 0, opacity: 1 }}
                className="w-full bg-white/95 backdrop-blur-md border-b border-gray-200 px-3 py-2.5 flex justify-between items-center z-20 shrink-0"
            >
                {/* Left: Title */}
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${previewMode === 'print' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <Eye size={14} className={previewMode === 'print' ? 'text-blue-600' : 'text-gray-600'} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm text-gray-800">
                            {previewMode === 'print' ? labels.printPreview : labels.livePreview}
                        </span>
                        <span className="text-[10px] text-gray-400 hidden sm:block">
                            {Math.round(scaleFactor * 100)}% • {viewModeConfig[viewMode].label}
                        </span>
                    </div>
                </div>

                {/* Center: View Mode Toggle */}
                <div className="hidden md:flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                    {(Object.keys(viewModeConfig) as ViewMode[]).map((mode) => {
                        const Icon = viewModeConfig[mode].icon;
                        const isActive = viewMode === mode;
                        return (
                            <button
                                key={mode}
                                onClick={() => handleViewModeChange(mode)}
                                className={`p-1.5 rounded-md transition-all duration-200 ${isActive
                                    ? 'bg-white shadow-sm text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                                title={viewModeConfig[mode].label}
                            >
                                <Icon size={14} />
                            </button>
                        );
                    })}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1">
                    {/* Zoom Controls */}
                    <div className="hidden sm:flex items-center gap-0.5 bg-gray-100 p-0.5 rounded-lg">
                        <button
                            onClick={handleZoomOut}
                            disabled={zoomIndex === 0}
                            className="p-1.5 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            title={labels.zoomOut}
                        >
                            <ZoomOut size={14} />
                        </button>
                        <button
                            onClick={handleResetZoom}
                            className="px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded transition-colors min-w-[40px]"
                            title={labels.resetZoom}
                        >
                            {Math.round(scaleFactor * 100)}%
                        </button>
                        <button
                            onClick={handleZoomIn}
                            disabled={zoomIndex === ZOOM_LEVELS.length - 1}
                            className="p-1.5 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            title={labels.zoomIn}
                        >
                            <ZoomIn size={14} />
                        </button>
                    </div>

                    <div className="w-px h-5 bg-gray-200 mx-1" />

                    {/* Print Preview Toggle */}
                    <button
                        onClick={togglePrintPreview}
                        className={`p-1.5 rounded-lg transition-colors ${previewMode === 'print'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                            }`}
                        title={labels.printPreview}
                    >
                        <Printer size={14} />
                    </button>

                    {/* Fullscreen Toggle */}
                    <button
                        onClick={toggleFullscreen}
                        className={`p-1.5 rounded-lg transition-colors ${previewMode === 'fullscreen'
                            ? 'bg-purple-100 text-purple-600'
                            : 'bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                            }`}
                        title={previewMode === 'fullscreen' ? labels.exitFullscreen : labels.fullscreen}
                    >
                        {previewMode === 'fullscreen' ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>

                    {/* Content Language Selector */}
                    <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg px-2">
                        <Globe size={12} className="text-gray-500" />
                        <select
                            value={cvData.contentLanguage || 'en'}
                            onChange={(e) => setContentLanguage(e.target.value as any)}
                            className="bg-transparent text-xs font-medium text-gray-600 border-none outline-none cursor-pointer w-16"
                        >
                            <option value="en">EN</option>
                            <option value="ar">AR</option>
                            <option value="fr">FR</option>
                        </select>
                    </div>

                    <div className="w-px h-5 bg-gray-200 mx-1" />

                    {/* Theme Selector */}
                    <ThemeSelector />
                </div>
            </motion.div>

            {/* ========== PREVIEW AREA ========== */}
            <div className={`flex-1 overflow-auto p-4 flex justify-center items-start ${previewMode === 'print' ? 'bg-gray-100' : ''
                }`}>
                {/* Animation wrapper */}
                <motion.div
                    initial={false}
                    animate={{
                        width: currentWidth * scaleFactor,
                        height: currentHeight * scaleFactor,
                        opacity: isTransitioning ? 0.7 : 1
                    }}
                    transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30
                    }}
                    className="relative"
                >
                    {/* Print Preview Paper Effect */}
                    {previewMode === 'print' && (
                        <div className="absolute -inset-2 bg-white rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.15)] -z-10" />
                    )}

                    {/* Scaled CV Container */}
                    <motion.div
                        id="cv-preview-content"
                        className={`absolute top-0 ${isContent_RTL ? 'right-0 origin-top-right' : 'left-0 origin-top-left'} rounded-sm overflow-hidden bg-white`}
                        dir={isContent_RTL ? 'rtl' : 'ltr'}
                        style={{
                            width: `${currentWidth}px`,
                            minHeight: `${currentHeight}px`,
                            transform: `scale(${scaleFactor})`,
                            boxShadow: previewMode === 'print'
                                ? 'none'
                                : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 20px -10px rgba(0, 0, 0, 0.1)',
                        }}
                        initial={false}
                        animate={{
                            scale: scaleFactor
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 35
                        }}
                    >
                        {/* Template Content with Transition */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${activeTemplate}-${viewMode}`}
                                initial={{ opacity: 0.8 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0.8 }}
                                transition={{ duration: 0.2 }}
                            >
                                <TemplateRenderer
                                    data={cvData}
                                    templateId={activeTemplate}
                                    locale={contentLocale}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </div>

            {/* ========== FOOTER ========== */}
            <motion.div
                initial={false}
                animate={{ y: 0, opacity: 1 }}
                className="w-full bg-white/90 backdrop-blur-sm border-t border-gray-200 px-4 py-2 flex justify-between items-center text-xs text-gray-500 shrink-0"
            >
                {/* Left: Status */}
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        {labels.realTime}
                    </span>
                </div>

                {/* Center: Template Name */}
                <span className="font-medium bg-gray-100 px-2 py-0.5 rounded capitalize">
                    {activeTemplate}
                </span>

                {/* Right: Print Button */}
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs font-medium"
                >
                    <Printer size={12} />
                    {labels.print}
                </button>
            </motion.div>

            {/* ========== PRINT OVERLAY ========== */}
            <AnimatePresence>
                {showPrintOverlay && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/95 z-50 flex items-center justify-center"
                    >
                        <div className="text-center">
                            <RefreshCw className="animate-spin mx-auto mb-3 text-blue-600" size={32} />
                            <p className="font-medium text-gray-700">
                                {uiLocale === 'ar' ? 'جاري تحضير الطباعة...' : uiLocale === 'fr' ? 'Préparation de l\'impression...' : 'Preparing print...'}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ========== MOBILE VIEW MODE SELECTOR (shown on small screens) ========== */}
            <div className="md:hidden absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/95 shadow-lg p-1 rounded-xl border border-gray-200">
                {(Object.keys(viewModeConfig) as ViewMode[]).map((mode) => {
                    const Icon = viewModeConfig[mode].icon;
                    const isActive = viewMode === mode;
                    return (
                        <button
                            key={mode}
                            onClick={() => handleViewModeChange(mode)}
                            className={`p-2 rounded-lg transition-all duration-200 ${isActive
                                ? 'bg-blue-100 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <Icon size={16} />
                        </button>
                    );
                })}
            </div>

            {/* ========== FULLSCREEN EXIT BUTTON ========== */}
            {previewMode === 'fullscreen' && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={toggleFullscreen}
                    className="fixed top-4 right-4 z-50 p-3 bg-black/70 hover:bg-black/80 text-white rounded-full shadow-lg transition-colors"
                    title={labels.exitFullscreen}
                >
                    <X size={20} />
                </motion.button>
            )}
        </div>
    );
}
