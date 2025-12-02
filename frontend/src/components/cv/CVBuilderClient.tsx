'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import CVForm from '@/components/cv/CVForm';
import CVPreview from '@/components/cv/CVPreview';
import Login from '@/components/auth/Login';
import type { CVData, TemplateType } from '@/types/cv';
import type { User } from '@supabase/supabase-js';

export default function CVBuilderClient() {
    const [user, setUser] = useState<User | null>(null);
    const [cvData, setCVData] = useState<CVData>({
        personal: { fullName: '', email: '', phone: '', location: '', summary: '' },
        experiences: [],
        education: [],
        skills: [],
        languages: []
    });
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');
    const [savedCVs, setSavedCVs] = useState<{ id: string; title: string; updated_at: string; data: CVData }[]>([]);
    const [loading, setLoading] = useState(false);

    // Check auth state on mount
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) fetchSavedCVs();
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) fetchSavedCVs();
            else setSavedCVs([]);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchSavedCVs = async () => {
        const { data } = await supabase
            .from('cvs')
            .select('*')
            .order('updated_at', { ascending: false })
            .not('updated_at', 'is', null);

        if (data) setSavedCVs(data);
    };

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);

        const title = cvData.personal.fullName ? `CV - ${cvData.personal.fullName}` : 'Mon CV';

        try {
            const { error } = await supabase.from('cvs').upsert({
                user_id: user.id,
                title,
                data: cvData,
                updated_at: new Date().toISOString()
            });

            if (error) throw error;
            alert('CV sauvegardé avec succès !');
            fetchSavedCVs();
        } catch (error) {
            console.error('Error saving CV:', error);
            alert('Erreur lors de la sauvegarde.');
        } finally {
            setLoading(false);
        }
    };

    const handleLoad = (savedCV: { data: CVData }) => {
        if (confirm('Voulez-vous charger ce CV ? Les données actuelles seront remplacées.')) {
            setCVData(savedCV.data);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const handleDataChange = (data: CVData) => {
        setCVData(data);
    };

    return (
        <>
            <div className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto space-y-6">
                {/* Auth Section */}
                {!user ? (
                    <Login />
                ) : (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-600">Connecté en tant que</p>
                            <p className="font-medium text-gray-900">{user.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                            Déconnexion
                        </button>
                    </div>
                )}

                {/* Saved CVs List */}
                {user && savedCVs.length > 0 && (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-3">Mes CVs sauvegardés</h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {savedCVs.map((cv) => (
                                <div key={cv.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-all">
                                    <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">{cv.title}</span>
                                    <div className="flex gap-2">
                                        <span className="text-xs text-gray-400">
                                            {new Date(cv.updated_at).toLocaleDateString()}
                                        </span>
                                        <button
                                            onClick={() => handleLoad(cv)}
                                            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                                        >
                                            Charger
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions Bar */}
                {user && (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? 'Sauvegarde...' : '💾 Sauvegarder mon CV'}
                        </button>
                    </div>
                )}

                <CVForm onDataChange={handleDataChange} initialData={cvData} />
            </div>

            <div>
                <CVPreview
                    data={cvData}
                    selectedTemplate={selectedTemplate}
                    onTemplateChange={setSelectedTemplate}
                />
            </div>
        </>
    );
}
