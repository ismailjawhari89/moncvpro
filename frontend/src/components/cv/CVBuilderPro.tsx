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
    FileText,
    Moon,
    Sun,
    FileDown,
    Zap,
    TrendingUp,
    Copy
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

interface AIAnalysis {
    score: number;
    suggestions: string[];
    keywords: string[];
    missingInfo: string[];
}

type ThemeMode = 'light' | 'dark';

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

const Card = ({ children, className = '', isDark }: { children: React.ReactNode; className?: string; isDark?: boolean }) => (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6 transition-colors duration-300 ${className}`}>
        {children}
    </div>
);

const SectionHeader = ({
    icon: Icon,
    title,
    description,
    isDark
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    isDark?: boolean;
}) => (
    <div className="flex items-start gap-4 mb-6">
        <div className={`p-3 ${isDark ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-50 text-blue-600'} rounded-xl transition-colors duration-300`}>
            <Icon size={24} />
        </div>
        <div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>{title}</h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1 transition-colors duration-300`}>{description}</p>
        </div>
    </div>
);

const InputGroup = ({
    label,
    error,
    required = false,
    children,
    isDark
}: {
    label: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
    isDark?: boolean;
}) => (
    <div className="space-y-2">
        <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
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
    isDark,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { isDark?: boolean }) => (
    <input
        {...props}
        className={`w-full px-4 py-2.5 rounded-lg border ${isDark
            ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500'
            : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500'
            } focus:ring-2 transition-all outline-none text-sm ${className}`}
    />
);

const TextArea = ({
    className = '',
    isDark,
    ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { isDark?: boolean }) => (
    <textarea
        {...props}
        className={`w-full px-4 py-2.5 rounded-lg border ${isDark
            ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500'
            : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500'
            } focus:ring-2 transition-all outline-none text-sm min-h-[120px] resize-y ${className}`}
    />
);

const Button = ({
    variant = 'primary',
    loading = false,
    icon: Icon,
    children,
    className = '',
    isDark,
    ...props
}: {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    loading?: boolean;
    icon?: React.ElementType;
    children: React.ReactNode;
    className?: string;
    isDark?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    const variants = {
        primary: isDark
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md',
        secondary: isDark
            ? 'bg-gray-700 border border-gray-600 hover:bg-gray-600 text-gray-200 shadow-sm'
            : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm',
        ghost: isDark
            ? 'bg-transparent hover:bg-gray-700 text-gray-300'
            : 'bg-transparent hover:bg-gray-100 text-gray-700',
        danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
    };

    return (
        <button
            {...props}
            disabled={loading || props.disabled}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
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

const Toast = ({
    type,
    message,
    onClose
}: {
    type: 'success' | 'error' | 'info';
    message: string;
    onClose: () => void;
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
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg ${styles[type]} flex items-center gap-3 shadow-lg animate-in slide-in-from-top-2 duration-300 max-w-md`}>
            <Icon size={20} />
            <p className="text-sm font-medium flex-1">{message}</p>
            <button onClick={onClose} className="text-current hover:opacity-70">
                <X size={16} />
            </button>
        </div>
    );
};

