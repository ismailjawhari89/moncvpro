'use client';

import React, { useState, useEffect, Suspense, lazy } from 'react';
import {
    User as UserIcon,
    Briefcase,
    GraduationCap,
    Award,
    Languages,
    Plus,
    Trash2,
    Save,
    Download,
    Eye,
    EyeOff,
    Sparkles,
    Wand2,
    LayoutTemplate,
    CheckCircle,
    AlertCircle,
    Loader2,
    Menu,
    X,
    ChevronDown,
    LogOut,
    Settings,
    FileText
} from 'lucide-react';
import { CVData, TemplateType, Experience, Education, Skill, Language } from '@/types/cv';

// Lazy load heavy components
const CVPreview = lazy(() => import('@/components/cv/CVPreview'));
const AIGenerator = lazy(() => import('@/components/cv/AIGenerator'));

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface FormState {
    loading: boolean;
    saving: boolean;
    error: string | null;
    success: string | null;
}

interface User {
    name: string;
    email: string;
    avatar?: string;
}

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
        {children}
    </div>
);

const SectionHeader = ({
    icon: Icon,
    title,
    description
}: {
    icon: React.ElementType;
    title: string;
    description: string;
}) => (
    <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <Icon size={24} />
        </div>
        <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
    </div>
);

const InputGroup = ({
    label,
    error,
    required = false,
    children
}: {
    label: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
}) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {children}
        {error && (
            <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={12} /> {error}
            </p>
        )}
    </div>
);

const Input = ({
    className = '',
    ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none placeholder:text-gray-400 text-gray-900 text-sm ${className}`}
    />
);

const TextArea = ({
    className = '',
    ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea
        {...props}
        className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none placeholder:text-gray-400 text-gray-900 text-sm min-h-[120px] resize-y ${className}`}
    />
);

const Button = ({
    variant = 'primary',
    loading = false,
    icon: Icon,
    children,
    className = '',
    ...props
}: {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    loading?: boolean;
    icon?: React.ElementType;
    children: React.ReactNode;
    className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md',
        secondary: 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
        danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
    };

    return (
        <button
            {...props}
            disabled={loading || props.disabled}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
        >
            {loading ? (
                <Loader2 size={18} className="animate-spin" />
            ) : (
                Icon && <Icon size={18} />
            )}
            {children}
        </button>
    );
};

const Alert = ({
    type,
    message
}: {
    type: 'success' | 'error' | 'info';
    message: string;
}) => {
    const styles = {
        success: 'bg-green-50 border-l-4 border-green-500 text-green-800',
        error: 'bg-red-50 border-l-4 border-red-500 text-red-800',
        info: 'bg-blue-50 border-l-4 border-blue-500 text-blue-800'
    };

    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        info: AlertCircle
    };

    const Icon = icons[type];

    return (
        <div className={`p-4 rounded-lg ${styles[type]} flex items-center gap-3 animate-in slide-in-from-top-2 duration-300`}>
            <Icon size={20} />
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
};

