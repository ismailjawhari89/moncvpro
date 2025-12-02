import { useState } from 'react';
import { generateCVContent } from '@/services/api';
import type { CVData } from '@/types/cv';

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
            alert('Contenu généré avec succès !');
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
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
                <span>✨</span>
                <span className="hidden sm:inline">Assistant IA</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>

                        <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <span>🤖</span> Assistant de Rédaction
                        </h3>

                        <p className="text-sm text-gray-600 mb-6">
                            Entrez le poste que vous visez, et l&apos;IA générera un résumé professionnel et des exemples d&apos;expériences.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Poste visé / Titre du job
                                </label>
                                <input
                                    type="text"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    placeholder="ex: Boulanger, Développeur Web, Commercial..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleGenerate}
                                disabled={loading || !jobTitle.trim()}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Rédaction en cours...
                                    </>
                                ) : (
                                    <>
                                        <span>✨</span> Générer le contenu
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