const LoadingSkeleton = ({ isDark }: { isDark?: boolean }) => (
    <div className="space-y-4 animate-pulse">
        <div className={`h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4`}></div>
        <div className={`h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/2`}></div>
        <div className={`h-32 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
    </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CVBuilderPro() {
    // State Management
    const [activeTab, setActiveTab] = useState('personal');
    const [isPreviewOpen, setIsPreviewOpen] = useState(true); // Default to open for real-time preview
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');
    const [theme, setTheme] = useState<ThemeMode>('light');
    const [showAIModal, setShowAIModal] = useState(false);
    const [aiAnalysis, setAIAnalysis] = useState<AIAnalysis | null>(null);
    const [formState, setFormState] = useState<FormState>({
        loading: false,
        saving: false,
        error: null,
        success: null
    });

    const isDark = theme === 'dark';

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

    // Auto-dismiss toasts
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

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

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

    const updateExperience = (id: string, field: keyof Experience, value: string | boolean | string[]) => {
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

    const handleExportPDF = async () => {
        setFormState(prev => ({ ...prev, loading: true }));

        // Simulate export
        await new Promise(resolve => setTimeout(resolve, 2000));

        setFormState({
            loading: false,
            saving: false,
            error: null,
            success: 'PDF exported successfully!'
        });
    };

    const handleExportDOCX = async () => {
        setFormState(prev => ({ ...prev, loading: true }));

        // Simulate export
        await new Promise(resolve => setTimeout(resolve, 2000));

        setFormState({
            loading: false,
            saving: false,
            error: null,
            success: 'DOCX exported successfully!'
        });
    };

    const handleAIAnalyze = async () => {
        setFormState(prev => ({ ...prev, loading: true }));

        // Simulate AI analysis
        await new Promise(resolve => setTimeout(resolve, 2000));

        const analysis: AIAnalysis = {
            score: 85,
            suggestions: [
                'Add more quantifiable achievements in your experience section',
                'Include relevant certifications to boost credibility',
                'Optimize keywords for ATS compatibility',
                'Expand your professional summary with specific skills'
            ],
            keywords: ['JavaScript', 'React', 'TypeScript', 'Leadership', 'Project Management'],
            missingInfo: ['LinkedIn URL', 'Portfolio Website', 'Professional Certifications']
        };

        setAIAnalysis(analysis);
        setShowAIModal(true);
        setFormState(prev => ({ ...prev, loading: false }));
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
                isDark={isDark}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Full Name" required isDark={isDark}>
                    <Input
                        placeholder="e.g. John Doe"
                        value={cvData.personal.fullName}
                        onChange={(e) => updatePersonal('fullName', e.target.value)}
                        isDark={isDark}
                    />
                </InputGroup>

                <InputGroup label="Email Address" required isDark={isDark}>
                    <Input
                        type="email"
                        placeholder="john@example.com"
                        value={cvData.personal.email}
                        onChange={(e) => updatePersonal('email', e.target.value)}
                        isDark={isDark}
                    />
                </InputGroup>

                <InputGroup label="Phone Number" isDark={isDark}>
                    <Input
                        type="tel"
                        placeholder="+1 234 567 890"
                        value={cvData.personal.phone}
                        onChange={(e) => updatePersonal('phone', e.target.value)}
                        isDark={isDark}
                    />
                </InputGroup>

                <InputGroup label="Location" isDark={isDark}>
                    <Input
                        placeholder="City, Country"
                        value={cvData.personal.location}
                        onChange={(e) => updatePersonal('location', e.target.value)}
                        isDark={isDark}
                    />
                </InputGroup>

                <div className="md:col-span-2">
                    <InputGroup label="Professional Summary" isDark={isDark}>
                        <TextArea
                            placeholder="Briefly describe your professional background and key achievements..."
                            value={cvData.personal.summary}
                            onChange={(e) => updatePersonal('summary', e.target.value)}
                            isDark={isDark}
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
                isDark={isDark}
            />

            <div className="space-y-6">
                {cvData.experiences.length === 0 ? (
                    <div className={`text-center py-12 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl border-2 border-dashed ${isDark ? 'border-gray-700' : 'border-gray-300'} transition-colors duration-300`}>
                        <Briefcase className={`mx-auto ${isDark ? 'text-gray-600' : 'text-gray-400'} mb-3`} size={48} />
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} font-medium mb-2`}>No experience added yet</p>
                        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'} mb-4`}>Click the button below to add your first position</p>
                    </div>
                ) : (
                    cvData.experiences.map((exp) => (
                        <Card key={exp.id} className="relative group hover:border-blue-500 transition-all" isDark={isDark}>
                            <button
                                onClick={() => removeExperience(exp.id)}
                                className={`absolute top-4 right-4 ${isDark ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'} opacity-0 group-hover:opacity-100 transition-opacity`}
                            >
                                <Trash2 size={18} />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <InputGroup label="Job Title" required isDark={isDark}>
                                    <Input
                                        placeholder="e.g. Senior Product Manager"
                                        value={exp.position}
                                        onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                                        isDark={isDark}
                                    />
                                </InputGroup>

                                <InputGroup label="Company" required isDark={isDark}>
                                    <Input
                                        placeholder="e.g. Google"
                                        value={exp.company}
                                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                        isDark={isDark}
                                    />
                                </InputGroup>

                                <InputGroup label="Start Date" isDark={isDark}>
                                    <Input
                                        type="month"
                                        value={exp.startDate}
                                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                        isDark={isDark}
                                    />
                                </InputGroup>

                                <InputGroup label="End Date" isDark={isDark}>
                                    <Input
                                        type="month"
                                        value={exp.endDate}
                                        disabled={exp.current}
                                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                        isDark={isDark}
                                    />
                                </InputGroup>
                            </div>

                            <label className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
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
                    className={`w-full py-4 border-2 border-dashed ${isDark ? 'border-gray-700 text-gray-400 hover:border-blue-500 hover:text-blue-400 hover:bg-gray-800' : 'border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'} rounded-xl font-medium transition-all flex items-center justify-center gap-2`}
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
                isDark={isDark}
            />

            <div className="space-y-6">
                {cvData.education.length === 0 ? (
                    <div className={`text-center py-12 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl border-2 border-dashed ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
                        <GraduationCap className={`mx-auto ${isDark ? 'text-gray-600' : 'text-gray-400'} mb-3`} size={48} />
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} font-medium mb-2`}>No education added yet</p>
                        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'} mb-4`}>Add your academic achievements</p>
                    </div>
                ) : (
                    cvData.education.map((edu) => (
                        <Card key={edu.id} className="relative group hover:border-blue-500 transition-all" isDark={isDark}>
                            <button
                                onClick={() => removeEducation(edu.id)}
                                className={`absolute top-4 right-4 ${isDark ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'} opacity-0 group-hover:opacity-100 transition-opacity`}
                            >
                                <Trash2 size={18} />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputGroup label="Institution" required isDark={isDark}>
                                    <Input
                                        placeholder="e.g. Harvard University"
                                        value={edu.institution}
                                        onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                        isDark={isDark}
                                    />
                                </InputGroup>

                                <InputGroup label="Degree" required isDark={isDark}>
                                    <Input
                                        placeholder="e.g. Bachelor of Science"
                                        value={edu.degree}
                                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                        isDark={isDark}
                                    />
                                </InputGroup>

                                <InputGroup label="Field of Study" isDark={isDark}>
                                    <Input
                                        placeholder="e.g. Computer Science"
                                        value={edu.field}
                                        onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                                        isDark={isDark}
                                    />
                                </InputGroup>

                                <InputGroup label="Graduation Year" isDark={isDark}>
                                    <Input
                                        placeholder="e.g. 2020"
                                        value={edu.endDate}
                                        onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                        isDark={isDark}
                                    />
                                </InputGroup>
                            </div>
                        </Card>
                    ))
                )}

                <button
                    onClick={addEducation}
                    className={`w-full py-4 border-2 border-dashed ${isDark ? 'border-gray-700 text-gray-400 hover:border-blue-500 hover:text-blue-400 hover:bg-gray-800' : 'border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'} rounded-xl font-medium transition-all flex items-center justify-center gap-2`}
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
                isDark={isDark}
            />

            <div className="space-y-4">
                {cvData.skills.map((skill) => (
                    <div key={skill.id} className={`flex items-center gap-3 p-4 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg border ${isDark ? 'border-gray-700 hover:border-blue-500' : 'border-gray-200 hover:border-blue-300'} group transition-all`}>
                        <Input
                            placeholder="e.g. JavaScript, Leadership, Design"
                            value={skill.name}
                            onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                            className="flex-1"
                            isDark={isDark}
                        />
                        <select
                            value={skill.category}
                            onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                            className={`px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 outline-none text-sm`}
                        >
                            <option value="technical">Technical</option>
                            <option value="soft">Soft Skill</option>
                        </select>
                        <button
                            onClick={() => removeSkill(skill.id)}
                            className={`${isDark ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'} transition-colors`}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}

                <button
                    onClick={addSkill}
                    className={`w-full py-3 border-2 border-dashed ${isDark ? 'border-gray-700 text-gray-400 hover:border-blue-500 hover:text-blue-400 hover:bg-gray-800' : 'border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'} rounded-xl font-medium transition-all flex items-center justify-center gap-2`}
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
                isDark={isDark}
            />

            <div className="space-y-4">
                {cvData.languages.map((lang) => (
                    <div key={lang.id} className={`flex items-center gap-3 p-4 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg border ${isDark ? 'border-gray-700 hover:border-blue-500' : 'border-gray-200 hover:border-blue-300'} group transition-all`}>
                        <Input
                            placeholder="e.g. English, Spanish"
                            value={lang.name}
                            onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                            className="flex-1"
                            isDark={isDark}
                        />
                        <select
                            value={lang.proficiency}
                            onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                            className={`px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 outline-none text-sm`}
                        >
                            <option value="basic">Basic</option>
                            <option value="conversational">Conversational</option>
                            <option value="fluent">Fluent</option>
                            <option value="native">Native</option>
                        </select>
                        <button
                            onClick={() => removeLanguage(lang.id)}
                            className={`${isDark ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'} transition-colors`}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}

                <button
                    onClick={addLanguage}
                    className={`w-full py-3 border-2 border-dashed ${isDark ? 'border-gray-700 text-gray-400 hover:border-blue-500 hover:text-blue-400 hover:bg-gray-800' : 'border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'} rounded-xl font-medium transition-all flex items-center justify-center gap-2`}
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
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
            {/* Header */}
            <header className={`sticky top-0 z-50 ${isDark ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-md border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} shadow-sm transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                                CV
                            </div>
                            <div>
                                <h1 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    CV<span className="text-blue-600">Builder</span> Pro
                                </h1>
                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Professional Resume Creator</p>
                            </div>
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center gap-3">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} transition-colors`}
                                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            >
                                {isDark ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            {/* Export Buttons */}
                            <Button
                                variant="secondary"
                                icon={FileDown}
                                onClick={handleExportPDF}
                                isDark={isDark}
                                className="!py-2 !px-3"
                            >
                                PDF
                            </Button>

                            <Button
                                variant="secondary"
                                icon={FileDown}
                                onClick={handleExportDOCX}
                                isDark={isDark}
                                className="!py-2 !px-3"
                            >
                                DOCX
                            </Button>

                            <Button
                                variant="secondary"
                                icon={Save}
                                loading={formState.saving}
                                onClick={handleSave}
                                isDark={isDark}
                            >
                                Save
                            </Button>

                            {/* User Menu */}
                            <div className="relative group">
                                <button className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                                    <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-sm">
                                        {user.name.charAt(0)}
                                    </div>
                                    <ChevronDown size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                                </button>

                                {/* Dropdown */}
                                <div className={`absolute right-0 top-full mt-2 w-56 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-lg border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all`}>
                                    <div className={`px-4 py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                                    </div>
                                    <button className={`w-full px-4 py-2 text-left text-sm ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'} flex items-center gap-2`}>
                                        <Settings size={16} />
                                        Settings
                                    </button>
                                    <button className={`w-full px-4 py-2 text-left text-sm ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'} flex items-center gap-2`}>
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
                            className={`md:hidden p-2 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
                        >
                            {isMobileMenuOpen ? <X size={24} className={isDark ? 'text-white' : 'text-gray-900'} /> : <Menu size={24} className={isDark ? 'text-white' : 'text-gray-900'} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className={`md:hidden border-t ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                        <div className="px-4 py-3 space-y-2">
                            <Button variant="primary" icon={Save} className="w-full" onClick={handleSave} isDark={isDark}>
                                Save CV
                            </Button>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="secondary" icon={FileDown} className="w-full" onClick={handleExportPDF} isDark={isDark}>
                                    PDF
                                </Button>
                                <Button variant="secondary" icon={FileDown} className="w-full" onClick={handleExportDOCX} isDark={isDark}>
                                    DOCX
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Toasts */}
            {formState.success && (
                <Toast
                    type="success"
                    message={formState.success}
                    onClose={() => setFormState(prev => ({ ...prev, success: null }))}
                />
            )}
            {formState.error && (
                <Toast
                    type="error"
                    message={formState.error}
                    onClose={() => setFormState(prev => ({ ...prev, error: null }))}
                />
            )}

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Left Column - Form (2/3 width) */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Tabs */}
                        <Card className="!p-2" isDark={isDark}>
                            <div className="flex overflow-x-auto gap-1 no-scrollbar">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                            ? isDark
                                                ? 'bg-blue-900/50 text-blue-400 shadow-sm ring-1 ring-blue-500'
                                                : 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200'
                                            : isDark
                                                ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
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
                        <Card className="min-h-[600px]" isDark={isDark}>
                            {renderTabContent()}
                        </Card>
                    </div>

                    {/* Right Column - Live Preview Sidebar (1/3 width) */}
                    <div className="space-y-4">
                        {/* Preview Toggle */}
                        <Card isDark={isDark}>
                            <button
                                onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                                className="w-full flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    {isPreviewOpen ? <Eye size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} /> : <EyeOff size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />}
                                    <div className="text-left">
                                        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Live Preview</p>
                                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {isPreviewOpen ? 'Updates in real-time' : 'Click to show'}
                                        </p>
                                    </div>
                                </div>
                                <div className={`w-12 h-6 rounded-full transition-colors ${isPreviewOpen ? 'bg-blue-600' : isDark ? 'bg-gray-700' : 'bg-gray-300'}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform m-0.5 ${isPreviewOpen ? 'translate-x-6' : 'translate-x-0'}`} />
                                </div>
                            </button>
                        </Card>

                        {/* Live Preview Content */}
                        {isPreviewOpen && (
                            <Card isDark={isDark} className="sticky top-24">
                                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                                    <LayoutTemplate size={18} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                                    Preview
                                </h3>
                                <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-100'} p-4 rounded-lg max-h-[600px] overflow-y-auto`}>
                                    <Suspense fallback={<LoadingSkeleton isDark={isDark} />}>
                                        <div className="scale-50 origin-top-left w-[200%]">
                                            <CVPreview
                                                data={cvData}
                                                selectedTemplate={selectedTemplate}
                                                onTemplateChange={setSelectedTemplate}
                                            />
                                        </div>
                                    </Suspense>
                                </div>
                            </Card>
                        )}

                        {/* Templates */}
                        <Card isDark={isDark}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                                    <LayoutTemplate size={18} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                                    Templates
                                </h3>
                                <span className={`text-xs font-medium ${isDark ? 'text-blue-400 bg-blue-900/50' : 'text-blue-600 bg-blue-50'} px-2 py-1 rounded-full`}>
                                    {templates.length} Available
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {templates.map((template) => (
                                    <button
                                        key={template.id}
                                        onClick={() => setSelectedTemplate(template.id as TemplateType)}
                                        className={`relative p-3 rounded-lg border-2 transition-all text-left ${selectedTemplate === template.id
                                            ? 'border-blue-600 ring-2 ring-blue-100 ring-offset-2'
                                            : isDark
                                                ? 'border-gray-700 hover:border-blue-500'
                                                : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className={`text-sm font-medium capitalize ${isDark ? 'text-white' : 'text-gray-700'}`}>
                                                {template.name}
                                            </p>
                                            {selectedTemplate === template.id && (
                                                <CheckCircle size={16} className="text-blue-600" fill="currentColor" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </Card>

                        {/* AI Assistant - Single Comprehensive Card */}
                        <div className={`relative overflow-hidden rounded-xl ${isDark ? 'bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-gray-800 border-purple-700' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-100'} border p-6 shadow-md transition-colors duration-300`}>
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Sparkles size={100} className="text-purple-600" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-3 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm text-purple-600`}>
                                        <Wand2 size={24} />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>AI Assistant</h3>
                                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Powered by AI</p>
                                    </div>
                                </div>

                                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-4 leading-relaxed`}>
                                    Let AI help you craft professional content and analyze your CV for ATS compatibility.
                                </p>

                                {/* AI Action Buttons */}
                                <div className="space-y-3 mb-4">
                                    <Button
                                        variant="primary"
                                        icon={TrendingUp}
                                        onClick={handleAIAnalyze}
                                        loading={formState.loading}
                                        isDark={isDark}
                                        className="w-full"
                                    >
                                        Analyze CV
                                    </Button>

                                    <Button
                                        variant="secondary"
                                        icon={Sparkles}
                                        onClick={() => {/* AI Generate handler from AIGenerator */ }}
                                        isDark={isDark}
                                        className="w-full"
                                    >
                                        Generate Content
                                    </Button>
                                </div>

                                {/* AI Generator Component */}
                                <Suspense fallback={<LoadingSkeleton isDark={isDark} />}>
                                    <AIGenerator
                                        currentData={cvData}
                                        onGenerate={handleAIGenerate}
                                    />
                                </Suspense>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* AI Analysis Modal */}
            {showAIModal && aiAnalysis && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border`}>
                        <div className={`p-6 border-b ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'} flex justify-between items-center`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-3 ${isDark ? 'bg-purple-900/50 text-purple-400' : 'bg-purple-50 text-purple-600'} rounded-xl`}>
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <h3 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>AI Analysis Results</h3>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>ATS Compatibility Score: {aiAnalysis.score}%</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowAIModal(false)}
                                className={`p-2 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} rounded-full transition-colors`}
                            >
                                <X size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Score */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Overall Score</span>
                                    <span className={`text-2xl font-bold ${aiAnalysis.score >= 80 ? 'text-green-600' : aiAnalysis.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                        {aiAnalysis.score}%
                                    </span>
                                </div>
                                <div className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3`}>
                                    <div
                                        className={`h-3 rounded-full transition-all ${aiAnalysis.score >= 80 ? 'bg-green-600' : aiAnalysis.score >= 60 ? 'bg-yellow-600' : 'bg-red-600'}`}
                                        style={{ width: `${aiAnalysis.score}%` }}
                                    />
                                </div>
                            </div>

                            {/* Suggestions */}
                            <div>
                                <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3 flex items-center gap-2`}>
                                    <Sparkles size={18} className="text-purple-600" />
                                    Suggestions for Improvement
                                </h4>
                                <div className="space-y-2">
                                    {aiAnalysis.suggestions.map((suggestion, index) => (
                                        <div key={index} className={`p-3 ${isDark ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg flex items-start gap-2`}>
                                            <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{suggestion}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Keywords */}
                            <div>
                                <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>Detected Keywords</h4>
                                <div className="flex flex-wrap gap-2">
                                    {aiAnalysis.keywords.map((keyword, index) => (
                                        <span key={index} className={`px-3 py-1 ${isDark ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-800'} rounded-full text-sm font-medium`}>
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Missing Info */}
                            <div>
                                <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3 flex items-center gap-2`}>
                                    <AlertCircle size={18} className="text-yellow-600" />
                                    Missing Information
                                </h4>
                                <div className="space-y-2">
                                    {aiAnalysis.missingInfo.map((info, index) => (
                                        <div key={index} className={`p-3 ${isDark ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} rounded-lg border flex items-center gap-2`}>
                                            <AlertCircle size={16} className="text-yellow-600 flex-shrink-0" />
                                            <p className={`text-sm ${isDark ? 'text-yellow-400' : 'text-yellow-800'}`}>{info}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={`p-4 border-t ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'} flex gap-3`}>
                            <Button
                                variant="secondary"
                                icon={Copy}
                                onClick={() => {
                                    navigator.clipboard.writeText(aiAnalysis.suggestions.join('\n'));
                                    setFormState(prev => ({ ...prev, success: 'Recommendations copied to clipboard!' }));
                                }}
                                isDark={isDark}
                                className="flex-1"
                            >
                                Copy Recommendations
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => setShowAIModal(false)}
                                isDark={isDark}
                                className="flex-1"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
