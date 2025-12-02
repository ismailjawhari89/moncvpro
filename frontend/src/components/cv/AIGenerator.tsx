import { useState } from 'react';
import { generateCVContent } from '@/services/api';
import type { CVData } from '@/types/cv';
import { Sparkles, Wand2, Loader2, X } from 'lucide-react';

interface AIGeneratorProps {
    onGenerate: (data: Partial<CVData>) => void;
    currentData: CVData;
}

export default function AIGenerator({ onGenerate, currentData }: AIGeneratorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [jobTitle, setJobTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!jobTitle.trim()) return;

        setLoading(true);
        setError('');

        try {
            const result = await generateCVContent(jobTitle, currentData);

            // Transform result into CVData structure
            const newContent: Partial<CVData> = {
                personal: {
                    ...currentData.personal,
                    summary: result.summary || currentData.personal.summary
                },
                experiences: result.experiences ? result.experiences.map((exp: { position: string; company: string; description: string }, index: number) => ({
                    id: `ai-exp-${Date.now()}-${index}`,
                    position: exp.position,
                    company: exp.company,
                    startDate: '2023',
                    endDate: 'Present',
                    current: false,
                    description: exp.description,
                    achievements: []
                })) : []
            };

            onGenerate(newContent);
            setIsOpen(false);
        } catch (err) {
            console.error(err);
            setError('Erreur lors de la génération. Vérifiez votre connexion.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm font-medium"
            >
                <Sparkles size={18} />
                <span>Start AI Generation</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200 border border-gray-100">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                <Wand2 size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">AI Assistant</h3>
                                <p className="text-sm text-gray-500">Powered by AI</p>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                            Enter your target job title, and our AI will generate a professional summary and experience examples tailored for you.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Target Job Title
                                </label>
                                <input
                                    type="text"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    placeholder="e.g. Full Stack Developer, Marketing Manager..."
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                                    <span className="block w-1.5 h-1.5 bg-red-500 rounded-full" />
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleGenerate}
                                disabled={loading || !jobTitle.trim()}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-sm hover:shadow-md active:scale-[0.98]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Generating Content...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} />
                                        Generate Content
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

