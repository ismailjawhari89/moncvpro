'use client';

import React, { useState, useEffect } from 'react';
import {
    LayoutTemplate,
    Download,
    Sparkles,
    Save,
    User as UserIcon,
    Briefcase,
    GraduationCap,
    Languages,
    Plus,
    Trash2,
    ChevronRight,
    CheckCircle,
    AlertCircle,
    Loader2,
    X,
    Wand2,
    LogOut,
    History
} from 'lucide-react';
import { CVData, TemplateType, Experience, Education, Skill, Language } from '@/types/cv';
import CVPreview from '@/components/cv/CVPreview';
import AIGenerator from '@/components/cv/AIGenerator';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import Login from '@/components/auth/Login';

import { LucideIcon } from 'lucide-react';

// --- Components ---

interface SectionHeaderProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

const SectionHeader = ({ icon: Icon, title, description }: SectionHeaderProps) => (
    <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <Icon size={24} />
        </div>
        <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    </div>
);

const InputGroup = ({ label, error, children }: { label: string, error?: string, children: React.ReactNode }) => (
    <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        {children}
        {error && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {error}</p>}
    </div>
);

const StyledInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none placeholder:text-gray-400 text-gray-900 text-sm"
    />
);

const StyledTextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea
        {...props}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none placeholder:text-gray-400 text-gray-900 text-sm min-h-[120px] resize-y"
    />
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    icon?: LucideIcon;
}

const PrimaryButton = ({ children, onClick, loading, icon: Icon, className = '', disabled, ...props }: ButtonProps) => (
    <button
        onClick={onClick}
        disabled={loading || disabled}
        className={`flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow-md ${className}`}
        {...props}
    >
        {loading ? <Loader2 size={18} className="animate-spin" /> : Icon && <Icon size={18} />}
        {children}
    </button>
);