const LoadingSkeleton = () => (
    <div className="space-y-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
    </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CVBuilderPro() {
    // State Management
    const [activeTab, setActiveTab] = useState('personal');
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');
    const [formState, setFormState] = useState<FormState>({
        loading: false,
        saving: false,
        error: null,
        success: null
    });

    // Mock user data
    const [user] = useState<User>({
        name: 'John Doe',
        email: 'john@example.com'
    });

    // CV Data
    const [cvData, setCVData] = useState<CVData>({
        personal: {
            fullName: '',
            email: '',
            phone: '',
            location: '',
            summary: ''
        },
        experiences: [],
        education: [],
        skills: [],
        languages: []
    });

    // Auto-dismiss alerts
    useEffect(() => {
        if (formState.success || formState.error) {
            const timer = setTimeout(() => {
                setFormState(prev => ({ ...prev, success: null, error: null }));
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [formState.success, formState.error]);

    // ========================================================================
    // HANDLERS
    // ========================================================================

    const updatePersonal = (field: keyof CVData['personal'], value: string) => {
        setCVData(prev => ({
            ...prev,
            personal: { ...prev.personal, [field]: value }
        }));
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

    const updateExperience = (id: string, field: keyof Experience, value: any) => {
        setCVData(prev => ({
            ...prev,
            experiences: prev.experiences.map(exp =>
                exp.id === id ? { ...exp, [field]: value } : exp
            )
        }));
    };

    const removeExperience = (id: string) => {
        setCVData(prev => ({
            ...prev,
            experiences: prev.experiences.filter(exp => exp.id !== id)
        }));
    };

    const addEducation = () => {
        const newEdu: Education = {
            id: crypto.randomUUID(),
            institution: '',
            degree: '',
            field: '',
            startDate: '',
            endDate: '',
            current: false
        };
        setCVData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
    };

    const updateEducation = (id: string, field: keyof Education, value: string | boolean) => {
        setCVData(prev => ({
            ...prev,
            education: prev.education.map(edu =>
                edu.id === id ? { ...edu, [field]: value } : edu
            )
        }));
    };

    const removeEducation = (id: string) => {
        setCVData(prev => ({
            ...prev,
            education: prev.education.filter(edu => edu.id !== id)
        }));
    };

    const addSkill = () => {
        const newSkill: Skill = {
            id: crypto.randomUUID(),
            name: '',
            category: 'technical'
        };
        setCVData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
    };

    const updateSkill = (id: string, field: keyof Skill, value: string) => {
        setCVData(prev => ({
            ...prev,
            skills: prev.skills.map(skill =>
                skill.id === id ? { ...skill, [field]: value } : skill
            )
        }));
    };

    const removeSkill = (id: string) => {
        setCVData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill.id !== id)
        }));
    };

    const addLanguage = () => {
        const newLang: Language = {
            id: crypto.randomUUID(),
            name: '',
            proficiency: 'basic'
        };
        setCVData(prev => ({ ...prev, languages: [...prev.languages, newLang] }));
    };

    const updateLanguage = (id: string, field: keyof Language, value: string) => {
        setCVData(prev => ({
            ...prev,
            languages: prev.languages.map(lang =>
                lang.id === id ? { ...lang, [field]: value } : lang
            )
        }));
    };

    const removeLanguage = (id: string) => {
        setCVData(prev => ({
            ...prev,
            languages: prev.languages.filter(lang => lang.id !== id)
        }));
    };

    const handleSave = async () => {
        setFormState(prev => ({ ...prev, saving: true, error: null }));

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setFormState({
            loading: false,
            saving: false,
            error: null,
            success: 'CV saved successfully!'
        });
    };

    const handleAIGenerate = (newData: Partial<CVData>) => {
        setCVData(prev => ({
            ...prev,
            personal: { ...prev.personal, ...newData.personal },
            experiences: [...prev.experiences, ...(newData.experiences || [])]
        }));
        setFormState({
            loading: false,
            saving: false,
            error: null,
            success: 'AI content generated successfully!'
        });
    };

    // ========================================================================
    // RENDER SECTIONS
    // ========================================================================

    const renderPersonalInfo = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader
                icon={UserIcon}
                title="Personal Information"
                description="Start with the basics. Let employers know who you are."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Full Name" required>
                    <Input
                        placeholder="e.g. John Doe"
                        value={cvData.personal.fullName}
                        onChange={(e) => updatePersonal('fullName', e.target.value)}
                    />
                </InputGroup>

                <InputGroup label="Email Address" required>
                    <Input
                        type="email"
                        placeholder="john@example.com"
                        value={cvData.personal.email}
                        onChange={(e) => updatePersonal('email', e.target.value)}
                    />
                </InputGroup>

                <InputGroup label="Phone Number">
                    <Input
                        type="tel"
                        placeholder="+1 234 567 890"
                        value={cvData.personal.phone}
                        onChange={(e) => updatePersonal('phone', e.target.value)}
                    />
                </InputGroup>

                <InputGroup label="Location">
                    <Input
                        placeholder="City, Country"
                        value={cvData.personal.location}
                        onChange={(e) => updatePersonal('location', e.target.value)}
                    />
                </InputGroup>

                <div className="md:col-span-2">
                    <InputGroup label="Professional Summary">
                        <TextArea
                            placeholder="Briefly describe your professional background and key achievements..."
                            value={cvData.personal.summary}
                            onChange={(e) => updatePersonal('summary', e.target.value)}
                        />
                    </InputGroup>
                </div>
            </div>
        </div>
    );

    const renderExperience = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader
                icon={Briefcase}
                title="Work Experience"
                description="Highlight your professional journey and achievements."
            />

            <div className="space-y-6">
                {cvData.experiences.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                        <Briefcase className="mx-auto text-gray-400 mb-3" size={48} />
                        <p className="text-gray-600 font-medium mb-2">No experience added yet</p>
                        <p className="text-sm text-gray-500 mb-4">Click the button below to add your first position</p>
                    </div>
                ) : (
                    cvData.experiences.map((exp) => (
                        <Card key={exp.id} className="relative group hover:border-blue-300 transition-all">
                            <button
                                onClick={() => removeExperience(exp.id)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={18} />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <InputGroup label="Job Title" required>
                                    <Input
                                        placeholder="e.g. Senior Product Manager"
                                        value={exp.position}
                                        onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                                    />
                                </InputGroup>

                                <InputGroup label="Company" required>
                                    <Input
                                        placeholder="e.g. Google"
                                        value={exp.company}
                                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                    />
                                </InputGroup>

                                <InputGroup label="Start Date">
                                    <Input
                                        type="month"
                                        value={exp.startDate}
                                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                    />
                                </InputGroup>

                                <InputGroup label="End Date">
                                    <Input
                                        type="month"
                                        value={exp.endDate}
                                        disabled={exp.current}
                                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                    />
                                </InputGroup>
                            </div>

                            <label className="flex items-center gap-2 text-sm text-gray-700 mb-4">
                                <input
                                    type="checkbox"
                                    checked={exp.current}
                                    onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                I currently work here
                            </label>
                        </Card>
                    ))
                )}

                <button
                    onClick={addExperience}
                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={20} />
                    Add Experience
                </button>
            </div>
        </div>
    );

    const renderEducation = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader
                icon={GraduationCap}
                title="Education"
                description="Share your academic background and qualifications."
            />

            <div className="space-y-6">
                {cvData.education.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                        <GraduationCap className="mx-auto text-gray-400 mb-3" size={48} />
                        <p className="text-gray-600 font-medium mb-2">No education added yet</p>
                        <p className="text-sm text-gray-500 mb-4">Add your academic achievements</p>
                    </div>
                ) : (
                    cvData.education.map((edu) => (
                        <Card key={edu.id} className="relative group hover:border-blue-300 transition-all">
                            <button
                                onClick={() => removeEducation(edu.id)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={18} />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputGroup label="Institution" required>
                                    <Input
                                        placeholder="e.g. Harvard University"
                                        value={edu.institution}
                                        onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                    />
                                </InputGroup>

                                <InputGroup label="Degree" required>
                                    <Input
                                        placeholder="e.g. Bachelor of Science"
                                        value={edu.degree}
                                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                    />
                                </InputGroup>

                                <InputGroup label="Field of Study">
                                    <Input
                                        placeholder="e.g. Computer Science"
                                        value={edu.field}
                                        onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                                    />
                                </InputGroup>

                                <InputGroup label="Graduation Year">
                                    <Input
                                        placeholder="e.g. 2020"
                                        value={edu.endDate}
                                        onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                    />
                                </InputGroup>
                            </div>
                        </Card>
                    ))
                )}

                <button
                    onClick={addEducation}
                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={20} />
                    Add Education
                </button>
            </div>
        </div>
    );

    const renderSkills = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader
                icon={Award}
                title="Skills"
                description="Showcase your technical and professional capabilities."
            />

            <div className="space-y-4">
                {cvData.skills.map((skill) => (
                    <div key={skill.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 group hover:border-blue-300 transition-all">
                        <Input
                            placeholder="e.g. JavaScript, Leadership, Design"
                            value={skill.name}
                            onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                            className="flex-1"
                        />
                        <select
                            value={skill.category}
                            onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                            className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        >
                            <option value="technical">Technical</option>
                            <option value="soft">Soft Skill</option>
                        </select>
                        <button
                            onClick={() => removeSkill(skill.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}

                <button
                    onClick={addSkill}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={20} />
                    Add Skill
                </button>
            </div>
        </div>
    );

    const renderLanguages = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader
                icon={Languages}
                title="Languages"
                description="List the languages you speak and your proficiency level."
            />

            <div className="space-y-4">
                {cvData.languages.map((lang) => (
                    <div key={lang.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 group hover:border-blue-300 transition-all">
                        <Input
                            placeholder="e.g. English, Spanish"
                            value={lang.name}
                            onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                            className="flex-1"
                        />
                        <select
                            value={lang.proficiency}
                            onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                            className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        >
                            <option value="basic">Basic</option>
                            <option value="conversational">Conversational</option>
                            <option value="fluent">Fluent</option>
                            <option value="native">Native</option>
                        </select>
                        <button
                            onClick={() => removeLanguage(lang.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}

                <button
                    onClick={addLanguage}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={20} />
                    Add Language
                </button>
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'personal': return renderPersonalInfo();
            case 'experience': return renderExperience();
            case 'education': return renderEducation();
            case 'skills': return renderSkills();
            case 'languages': return renderLanguages();
            default: return null;
        }
    };

    // ========================================================================
    // MAIN RENDER
    // ========================================================================

    const tabs = [
        { id: 'personal', label: 'Personal', icon: UserIcon },
        { id: 'experience', label: 'Experience', icon: Briefcase },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'skills', label: 'Skills', icon: Award },
        { id: 'languages', label: 'Languages', icon: Languages }
    ];

    const templates = [
        { id: 'modern', name: 'Modern', color: 'blue' },
        { id: 'classic', name: 'Classic', color: 'gray' },
        { id: 'creative', name: 'Creative', color: 'purple' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                                CV
                            </div>
                            <div>
                                <h1 className="font-bold text-xl text-gray-900">
                                    CV<span className="text-blue-600">Builder</span> Pro
                                </h1>
                                <p className="text-xs text-gray-500">Professional Resume Creator</p>
                            </div>
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            <Button
                                variant="secondary"
                                icon={Save}
                                loading={formState.saving}
                                onClick={handleSave}
                            >
                                Save CV
                            </Button>

                            {/* User Menu */}
                            <div className="relative group">
                                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-sm">
                                        {user.name.charAt(0)}
                                    </div>
                                    <ChevronDown size={16} className="text-gray-500" />
                                </button>

                                {/* Dropdown */}
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="font-semibold text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                                        <Settings size={16} />
                                        Settings
                                    </button>
                                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                                        <FileText size={16} />
                                        My CVs
                                    </button>
                                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600">
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 bg-white">
                        <div className="px-4 py-3 space-y-2">
                            <Button variant="primary" icon={Save} className="w-full" onClick={handleSave}>
                                Save CV
                            </Button>
                            <Button variant="secondary" icon={Download} className="w-full">
                                Export PDF
                            </Button>
                        </div>
                    </div>
                )}
            </header>

            {/* Alerts */}
            {(formState.success || formState.error) && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    {formState.success && <Alert type="success" message={formState.success} />}
                    {formState.error && <Alert type="error" message={formState.error} />}
                </div>
            )}

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Tabs */}
                        <Card className="!p-2">
                            <div className="flex overflow-x-auto gap-1 no-scrollbar">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                                ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <tab.icon size={16} />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </Card>

                        {/* Form Content */}
                        <Card className="min-h-[600px]">
                            {renderTabContent()}
                        </Card>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* AI Assistant Card */}
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-100 p-6 shadow-md">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Sparkles size={100} className="text-purple-600" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-white rounded-xl shadow-sm text-purple-600">
                                        <Wand2 size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">AI Assistant</h3>
                                        <p className="text-xs text-gray-600">Powered by AI</p>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                                    Let AI help you craft professional content tailored to your target role.
                                </p>

                                <Suspense fallback={<LoadingSkeleton />}>
                                    <AIGenerator
                                        currentData={cvData}
                                        onGenerate={handleAIGenerate}
                                    />
                                </Suspense>

                                <button className="w-full mt-3 py-2 text-sm text-purple-700 hover:text-purple-800 font-medium flex items-center justify-center gap-2 hover:bg-white/50 rounded-lg transition-colors">
                                    <Eye size={16} />
                                    View Demo
                                </button>
                            </div>
                        </div>

                        {/* Templates Gallery */}
                        <Card>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <LayoutTemplate size={18} className="text-gray-500" />
                                    Templates
                                </h3>
                                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                    {templates.length} Available
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {templates.map((template) => (
                                    <button
                                        key={template.id}
                                        onClick={() => setSelectedTemplate(template.id as TemplateType)}
                                        className={`relative aspect-[3/4] rounded-lg border-2 overflow-hidden transition-all ${selectedTemplate === template.id
                                                ? 'border-blue-600 ring-2 ring-blue-100 ring-offset-2'
                                                : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50" />
                                        <div className="absolute inset-2 bg-white shadow-sm rounded-sm opacity-60" />

                                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-white/90 backdrop-blur-sm border-t border-gray-100">
                                            <p className="text-xs font-medium text-center capitalize text-gray-700">
                                                {template.name}
                                            </p>
                                        </div>

                                        {selectedTemplate === template.id && (
                                            <div className="absolute top-2 right-2 text-blue-600 bg-white rounded-full p-1 shadow-sm">
                                                <CheckCircle size={14} fill="currentColor" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </Card>

                        {/* Export Actions */}
                        <Card>
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Download size={18} className="text-gray-500" />
                                Export Options
                            </h3>

                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:bg-white transition-colors">
                                            <FileText size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-gray-900">Download PDF</p>
                                            <p className="text-xs text-gray-500">Print-ready format</p>
                                        </div>
                                    </div>
                                    <Download size={16} className="text-gray-400 group-hover:text-blue-600" />
                                </button>

                                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-white transition-colors">
                                            <FileText size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-gray-900">Download DOCX</p>
                                            <p className="text-xs text-gray-500">Editable document</p>
                                        </div>
                                    </div>
                                    <Download size={16} className="text-gray-400 group-hover:text-blue-600" />
                                </button>
                            </div>
                        </Card>

                        {/* Live Preview Toggle */}
                        <Card>
                            <button
                                onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                                className="w-full flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    {isPreviewOpen ? <EyeOff size={20} /> : <Eye size={20} />}
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900">Live Preview</p>
                                        <p className="text-xs text-gray-500">
                                            {isPreviewOpen ? 'Hide preview' : 'Show preview'}
                                        </p>
                                    </div>
                                </div>
                                <div className={`w-12 h-6 rounded-full transition-colors ${isPreviewOpen ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform m-0.5 ${isPreviewOpen ? 'translate-x-6' : 'translate-x-0'}`} />
                                </div>
                            </button>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Preview Modal */}
            {isPreviewOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-900">Live Preview</h3>
                            <button
                                onClick={() => setIsPreviewOpen(false)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
                            <Suspense fallback={<LoadingSkeleton />}>
                                <CVPreview
                                    data={cvData}
                                    selectedTemplate={selectedTemplate}
                                    onTemplateChange={setSelectedTemplate}
                                />
                            </Suspense>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