const SecondaryButton = ({ children, onClick, icon: Icon, className = '', ...props }: ButtonProps) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-all shadow-sm ${className}`}
        {...props}
    >
        {Icon && <Icon size={16} />}
        {children}
    </button>
);



// --- Main Layout Component ---

export default function ModernCVBuilder() {
    const [activeTab, setActiveTab] = useState('personal');
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');

    // Supabase State
    const [user, setUser] = useState<User | null>(null);
    const [savedCVs, setSavedCVs] = useState<{ id: string; title: string; updated_at: string; data: CVData }[]>([]);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    const [cvData, setCVData] = useState<CVData>({
        personal: { fullName: '', email: '', phone: '', location: '', summary: '' },
        experiences: [],
        education: [],
        skills: [],
        languages: []
    });

    // --- Auth & Data Fetching ---

    useEffect(() => {
        const initAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            if (session?.user) await fetchSavedCVs();
            setIsAuthLoading(false);
        };

        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) await fetchSavedCVs();
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
        if (!user) {
            alert('Please login to save your CV');
            return;
        }
        setSaving(true);

        const title = cvData.personal.fullName ? `CV - ${cvData.personal.fullName}` : 'Mon CV';

        try {
            const { error } = await supabase.from('cvs').upsert({
                user_id: user.id,
                title,
                data: cvData,
                updated_at: new Date().toISOString()
            });

            if (error) throw error;
            setLastSaved(new Date());
            fetchSavedCVs();
        } catch (error) {
            console.error('Error saving CV:', error);
            alert('Error saving CV');
        } finally {
            setSaving(false);
        }
    };

    const handleLoad = (savedCV: { data: CVData }) => {
        if (confirm('Load this CV? Current unsaved changes will be lost.')) {
            setCVData(savedCV.data);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    // --- Form Updates ---

    const updatePersonal = (field: string, value: string) => {
        setCVData(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
    };

    const addEducation = () => {
        const newEdu: Education = {
            id: crypto.randomUUID(),
            institution: '',
            degree: '',
            field: '',
            startDate: '',
            endDate: '',
            description: '',
            current: false
        };
        setCVData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
    };

    const removeEducation = (id: string) => {
        setCVData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
    };

    const updateEducation = (id: string, field: keyof Education, value: string | boolean) => {
        setCVData(prev => {
            const newEdu = prev.education.map(e => e.id === id ? { ...e, [field]: value } : e);
            return { ...prev, education: newEdu };
        });
    };

    const addSkill = () => {
        const newSkill: Skill = { id: crypto.randomUUID(), name: '', category: 'technical' };
        setCVData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
    };

    const removeSkill = (id: string) => {
        setCVData(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== id) }));
    };

    const updateSkill = (id: string, value: string) => {
        setCVData(prev => {
            const newSkills = prev.skills.map(s => s.id === id ? { ...s, name: value } : s);
            return { ...prev, skills: newSkills };
        });
    };

    const addLanguage = () => {
        const newLang: Language = { id: crypto.randomUUID(), name: '', proficiency: 'basic' };
        setCVData(prev => ({ ...prev, languages: [...prev.languages, newLang] }));
    };

    const removeLanguage = (id: string) => {
        setCVData(prev => ({ ...prev, languages: prev.languages.filter(l => l.id !== id) }));
    };

    const updateLanguage = (id: string, field: keyof Language, value: string) => {
        setCVData(prev => {
            const newLangs = prev.languages.map(l => l.id === id ? { ...l, [field]: value } : l);
            return { ...prev, languages: newLangs };
        });
    };

    const addExperience = () => {
        const newExp: Experience = {
            id: crypto.randomUUID(),
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            current: false,
            achievements: []
        };
        setCVData(prev => ({ ...prev, experiences: [...prev.experiences, newExp] }));
    };

    const removeExperience = (id: string) => {
        setCVData(prev => ({ ...prev, experiences: prev.experiences.filter(e => e.id !== id) }));
    };

    // --- Render Helpers ---

    const renderTabContent = () => {
        switch (activeTab) {
            case 'personal':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <SectionHeader
                            icon={UserIcon}
                            title="Personal Information"
                            description="Start with the basics. Employers need to know who you are and how to contact you."
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup label="Full Name">
                                <StyledInput
                                    placeholder="e.g. John Doe"
                                    value={cvData.personal.fullName}
                                    onChange={(e) => updatePersonal('fullName', e.target.value)}
                                />
                            </InputGroup>
                            <InputGroup label="Job Title">
                                <StyledInput placeholder="e.g. Senior Software Engineer" />
                            </InputGroup>
                            <InputGroup label="Email Address">
                                <StyledInput
                                    type="email"
                                    placeholder="john@example.com"
                                    value={cvData.personal.email}
                                    onChange={(e) => updatePersonal('email', e.target.value)}
                                />
                            </InputGroup>
                            <InputGroup label="Phone Number">
                                <StyledInput
                                    type="tel"
                                    placeholder="+1 234 567 890"
                                    value={cvData.personal.phone}
                                    onChange={(e) => updatePersonal('phone', e.target.value)}
                                />
                            </InputGroup>
                            <div className="md:col-span-2">
                                <InputGroup label="Location">
                                    <StyledInput
                                        placeholder="City, Country"
                                        value={cvData.personal.location}
                                        onChange={(e) => updatePersonal('location', e.target.value)}
                                    />
                                </InputGroup>
                            </div>
                            <div className="md:col-span-2">
                                <InputGroup label="Professional Summary">
                                    <StyledTextArea
                                        placeholder="Briefly describe your professional background and key achievements..."
                                        value={cvData.personal.summary}
                                        onChange={(e) => updatePersonal('summary', e.target.value)}
                                    />
                                </InputGroup>
                            </div>
                        </div>
                    </div>
                );
            case 'experience':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <SectionHeader
                            icon={Briefcase}
                            title="Work Experience"
                            description="Highlight your past roles and key achievements."
                        />
                        <div className="space-y-6">
                            {cvData.experiences.map((exp, index) => (
                                <div key={exp.id} className="p-6 bg-gray-50 rounded-xl border border-gray-200 relative group transition-all hover:border-blue-300 hover:shadow-sm">
                                    <button
                                        onClick={() => removeExperience(exp.id)}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <InputGroup label="Job Title">
                                            <StyledInput
                                                value={exp.position}
                                                onChange={(e) => {
                                                    const newExps = [...cvData.experiences];
                                                    newExps[index].position = e.target.value;
                                                    setCVData({ ...cvData, experiences: newExps });
                                                }}
                                                placeholder="e.g. Product Manager"
                                            />
                                        </InputGroup>
                                        <InputGroup label="Company">
                                            <StyledInput
                                                value={exp.company}
                                                onChange={(e) => {
                                                    const newExps = [...cvData.experiences];
                                                    newExps[index].company = e.target.value;
                                                    setCVData({ ...cvData, experiences: newExps });
                                                }}
                                                placeholder="e.g. Google"
                                            />
                                        </InputGroup>
                                    </div>
                                    <InputGroup label="Description">
                                        <StyledTextArea placeholder="Describe your responsibilities and achievements..." />
                                    </InputGroup>
                                </div>
                            ))}

                            <button
                                onClick={addExperience}
                                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={20} />
                                Add Position
                            </button>
                        </div>
                    </div>
                );
            case 'education':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <SectionHeader
                            icon={GraduationCap}
                            title="Education"
                            description="List your academic background and qualifications."
                        />
                        <div className="space-y-4">
                            {cvData.education.map((edu) => (
                                <div key={edu.id} className="p-6 bg-gray-50 rounded-xl border border-gray-200 relative group transition-all hover:border-blue-300 hover:shadow-sm">
                                    <button
                                        onClick={() => removeEducation(edu.id)}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <InputGroup label="Institution">
                                            <StyledInput
                                                value={edu.institution}
                                                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                                placeholder="e.g. University of Example"
                                            />
                                        </InputGroup>
                                        <InputGroup label="Degree">
                                            <StyledInput
                                                value={edu.degree}
                                                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                                placeholder="e.g. B.Sc. Computer Science"
                                            />
                                        </InputGroup>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <InputGroup label="Start Year">
                                            <StyledInput
                                                value={edu.startDate}
                                                onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                                                placeholder="e.g. 2018"
                                            />
                                        </InputGroup>
                                        <InputGroup label="End Year">
                                            <StyledInput
                                                value={edu.endDate}
                                                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                                placeholder="e.g. 2022"
                                            />
                                        </InputGroup>
                                    </div>
                                    <InputGroup label="Field / Major">
                                        <StyledInput
                                            value={edu.field || ''}
                                            onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                                            placeholder="e.g. Computer Science"
                                        />
                                    </InputGroup>
                                </div>
                            ))}
                            <button
                                onClick={addEducation}
                                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2"
                            >
                                <Plus size={20} />
                                Add Education
                            </button>
                        </div>
                    </div>
                );
            case 'skills':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <SectionHeader
                            icon={Sparkles}
                            title="Skills"
                            description="Showcase your technical and soft skills."
                        />
                        <div className="space-y-4">
                            {cvData.skills.map((skill) => (
                                <div key={skill.id} className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <StyledInput
                                        value={skill.name}
                                        onChange={(e) => updateSkill(skill.id, e.target.value)}
                                        placeholder="Skill name"
                                        className="flex-1"
                                    />
                                    <select
                                        value={skill.category}
                                        onChange={(e) => {
                                            const updated = { ...skill, category: e.target.value as Skill['category'] };
                                            setCVData(prev => ({ ...prev, skills: prev.skills.map(s => s.id === skill.id ? updated : s) }));
                                        }}
                                        className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="technical">Technical</option>
                                        <option value="soft">Soft</option>
                                    </select>
                                    <button onClick={() => removeSkill(skill.id)} className="text-red-500">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={addSkill}
                                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2"
                            >
                                <Plus size={20} />
                                Add Skill
                            </button>
                        </div>
                    </div>
                );
            case 'languages':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <SectionHeader
                            icon={Languages}
                            title="Languages"
                            description="List languages and proficiency levels."
                        />
                        <div className="space-y-4">
                            {cvData.languages.map((lang) => (
                                <div key={lang.id} className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <StyledInput
                                        value={lang.name}
                                        onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                                        placeholder="Language"
                                        className="flex-1"
                                    />
                                    <select
                                        value={lang.proficiency}
                                        onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value as Language['proficiency'])}
                                        className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="basic">Basic</option>
                                        <option value="conversational">Conversational</option>
                                        <option value="fluent">Fluent</option>
                                        <option value="native">Native</option>
                                    </select>
                                    <button onClick={() => removeLanguage(lang.id)} className="text-red-500">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={addLanguage}
                                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2"
                            >
                                <Plus size={20} />
                                Add Language
                            </button>
                        </div>
                    </div>
                );
            default:
                return <div className="p-12 text-center text-gray-500">Section under construction 🚧</div>;
        }
    };

    if (isAuthLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* --- Header --- */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            CV
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gray-900">MonCV<span className="text-blue-600">Pro</span></span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 mr-4">
                            {lastSaved ? (
                                <>
                                    <CheckCircle size={14} className="text-green-500" />
                                    Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </>
                            ) : (
                                <span className="text-gray-400">Unsaved changes</span>
                            )}
                        </div>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <PrimaryButton
                                    onClick={handleSave}
                                    loading={saving}
                                    icon={Save}
                                    className="!py-2 !px-4 !text-sm"
                                >
                                    Save
                                </PrimaryButton>
                                <div className="relative group">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-medium border border-blue-200 cursor-pointer">
                                        {user.email?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 p-2 hidden group-hover:block">
                                        <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-50 mb-1 truncate">
                                            {user.email}
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                                        >
                                            <LogOut size={14} /> Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-600">
                                Not logged in
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {!user ? (
                    <div className="max-w-md mx-auto mt-10">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center">
                            <h2 className="text-2xl font-bold mb-4">Welcome Back</h2>
                            <p className="text-gray-600 mb-6">Please sign in to create and save your CVs.</p>
                            <Login />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* --- Left Column: Form Sections --- */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Navigation Tabs */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex overflow-x-auto no-scrollbar gap-1">
                                {[
                                    { id: 'personal', label: 'Personal', icon: UserIcon },
                                    { id: 'experience', label: 'Experience', icon: Briefcase },
                                    { id: 'education', label: 'Education', icon: GraduationCap },
                                    { id: 'skills', label: 'Skills', icon: Sparkles },
                                    { id: 'languages', label: 'Languages', icon: Languages },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                                            ${activeTab === tab.id
                                                ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }
                                        `}
                                    >
                                        <tab.icon size={16} />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Form Content Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 min-h-[600px]">
                                {renderTabContent()}
                            </div>

                            {/* Navigation Footer */}
                            <div className="flex justify-between items-center pt-4">
                                <SecondaryButton className="!px-6">Back</SecondaryButton>
                                <PrimaryButton icon={ChevronRight} className="flex-row-reverse">Next Step</PrimaryButton>
                            </div>
                        </div>

                        {/* --- Right Column: Sidebar --- */}
                        <div className="lg:col-span-4 space-y-6">

                            {/* AI Assistant */}
                            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-white border border-blue-100 p-6 shadow-sm">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Sparkles size={100} className="text-blue-600" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm text-violet-600">
                                            <Wand2 size={20} />
                                        </div>
                                        <span className="font-bold text-gray-900">AI Assistant</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                        Boost your CV with AI-generated summaries and achievement suggestions tailored to your role.
                                    </p>
                                    <AIGenerator
                                        currentData={cvData}
                                        onGenerate={(newData: Partial<CVData>) => {
                                            setCVData(prev => ({
                                                ...prev,
                                                personal: { ...prev.personal, ...newData.personal },
                                                experiences: [...prev.experiences, ...(newData.experiences || [])]
                                            }));
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Saved CVs (History) */}
                            {savedCVs.length > 0 && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <History size={18} className="text-gray-500" />
                                        Saved CVs
                                    </h3>
                                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                                        {savedCVs.map((cv) => (
                                            <div key={cv.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-all group">
                                                <div className="truncate flex-1">
                                                    <p className="text-sm font-medium text-gray-700 truncate">{cv.title}</p>
                                                    <p className="text-xs text-gray-400">{new Date(cv.updated_at).toLocaleDateString()}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleLoad(cv)}
                                                    className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    Load
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Live Preview Toggle (Mobile/Tablet) */}
                            <div className="lg:hidden bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
                                <span className="font-medium text-gray-700">Live Preview</span>
                                <button
                                    onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                                    className="text-blue-600 font-medium text-sm hover:underline"
                                >
                                    {isPreviewOpen ? 'Hide' : 'Show'}
                                </button>
                            </div>

                            {/* Templates Gallery */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <LayoutTemplate size={18} className="text-gray-500" />
                                        Templates
                                    </h3>
                                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">3 Available</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {['modern', 'classic', 'creative'].map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setSelectedTemplate(t as TemplateType)}
                                            className={`
                                                group relative aspect-[3/4] rounded-lg border-2 overflow-hidden transition-all
                                                ${selectedTemplate === t
                                                    ? 'border-blue-600 ring-2 ring-blue-100 ring-offset-2'
                                                    : 'border-gray-100 hover:border-blue-200'
                                                }
                                            `}
                                        >
                                            <div className="absolute inset-0 bg-gray-100 group-hover:bg-gray-50 transition-colors" />
                                            {/* Mock Template Preview */}
                                            <div className="absolute inset-2 bg-white shadow-sm rounded-sm opacity-60" />
                                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-white/90 backdrop-blur-sm border-t border-gray-100">
                                                <p className="text-xs font-medium text-center capitalize text-gray-700">{t}</p>
                                            </div>
                                            {selectedTemplate === t && (
                                                <div className="absolute top-2 right-2 text-blue-600 bg-white rounded-full p-0.5 shadow-sm">
                                                    <CheckCircle size={14} fill="currentColor" className="text-white" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Export Actions */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Download size={18} className="text-gray-500" />
                                    Export
                                </h3>
                                <div className="space-y-3">
                                    <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:bg-white transition-colors">
                                                <span className="font-bold text-xs">PDF</span>
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-medium text-gray-900">Download PDF</p>
                                                <p className="text-xs text-gray-500">High quality print-ready</p>
                                            </div>
                                        </div>
                                        <Download size={16} className="text-gray-400 group-hover:text-blue-600" />
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* Live Preview Modal */}
                {isPreviewOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold text-gray-900">Live Preview</h3>
                                <button onClick={() => setIsPreviewOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
                                <CVPreview
                                    data={cvData}
                                    selectedTemplate={selectedTemplate}
                                    onTemplateChange={setSelectedTemplate}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
