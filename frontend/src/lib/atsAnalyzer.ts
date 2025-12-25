/**
 * Advanced ATS Analyzer - 18 Point Analysis System
 * Analyzes CV data against ATS (Applicant Tracking System) requirements
 */

import type { CVData } from '@/types/cv';

// Metric Categories
export type MetricCategory = 'content' | 'formatting' | 'keywords' | 'impact' | 'completeness';

// Individual Metric Result
export interface ATSMetric {
    id: string;
    name: string;
    nameAr: string;
    nameFr: string;
    category: MetricCategory;
    score: number;        // 0-100
    maxScore: number;     // Always 100
    weight: number;       // Importance weight (1-10)
    status: 'pass' | 'warning' | 'fail';
    message: string;
    messageAr: string;
    messageFr: string;
    tip: string;
    tipAr: string;
    tipFr: string;
    details?: string[];
    detailsAr?: string[];
    detailsFr?: string[];
}

// Full Analysis Result
export interface ATSAnalysisResult {
    overallScore: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    gradeLabel: string;
    gradeLabelAr: string;
    gradeLabelFr: string;
    metrics: ATSMetric[];
    categoryScores: Record<MetricCategory, number>;
    strengths: string[];
    strengthsAr: string[];
    strengthsFr: string[];
    weaknesses: string[];
    weaknessesAr: string[];
    weaknessesFr: string[];
    priorityActions: string[];
    priorityActionsAr: string[];
    priorityActionsFr: string[];
    estimatedPassRate: number;
    timestamp: number;
}

// Action verbs for impact analysis
const STRONG_ACTION_VERBS = {
    en: [
        'achieved', 'accomplished', 'accelerated', 'advanced', 'amplified',
        'built', 'boosted', 'championed', 'consolidated', 'coordinated',
        'created', 'delivered', 'designed', 'developed', 'directed',
        'drove', 'enhanced', 'established', 'exceeded', 'executed',
        'expanded', 'generated', 'grew', 'implemented', 'improved',
        'increased', 'initiated', 'launched', 'led', 'managed',
        'maximized', 'mentored', 'negotiated', 'optimized', 'orchestrated',
        'overhauled', 'pioneered', 'produced', 'reduced', 'restructured',
        'revolutionized', 'scaled', 'spearheaded', 'streamlined', 'strengthened',
        'succeeded', 'surpassed', 'transformed', 'upgraded'
    ],
    fr: [
        'réalisé', 'accompli', 'accéléré', 'avancé', 'amplifié',
        'construit', 'boosté', 'développé', 'consolidé', 'coordonné',
        'créé', 'livré', 'conçu', 'dirigé', 'piloté',
        'amélioré', 'établi', 'dépassé', 'exécuté',
        'étendu', 'généré', 'accru', 'implémenté',
        'augmenté', 'initié', 'lancé', 'dirigé', 'géré',
        'maximisé', 'mentoré', 'négocié', 'optimisé', 'orchestré',
        'révisé', 'pionnier', 'produit', 'réduit', 'restructuré',
        'révolutionné', 'mis à l\'échelle', 'propulsé', 'simplifié', 'renforcé',
        'réussi', 'surpassé', 'transformé', 'mis à jour'
    ],
    ar: [
        'حققت', 'أنجزت', 'سرعت', 'طورت', 'عززت',
        'بنيت', 'دعمت', 'قدت', 'وحدت', 'نسقت',
        'أنشأت', 'سلمت', 'صممت', 'وجهت',
        'حفزت', 'حسنت', 'أسست', 'تجاوزت', 'نفذت',
        'وسعت', 'ولدت', 'نميت', 'طبقت',
        'زدت', 'بادرت', 'أطلقت', 'أدرت',
        'ضاعت', 'أرشدت', 'فاوضت', 'حسنت', 'نظمت',
        'أصلحت', 'ابتكرت', 'أنتجت', 'قللت', 'أعدت هيكلة',
        'أحدثت ثورة', 'وسعت نطاق', 'ترأست', 'بسطت', 'قويت',
        'نجحت', 'تفوقت', 'حولت', 'حدثت'
    ]
};

// Weak/passive words to avoid
const WEAK_WORDS = {
    en: [
        'responsible for', 'duties included', 'helped', 'assisted',
        'worked on', 'participated in', 'was involved', 'contributed to',
        'handled', 'dealt with', 'was in charge of', 'took care of'
    ],
    fr: [
        'responsable de', 'mes tâches incluaient', 'aidé', 'assisté',
        'travaillé sur', 'participé à', 'impliqué', 'contribué à',
        'géré', 'occupé de', 'en charge de'
    ],
    ar: [
        'مسؤول عن', 'المهام شملت', 'ساعدت', 'ساهمت في',
        'عملت على', 'شاركت في', 'كنت مشاركاً', 'تعاملت مع',
        'توليت مسؤولية'
    ]
};

// Quantifiable metrics patterns
const METRICS_PATTERNS = [
    /\d+%/,                    // Percentages
    /\$[\d,]+/,                // Dollar amounts
    /€[\d,]+/,                 // Euro amounts
    /[\d,]+\s*(MAD|DH|درهم)/i, // Moroccan Dirhams
    /\d+[KkMm]\+?/,            // K/M abbreviations
    /\d+\s*(users|clients|customers|employees|projects|teams|مستخدم|عميل|موظف|مشروع|فريق|utilisateurs|clients|employés|projets|équipes)/i,
    /\d+x/i,                   // Multipliers
    /\d+\s*(hours|days|weeks|months|years|ساعة|يوم|أسبوع|شهر|عام|سنة|heures|jours|semaines|mois|ans)/i,
    /(increased|زدت|نسبة|augmenté).*by\s*\d+/i,
    /(reduced|قللت|réduit).*by\s*\d+/i,
    /(saved|وفرت|économisé).*\d+/i,
    /(grew|نميت|accru).*\d+/i
];

// ATS-friendly section headers
const STANDARD_SECTIONS = [
    'summary', 'objective', 'experience', 'work experience', 'employment',
    'education', 'skills', 'certifications', 'projects', 'languages',
    'ملخص', 'هدف', 'خبرة', 'خبرة عمل', 'توظيف', 'تعليم', 'مهارات', 'شهادات', 'مشاريع', 'لغات',
    'résumé', 'objectif', 'expérience', 'éducation', 'compétences', 'certifications', 'projets', 'langues'
];

/**
 * Main ATS Analysis Function
 */
export function analyzeATS(cvData: CVData, jobDescription?: string): ATSAnalysisResult {
    const metrics: ATSMetric[] = [];

    // ============ CONTENT METRICS ============

    // 1. Contact Information Completeness
    metrics.push(analyzeContactInfo(cvData));

    // 2. Professional Summary Quality
    metrics.push(analyzeSummary(cvData));

    // 3. Work Experience Depth
    metrics.push(analyzeExperienceDepth(cvData));

    // 4. Education Section
    metrics.push(analyzeEducation(cvData));

    // 5. Skills Section
    metrics.push(analyzeSkills(cvData));

    // ============ IMPACT METRICS ============

    // 6. Action Verbs Usage
    metrics.push(analyzeActionVerbs(cvData));

    // 7. Quantifiable Achievements
    metrics.push(analyzeQuantifiableAchievements(cvData));

    // 8. Passive Language Detection
    metrics.push(analyzePassiveLanguage(cvData));

    // 9. Achievement vs Responsibility Ratio
    metrics.push(analyzeAchievementRatio(cvData));

    // ============ KEYWORD METRICS ============

    // 10. Keyword Density
    metrics.push(analyzeKeywordDensity(cvData, jobDescription));

    // 11. Industry Keywords
    metrics.push(analyzeIndustryKeywords(cvData));

    // 12. Skills-Experience Alignment
    metrics.push(analyzeSkillsAlignment(cvData));

    // ============ FORMATTING METRICS ============

    // 13. Content Length Optimization
    metrics.push(analyzeContentLength(cvData));

    // 14. Section Balance
    metrics.push(analyzeSectionBalance(cvData));

    // 15. Consistency Check
    metrics.push(analyzeConsistency(cvData));

    // ============ COMPLETENESS METRICS ============

    // 16. Profile Completeness
    metrics.push(analyzeProfileCompleteness(cvData));

    // 17. Date Formatting
    metrics.push(analyzeDateFormatting(cvData));

    // 18. LinkedIn/Portfolio Presence
    metrics.push(analyzeOnlinePresence(cvData));

    // Calculate overall score (weighted average)
    const totalWeight = metrics.reduce((sum, m) => sum + m.weight, 0);
    const weightedScore = metrics.reduce((sum, m) => sum + (m.score * m.weight), 0);
    const overallScore = Math.round(weightedScore / totalWeight);

    // Extract insights
    const strengths = metrics
        .filter(m => m.status === 'pass')
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 5)
        .map(m => m.message);

    const weaknesses = metrics
        .filter(m => m.status === 'fail')
        .sort((a, b) => b.weight - a.weight)
        .map(m => m.message);

    const priorityActions = metrics
        .filter(m => m.status === 'fail' || m.status === 'warning')
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 5)
        .map(m => m.tip);

    const strengthsFr = metrics
        .filter(m => m.status === 'pass')
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 5)
        .map(m => m.messageFr);

    const weaknessesFr = metrics
        .filter(m => m.status === 'fail')
        .sort((a, b) => b.weight - a.weight)
        .map(m => m.messageFr);

    const priorityActionsFr = metrics
        .filter(m => m.status === 'fail' || m.status === 'warning')
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 5)
        .map(m => m.tipFr);

    const strengthsAr = metrics
        .filter(m => m.status === 'pass')
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 5)
        .map(m => m.messageAr);

    const weaknessesAr = metrics
        .filter(m => m.status === 'fail')
        .sort((a, b) => b.weight - a.weight)
        .map(m => m.messageAr);

    const priorityActionsAr = metrics
        .filter(m => m.status === 'fail' || m.status === 'warning')
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 5)
        .map(m => m.tipAr);

    // Calculate category scores
    const categoryScores = calculateCategoryScores(metrics);

    // Determine grade
    const { grade, gradeLabel, gradeLabelAr, gradeLabelFr } = getGrade(overallScore);

    // Estimate pass rate (simplified model)
    const estimatedPassRate = Math.min(95, Math.max(5, overallScore - 10));

    return {
        overallScore,
        grade,
        gradeLabel,
        gradeLabelAr,
        gradeLabelFr,
        metrics,
        categoryScores,
        strengths,
        strengthsAr,
        strengthsFr,
        weaknesses,
        weaknessesAr,
        weaknessesFr,
        priorityActions,
        priorityActionsAr,
        priorityActionsFr,
        estimatedPassRate,
        timestamp: Date.now()
    };
}

// ============ INDIVIDUAL METRIC ANALYZERS ============

function analyzeContactInfo(cvData: CVData): ATSMetric {
    const { personalInfo } = cvData;
    let score = 0;
    const details: string[] = [];
    const detailsAr: string[] = [];
    const detailsFr: string[] = [];

    if (personalInfo.fullName?.trim()) {
        score += 25;
        details.push('✓ Full name');
        detailsAr.push('✓ الاسم الكامل');
        detailsFr.push('✓ Nom complet');
    } else {
        details.push('✗ Missing full name');
        detailsAr.push('✗ الاسم الكامل مفقود');
        detailsFr.push('✗ Nom complet manquant');
    }

    if (personalInfo.email?.includes('@')) {
        score += 25;
        details.push('✓ Email address');
        detailsAr.push('✓ البريد الإلكتروني');
        detailsFr.push('✓ Adresse e-mail');
    } else {
        details.push('✗ Missing or invalid email');
        detailsAr.push('✗ بريد إلكتروني مفقود أو غير صالح');
        detailsFr.push('✗ E-mail manquant ou invalide');
    }

    if (personalInfo.phone?.trim()) {
        score += 25;
        details.push('✓ Phone number');
        detailsAr.push('✓ رقم الهاتف');
        detailsFr.push('✓ Numéro de téléphone');
    } else {
        details.push('✗ Missing phone');
        detailsAr.push('✗ رقم الهاتف مفقود');
        detailsFr.push('✗ Téléphone manquant');
    }

    if (personalInfo.address?.trim()) {
        score += 15;
        details.push('✓ Location');
        detailsAr.push('✓ الموقع');
        detailsFr.push('✓ Localisation');
    } else {
        details.push('○ Location (optional)');
        detailsAr.push('○ الموقع (اختياري)');
        detailsFr.push('○ Localisation (optionnel)');
    }

    if (personalInfo.profession?.trim()) {
        score += 10;
        details.push('✓ Job title');
        detailsAr.push('✓ المسمى الوظيفي');
        detailsFr.push('✓ Titre du poste');
    } else {
        details.push('○ Job title');
        detailsAr.push('○ المسمى الوظيفي');
        detailsFr.push('○ Titre du poste');
    }

    return {
        id: 'contact-info',
        name: 'Contact Information',
        nameAr: 'معلومات الاتصال',
        nameFr: 'Informations de Contact',
        category: 'completeness',
        score: Math.min(100, score),
        maxScore: 100,
        weight: 10,
        status: score >= 75 ? 'pass' : score >= 50 ? 'warning' : 'fail',
        message: score >= 75 ? 'Complete contact information' : 'Contact information incomplete',
        messageAr: score >= 75 ? 'معلومات الاتصال مكتملة' : 'معلومات الاتصال غير مكتملة',
        messageFr: score >= 75 ? 'Informations de contact complètes' : 'Informations de contact incomplètes',
        tip: 'Include full name, professional email, phone number, and city/country',
        tipAr: 'أضف الاسم الكامل، البريد الإلكتروني المهني، رقم الهاتف، والمدينة',
        tipFr: 'Incluez nom complet, email pro, téléphone et ville',
        details,
        detailsAr,
        detailsFr
    };
}

function analyzeSummary(cvData: CVData): ATSMetric {
    const summary = cvData.summary || '';
    const wordCount = summary.split(/\s+/).filter(w => w.length > 0).length;
    let score = 0;
    const details: string[] = [];
    const detailsAr: string[] = [];
    const detailsFr: string[] = [];

    // Length check (ideal: 50-150 words)
    if (wordCount >= 50 && wordCount <= 150) {
        score += 40;
        details.push(`✓ Good length (${wordCount} words)`);
        detailsAr.push(`✓ طول جيد (${wordCount} كلمة)`);
        detailsFr.push(`✓ Bonne longueur (${wordCount} mots)`);
    } else if (wordCount >= 30 && wordCount <= 200) {
        score += 25;
        details.push(`○ Acceptable length (${wordCount} words)`);
        detailsAr.push(`○ طول مقبول (${wordCount} كلمة)`);
        detailsFr.push(`○ Longueur acceptable (${wordCount} mots)`);
    } else if (wordCount > 0) {
        score += 10;
        const msg = wordCount < 30 ? 'Too short' : 'Too long';
        const msgAr = wordCount < 30 ? 'قصير جداً' : 'طويل جداً';
        const msgFr = wordCount < 30 ? 'Trop court' : 'Trop long';
        details.push(`✗ ${msg} (${wordCount} words)`);
        detailsAr.push(`✗ ${msgAr} (${wordCount} كلمة)`);
        detailsFr.push(`✗ ${msgFr} (${wordCount} mots)`);
    } else {
        details.push('✗ Missing summary');
        detailsAr.push('✗ ملخص مفقود');
        detailsFr.push('✗ Résumé manquant');
    }

    // Action verbs in summary
    const allActionVerbs = [...STRONG_ACTION_VERBS.en, ...STRONG_ACTION_VERBS.fr, ...STRONG_ACTION_VERBS.ar];
    const hasActionVerbs = allActionVerbs.some(verb =>
        summary.toLowerCase().includes(verb.toLowerCase())
    );
    if (hasActionVerbs) {
        score += 20;
        details.push('✓ Uses action verbs');
        detailsAr.push('✓ يستخدم أفعال حركية');
        detailsFr.push('✓ Utilise des verbes d\'action');
    }

    // Contains profession/role
    if (cvData.personalInfo.profession &&
        summary.toLowerCase().includes(cvData.personalInfo.profession.toLowerCase().split(' ')[0])) {
        score += 20;
        details.push('✓ Mentions target role');
        detailsAr.push('✓ يذكر الدور المستهدف');
        detailsFr.push('✓ Mentionne le rôle cible');
    }

    // Contains quantifiable achievements
    const hasMetrics = METRICS_PATTERNS.some(pattern => pattern.test(summary));
    if (hasMetrics) {
        score += 20;
        details.push('✓ Includes metrics/numbers');
        detailsAr.push('✓ يتضمن مقاييس/أرقام');
        detailsFr.push('✓ Inclut des chiffres/métriques');
    } else {
        details.push('○ Consider adding metrics');
        detailsAr.push('○ فكر في إضافة أرقام وإنجازات');
        detailsFr.push('○ Pensez à ajouter des métriques');
    }

    return {
        id: 'summary-quality',
        name: 'Professional Summary',
        nameAr: 'الملخص المهني',
        nameFr: 'Résumé Professionnel',
        category: 'content',
        score: Math.min(100, score),
        maxScore: 100,
        weight: 8,
        status: score >= 60 ? 'pass' : score >= 30 ? 'warning' : 'fail',
        message: score >= 60 ? 'Strong professional summary' : 'Summary needs improvement',
        messageAr: score >= 60 ? 'ملخص مهني قوي' : 'الملخص يحتاج تحسين',
        messageFr: score >= 60 ? 'Résumé professionnel solide' : 'Le résumé doit être amélioré',
        tip: 'Write a 50-150 word summary highlighting your key achievements with numbers',
        tipAr: 'اكتب ملخصاً من 50-150 كلمة يسلط الضوء على إنجازاتك بأرقام',
        tipFr: 'Rédigez un résumé de 50-150 mots soulignant vos succès avec des chiffres',
        details,
        detailsAr,
        detailsFr
    };
}

function analyzeExperienceDepth(cvData: CVData): ATSMetric {
    const experiences = cvData.experiences || [];
    let score = 0;
    const details: string[] = [];
    const detailsAr: string[] = [];
    const detailsFr: string[] = [];

    // Number of experiences
    if (experiences.length >= 3) {
        score += 30;
        details.push(`✓ ${experiences.length} work experiences`);
        detailsAr.push(`✓ ${experiences.length} خبرات عمل`);
        detailsFr.push(`✓ ${experiences.length} expériences professionnelles`);
    } else if (experiences.length >= 1) {
        score += 15;
        details.push(`○ Only ${experiences.length} experience(s)`);
        detailsAr.push(`○ فقط ${experiences.length} خبرة(خبرات)`);
        detailsFr.push(`○ Seulement ${experiences.length} expérience(s)`);
    } else {
        details.push('✗ No work experience listed');
        detailsAr.push('✗ لم يتم إدراج أي خبرة عمل');
        detailsFr.push('✗ Aucune expérience professionnelle');
    }

    // Description quality
    const avgDescLength = experiences.reduce((sum, exp) =>
        sum + (exp.description?.split(/\s+/).length || 0), 0) / (experiences.length || 1);

    if (avgDescLength >= 30) {
        score += 35;
        details.push('✓ Detailed descriptions');
        detailsAr.push('✓ أوصاف تفصيلية');
        detailsFr.push('✓ Descriptions détaillées');
    } else if (avgDescLength >= 15) {
        score += 20;
        details.push('○ Descriptions could be more detailed');
        detailsAr.push('○ يمكن أن تكون الأوصاف أكثر تفصيلاً');
        detailsFr.push('○ Les descriptions pourraient être plus détaillées');
    } else if (experiences.length > 0) {
        details.push('✗ Descriptions too brief');
        detailsAr.push('✗ الأوصاف موجزة جداً');
        detailsFr.push('✗ Descriptions trop brèves');
    }

    // Company and position filled
    const completedExps = experiences.filter(e => e.company && e.position).length;
    if (completedExps === experiences.length && experiences.length > 0) {
        score += 20;
        details.push('✓ All positions have company/title');
        detailsAr.push('✓ جميع المناصب تحتوي على الشركة/المسمى');
        detailsFr.push('✓ Tous les postes ont une entreprise/titre');
    } else if (completedExps > 0) {
        score += 10;
        details.push('○ Some positions missing details');
        detailsAr.push('○ بعض المناصب تفتقد لبعض التفاصيل');
        detailsFr.push('○ Certains postes manquent de détails');
    }

    // Date ranges
    const datedExps = experiences.filter(e => e.startDate).length;
    if (datedExps === experiences.length && experiences.length > 0) {
        score += 15;
        details.push('✓ All positions have dates');
        detailsAr.push('✓ جميع المناصب تحتوي على تواريخ');
        detailsFr.push('✓ Tous les postes ont des dates');
    }

    return {
        id: 'experience-depth',
        name: 'Work Experience',
        nameAr: 'الخبرة المهنية',
        nameFr: 'Expérience Professionnelle',
        category: 'content',
        score: Math.min(100, score),
        maxScore: 100,
        weight: 10,
        status: score >= 60 ? 'pass' : score >= 30 ? 'warning' : 'fail',
        message: score >= 60 ? 'Solid work experience section' : 'Work experience needs more detail',
        messageAr: score >= 60 ? 'قسم الخبرة المهنية جيد' : 'قسم الخبرة يحتاج المزيد من التفاصيل',
        messageFr: score >= 60 ? 'Section expérience solide' : 'L\'expérience manque de détails',
        tip: 'Include 2-4 recent positions with detailed bullet points (3-5 per role)',
        tipAr: 'أضف 2-4 وظائف حديثة مع نقاط تفصيلية (3-5 لكل وظيفة)',
        tipFr: 'Incluez 2 à 4 postes récents avec 3 à 5 points détaillés par rôle',
        details,
        detailsAr,
        detailsFr
    };
}

function analyzeEducation(cvData: CVData): ATSMetric {
    const education = cvData.education || [];
    let score = 0;
    const details: string[] = [];
    const detailsAr: string[] = [];
    const detailsFr: string[] = [];

    if (education.length >= 1) {
        score += 50;
        details.push(`✓ ${education.length} education entry(s)`);
        detailsAr.push(`✓ ${education.length} إدخالات تعليم`);
        detailsFr.push(`✓ ${education.length} entrée(s) d'éducation`);

        // Check completeness
        const complete = education.filter(e => e.institution && e.degree).length;
        if (complete === education.length) {
            score += 30;
            details.push('✓ All entries complete');
            detailsAr.push('✓ جميع الإدخالات مكتملة');
            detailsFr.push('✓ Toutes les entrées sont complètes');
        } else {
            score += 15;
            details.push('○ Some entries incomplete');
            detailsAr.push('○ بعض الإدخالات غير مكتملة');
            detailsFr.push('○ Certaines entrées sont incomplètes');
        }

        // Graduation dates
        const dated = education.filter(e => e.graduationYear || e.endDate).length;
        if (dated === education.length) {
            score += 20;
            details.push('✓ Graduation dates included');
            detailsAr.push('✓ تواريخ التخرج مدرجة');
            detailsFr.push('✓ Dates de l\'obtention du diplôme incluses');
        }
    } else {
        details.push('✗ No education listed');
        detailsAr.push('✗ لم يتم إدراج أي تعليم');
        detailsFr.push('✗ Aucune formation listée');
    }

    return {
        id: 'education',
        name: 'Education',
        nameAr: 'التعليم',
        nameFr: 'Éducation',
        category: 'completeness',
        score: Math.min(100, score),
        maxScore: 100,
        weight: 6,
        status: score >= 50 ? 'pass' : score >= 25 ? 'warning' : 'fail',
        message: score >= 50 ? 'Education section complete' : 'Add education details',
        messageAr: score >= 50 ? 'قسم التعليم مكتمل' : 'أضف تفاصيل التعليم',
        messageFr: score >= 50 ? 'Section éducation complète' : 'Ajoutez des détails sur vos études',
        tip: 'Include degree, institution name, and graduation year',
        tipAr: 'أضف الشهادة، اسم المؤسسة، وسنة التخرج',
        tipFr: 'Incluez diplôme, nom de l\'établissement et année d\'obtention',
        details,
        detailsAr,
        detailsFr
    };
}

function analyzeSkills(cvData: CVData): ATSMetric {
    const skills = cvData.skills || [];
    let score = 0;
    const details: string[] = [];
    const detailsAr: string[] = [];
    const detailsFr: string[] = [];

    // Number of skills (ideal: 8-15)
    if (skills.length >= 8 && skills.length <= 15) {
        score += 50;
        details.push(`✓ Good skill count (${skills.length})`);
        detailsAr.push(`✓ عدد مهارات جيد (${skills.length})`);
        detailsFr.push(`✓ Bon nombre de compétences (${skills.length})`);
    } else if (skills.length >= 5) {
        score += 30;
        details.push(`○ ${skills.length} skills (aim for 8-15)`);
        detailsAr.push(`○ ${skills.length} مهارات (استهدف 8-15)`);
        detailsFr.push(`○ ${skills.length} compétences (visez 8-15)`);
    } else if (skills.length > 0) {
        score += 15;
        details.push(`✗ Only ${skills.length} skills listed`);
        detailsAr.push(`✗ تم إدراج ${skills.length} مهارات فقط`);
        detailsFr.push(`✗ Seulement ${skills.length} compétences listées`);
    } else {
        details.push('✗ No skills listed');
        detailsAr.push('✗ لم يتم إدراج أي مهارات');
        detailsFr.push('✗ Aucune compétence listée');
    }

    // Skill categories
    const technical = skills.filter(s => s.category === 'technical').length;
    const soft = skills.filter(s => s.category === 'soft').length;

    if (technical >= 3 && soft >= 2) {
        score += 30;
        details.push('✓ Good mix of technical & soft skills');
        detailsAr.push('✓ مزيج جيد من المهارات التقنية والناعمة');
        detailsFr.push('✓ Bon mélange de compétences techniques et humaines');
    } else if (technical >= 2 || soft >= 2) {
        score += 15;
        details.push('○ Add more skill variety');
        detailsAr.push('○ أضف المزيد من تنوع المهارات');
        detailsFr.push('○ Ajoutez plus de variété de compétences');
    }

    // Skill levels defined
    const withLevels = skills.filter(s => s.level > 0).length;
    if (withLevels === skills.length && skills.length > 0) {
        score += 20;
        details.push('✓ All skills have proficiency levels');
        detailsAr.push('✓ جميع المهارات تحتوي على مستويات إتقان');
        detailsFr.push('✓ Toutes les compétences ont des niveaux de maîtrise');
    }

    return {
        id: 'skills',
        name: 'Skills Section',
        nameAr: 'قسم المهارات',
        nameFr: 'Section Compétences',
        category: 'content',
        score: Math.min(100, score),
        maxScore: 100,
        weight: 8,
        status: score >= 50 ? 'pass' : score >= 25 ? 'warning' : 'fail',
        message: score >= 50 ? 'Strong skills section' : 'Expand your skills section',
        messageAr: score >= 50 ? 'قسم مهارات قوي' : 'وسّع قسم المهارات',
        messageFr: score >= 50 ? 'Section compétences solide' : 'Élargissez votre section compétences',
        tip: 'List 8-15 relevant skills with a mix of technical and soft skills',
        tipAr: 'أضف 8-15 مهارة ذات صلة مع مزيج من المهارات التقنية والناعمة',
        tipFr: 'Listez 8 à 15 compétences variées (techniques et relationnelles)',
        details,
        detailsAr,
        detailsFr
    };
}

function analyzeActionVerbs(cvData: CVData): ATSMetric {
    const allText = getAllDescriptions(cvData);
    const words = allText.toLowerCase().split(/\s+/);

    const allStrongActionVerbs = [...STRONG_ACTION_VERBS.en, ...STRONG_ACTION_VERBS.fr, ...STRONG_ACTION_VERBS.ar];
    const actionVerbCount = allStrongActionVerbs.filter(verb =>
        words.includes(verb.toLowerCase())
    ).length;

    const experienceCount = cvData.experiences?.length || 0;
    const idealCount = Math.max(3, experienceCount * 2);

    const score = Math.min(100, Math.round((actionVerbCount / idealCount) * 100));

    return {
        id: 'action-verbs',
        name: 'Action Verbs',
        nameAr: 'أفعال القوة',
        nameFr: 'Verbes d\'Action',
        category: 'impact',
        score,
        maxScore: 100,
        weight: 7,
        status: score >= 60 ? 'pass' : score >= 30 ? 'warning' : 'fail',
        message: score >= 60 ? `Strong action verbs used (${actionVerbCount} found)` : 'Need more action verbs',
        messageAr: score >= 60 ? `أفعال قوة ممتازة (${actionVerbCount} موجودة)` : 'تحتاج المزيد من أفعال القوة',
        messageFr: score >= 60 ? `Bons verbes d'action utilisés (${actionVerbCount} trouvés)` : 'Utilisez plus de verbes d\'action',
        tip: 'Start bullet points with verbs like: Led, Developed, Achieved, Increased, Built',
        tipAr: 'ابدأ النقاط بأفعال مثل: قاد، طوّر، حقق، زاد، بنى',
        tipFr: 'Commencez vos points par : Dirigé, Développé, Réalisé, Augmenté',
        details: [`Found ${actionVerbCount} action verbs (target: ${idealCount}+)`],
        detailsAr: [`تم العثور على ${actionVerbCount} أفعال قوة (المستهدف: ${idealCount}+)`],
        detailsFr: [`${actionVerbCount} verbes d'action trouvés (cible : ${idealCount}+)`]
    };
}

function analyzeQuantifiableAchievements(cvData: CVData): ATSMetric {
    const allText = getAllDescriptions(cvData);

    let metricsFound = 0;
    METRICS_PATTERNS.forEach(pattern => {
        const matches = allText.match(pattern);
        if (matches) metricsFound += matches.length;
    });

    const experienceCount = cvData.experiences?.length || 0;
    const idealCount = Math.max(2, experienceCount);

    const score = Math.min(100, Math.round((metricsFound / idealCount) * 100));

    return {
        id: 'quantifiable',
        name: 'Quantifiable Results',
        nameAr: 'نتائج قابلة للقياس',
        nameFr: 'Résultats Quantifiables',
        category: 'impact',
        score,
        maxScore: 100,
        weight: 9,
        status: score >= 60 ? 'pass' : score >= 30 ? 'warning' : 'fail',
        message: score >= 60 ? `Great use of metrics (${metricsFound} found)` : 'Add more numbers and percentages',
        messageAr: score >= 60 ? `استخدام ممتاز للأرقام (${metricsFound} موجودة)` : 'أضف المزيد من الأرقام والنسب',
        messageFr: score >= 60 ? `Bon usage des mesures (${metricsFound} trouvées)` : 'Ajoutez plus de chiffres et pourcentages',
        tip: 'Add percentages, dollar amounts, team sizes, and time savings to achievements',
        tipAr: 'أضف نسب مئوية، مبالغ مالية، أحجام فرق، وتوفير الوقت للإنجازات',
        tipFr: 'Ajoutez pourcentages, budgets, tailles d\'équipe et gains de temps',
        details: [`Found ${metricsFound} quantifiable metrics (target: ${idealCount}+ per experience)`],
        detailsAr: [`تم العثور على ${metricsFound} مقاييس قابلة للقياس (المستهدف: ${idealCount}+ لكل خبرة)`],
        detailsFr: [`${metricsFound} mesures trouvées (cible : ${idealCount}+ par expérience)`]
    };
}

function analyzePassiveLanguage(cvData: CVData): ATSMetric {
    const allText = getAllDescriptions(cvData).toLowerCase();

    const allWeakWords = [...WEAK_WORDS.en, ...WEAK_WORDS.fr, ...WEAK_WORDS.ar];
    const weakWordsFound = allWeakWords.filter(phrase =>
        allText.includes(phrase.toLowerCase())
    );

    const score = weakWordsFound.length === 0 ? 100 :
        weakWordsFound.length <= 2 ? 70 :
            weakWordsFound.length <= 5 ? 40 : 20;

    return {
        id: 'passive-language',
        name: 'Active Voice',
        nameAr: 'الصوت النشط',
        nameFr: 'Voix Active',
        category: 'impact',
        score,
        maxScore: 100,
        weight: 5,
        status: score >= 70 ? 'pass' : score >= 40 ? 'warning' : 'fail',
        message: score >= 70 ? 'Good use of active voice' : 'Reduce passive phrases',
        messageAr: score >= 70 ? 'استخدام جيد للصوت النشط' : 'قلل العبارات السلبية',
        messageFr: score >= 70 ? 'Bonne utilisation de la voix active' : 'Réduisez les phrases passives',
        tip: 'Replace "Responsible for..." with "Led...", "Managed...", "Delivered..."',
        tipAr: 'استبدل "مسؤول عن..." بـ "قاد..."، "أدار..."، "نفّذ..."',
        tipFr: 'Remplacez "Responsable de..." par "Dirigé...", "Géré...", "Réalisé..."',
        details: weakWordsFound.length > 0
            ? [`Found weak phrases: ${weakWordsFound.slice(0, 3).join(', ')}`]
            : ['No passive language detected'],
        detailsAr: weakWordsFound.length > 0
            ? [`تم العثور على عبارات ضعيفة: ${weakWordsFound.slice(0, 3).join(', ')}`]
            : ['لم يتم الكشف عن لغة سلبية'],
        detailsFr: weakWordsFound.length > 0
            ? [`Phrases passives trouvées : ${weakWordsFound.slice(0, 3).join(', ')}`]
            : ['Aucun langage passif détecté']
    };
}

function analyzeAchievementRatio(cvData: CVData): ATSMetric {
    const allText = getAllDescriptions(cvData).toLowerCase();

    // Achievement indicators (expanded for multi-language)
    const achievementWords = [
        'achieved', 'increased', 'decreased', 'reduced', 'improved', 'generated', 'saved', 'delivered', 'launched', 'created', 'built', 'won',
        'حققت', 'زدت', 'قللت', 'حسنت', 'ولدت', 'وفرت', 'سلمت', 'أطلقت', 'أنشأت', 'بنيت', 'فزت',
        'réalisé', 'augmenté', 'diminué', 'réduit', 'amélioré', 'généré', 'économisé', 'livré', 'lancé', 'créé', 'construit', 'gagné'
    ];

    // Responsibility indicators
    const responsibilityWords = [
        'responsible', 'duties', 'managed', 'handled', 'maintained',
        'مسؤول', 'مهام', 'أشرفت', 'تعاملت', 'حافظت',
        'responsable', 'tâches', 'géré', 'occupé', 'maintenu'
    ];

    let achievementCount = 0;
    let responsibilityCount = 0;

    achievementWords.forEach(word => {
        const matches = allText.match(new RegExp(word, 'gi'));
        if (matches) achievementCount += matches.length;
    });

    responsibilityWords.forEach(word => {
        const matches = allText.match(new RegExp(word, 'gi'));
        if (matches) responsibilityCount += matches.length;
    });

    const total = achievementCount + responsibilityCount;
    const ratio = total > 0 ? (achievementCount / total) * 100 : 50;
    const score = Math.min(100, Math.round(ratio));

    return {
        id: 'achievement-ratio',
        name: 'Achievement Focus',
        nameAr: 'التركيز على الإنجازات',
        nameFr: 'Focus sur les Réalisations',
        category: 'impact',
        score,
        maxScore: 100,
        weight: 8,
        status: score >= 60 ? 'pass' : score >= 30 ? 'warning' : 'fail',
        message: score >= 60 ? 'Strong achievement-oriented content' : 'Focus more on results than duties',
        messageAr: score >= 60 ? 'محتوى يركز على الإنجازات بقوة' : 'ركز أكثر على النتائج بدلاً من المهام',
        messageFr: score >= 60 ? 'Contenu fortement orienté résultats' : 'Mettez plus l\'accent sur les résultats que sur les tâches',
        tip: 'For every duty listed, try to add a result or achievement',
        tipAr: 'لكل مهمة تذكرها، حاول إضافة نتيجة أو إنجاز',
        tipFr: 'Pour chaque tâche listée, essayez d\'ajouter un résultat ou un succès',
        details: [`Achievement vs Responsibility ratio: ${Math.round(ratio)}%`],
        detailsAr: [`نسبة الإنجاز مقارنة بالمسؤولية: ${Math.round(ratio)}%`],
        detailsFr: [`Ratio Réalisation vs Responsabilité : ${Math.round(ratio)}%`]
    };
}

function analyzeKeywordDensity(cvData: CVData, jobDescription?: string): ATSMetric {
    if (!jobDescription) {
        return {
            id: 'keyword-density',
            name: 'Keyword Density',
            nameAr: 'كثافة الكلمات الدالة',
            nameFr: 'Densité de Mots-clés',
            category: 'keywords',
            score: 0,
            maxScore: 100,
            weight: 9,
            status: 'warning',
            message: 'Provide a job description for keyword analysis',
            messageAr: 'أضف وصفاً وظيفياً لتحليل الكلمات الدالة',
            messageFr: 'Fournissez une description de poste pour l\'analyse',
            tip: 'Paste a job description to see how well your CV matches the requirements',
            tipAr: 'الصق وصفاً وظيفياً لترى مدى مطابقة سيرتك الذاتية للمتطلبات',
            tipFr: 'Collez une description de poste pour voir la correspondance',
        };
    }

    const cvText = getAllText(cvData).toLowerCase();
    const jdWords = jobDescription.toLowerCase().split(/\W+/).filter(w => w.length > 4);

    // Basic word frequency analysis
    const wordCounts: Record<string, number> = {};
    jdWords.forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    const topKeywords = Object.entries(wordCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(e => e[0]);

    const foundKeywords = topKeywords.filter(keyword => cvText.includes(keyword));
    const score = Math.round((foundKeywords.length / topKeywords.length) * 100);

    return {
        id: 'keyword-density',
        name: 'Keyword Optimization',
        nameAr: 'تحسين الكلمات الدالة',
        nameFr: 'Optimisation des Mots-clés',
        category: 'keywords',
        score,
        maxScore: 100,
        weight: 9,
        status: score >= 70 ? 'pass' : score >= 40 ? 'warning' : 'fail',
        message: score >= 70 ? 'Good keyword alignment' : 'CV lacks important job keywords',
        messageAr: score >= 70 ? 'مطابقة جيدة للكلمات الدالة' : 'السيرة الذاتية تفتقر للكلمات الدالة المهمة',
        messageFr: score >= 70 ? 'Bonne correspondance des mots-clés' : 'Le CV manque de mots-clés importants',
        tip: `Include these keywords: ${topKeywords.slice(0, 5).join(', ')}`,
        tipAr: `أدرج هذه الكلمات الدالة: ${topKeywords.slice(0, 5).join(', ')}`,
        tipFr: `Incluez ces mots-clés : ${topKeywords.slice(0, 5).join(', ')}`,
        details: [`Matched ${foundKeywords.length} out of ${topKeywords.length} key terms`],
        detailsAr: [`تمت مطابقة ${foundKeywords.length} من أصل ${topKeywords.length} مصطلحات رئيسية`],
        detailsFr: [`${foundKeywords.length} termes clés sur ${topKeywords.length} correspondent`]
    };
}

function analyzeIndustryKeywords(cvData: CVData): ATSMetric {
    const allText = getAllText(cvData).toLowerCase();
    const industries = [
        { name: 'Tech', keywords: ['software', 'cloud', 'data', 'agile', 'api', 'security', 'framework', 'database'] },
        { name: 'Management', keywords: ['leadership', 'strategy', 'operations', 'budget', 'team', 'stakeholder', 'project', 'planning'] },
        { name: 'Marketing', keywords: ['seo', 'content', 'campaign', 'analytics', 'brand', 'social media', 'growth', 'digital'] },
        { name: 'Sales', keywords: ['crm', 'revenue', 'pipeline', 'negotiation', 'closing', 'prospecting', 'quota', 'client'] }
    ];

    let foundCount = 0;
    industries.forEach(ind => {
        ind.keywords.forEach(kw => {
            if (allText.includes(kw)) foundCount++;
        });
    });

    const score = Math.min(100, foundCount * 10);

    return {
        id: 'industry-keywords',
        name: 'Industry Vocabulary',
        nameAr: 'مصطلحات المجال',
        nameFr: 'Vocabulaire du Secteur',
        category: 'keywords',
        score,
        maxScore: 100,
        weight: 7,
        status: score >= 60 ? 'pass' : score >= 30 ? 'warning' : 'fail',
        message: score >= 60 ? 'Good use of industry terms' : 'Add more industry-specific terminology',
        messageAr: score >= 60 ? 'استخدام جيد لمصطلحات المجال' : 'أضف المزيد من المصطلحات الخاصة بمجالك',
        messageFr: score >= 60 ? 'Bonne utilisation des termes du secteur' : 'Ajoutez plus de terminologie spécifique',
        tip: 'Use standard terminology for your target role and industry',
        tipAr: 'استخدم المصطلحات القياسية للدور المستهدف ومجال عملك',
        tipFr: 'Utilisez la terminologie standard pour votre rôle et secteur',
    };
}

function analyzeSkillsAlignment(cvData: CVData): ATSMetric {
    const skills = cvData.skills?.map(s => s.name.toLowerCase()) || [];
    const experienceText = (cvData.experiences || [])
        .map(e => (e.description || '').toLowerCase())
        .join(' ');

    const alignmentCount = skills.filter(skill => experienceText.includes(skill)).length;
    const ratio = skills.length > 0 ? (alignmentCount / skills.length) * 100 : 0;
    const score = Math.round(ratio);

    return {
        id: 'skills-alignment',
        name: 'Experience Alignment',
        nameAr: 'توافق الخبرات',
        nameFr: 'Alignement de l\'Expérience',
        category: 'keywords',
        score,
        maxScore: 100,
        weight: 7,
        status: score >= 60 ? 'pass' : score >= 30 ? 'warning' : 'fail',
        message: score >= 60 ? 'Skills are well-supported by experience' : 'Prove your skills in your experience section',
        messageAr: score >= 60 ? 'المهارات مدعومة جيداً من الخبرات' : 'أثبت مهاراتك في قسم الخبرات',
        messageFr: score >= 60 ? 'Les compétences sont bien illustrées par l\'expérience' : 'Prouvez vos compétences dans la section expérience',
        tip: 'Ensure the skills you list are also mentioned in your work descriptions',
        tipAr: 'تأكد من ذكر المهارات التي تدرجها أيضاً في أوصاف عملك',
        tipFr: 'Assurez-vous que les compétences listées figurent aussi dans vos descriptions de poste',
    };
}

function analyzeContentLength(cvData: CVData): ATSMetric {
    const textSize = getAllText(cvData).length;
    let score = 0;
    let status: 'pass' | 'warning' | 'fail' = 'fail';

    if (textSize >= 1500 && textSize <= 4500) {
        score = 100;
        status = 'pass';
    } else if (textSize >= 800 && textSize <= 6000) {
        score = 70;
        status = 'warning';
    } else if (textSize > 0) {
        score = 40;
        status = 'fail';
    }

    return {
        id: 'content-length',
        name: 'CV Length',
        nameAr: 'طول السيرة الذاتية',
        nameFr: 'Longueur du CV',
        category: 'formatting',
        score,
        maxScore: 100,
        weight: 6,
        status,
        message: status === 'pass' ? 'Ideal CV length' : 'CV length could be improved',
        messageAr: status === 'pass' ? 'طول سيرة ذاتية مثالي' : 'طول السيرة الذاتية يحتاج تحسين',
        messageFr: status === 'pass' ? 'Longueur de CV idéale' : 'La longueur du CV peut être améliorée',
        tip: 'Target 1-2 pages (approx. 400-800 words)',
        tipAr: 'استهدف 1-2 صفحات (حوالي 400-800 كلمة)',
        tipFr: 'Visez 1 à 2 pages (environ 400-800 mots)',
    };
}

function analyzeSectionBalance(cvData: CVData): ATSMetric {
    const summaryLen = cvData.summary?.length || 0;
    const expLen = (cvData.experiences || []).reduce((s, e) => s + (e.description?.length || 0), 0);
    const skillCount = cvData.skills?.length || 0;

    const total = summaryLen + expLen + (skillCount * 20); // Weight skills
    const expRatio = total > 0 ? (expLen / total) : 0;

    let score = 0;
    if (expRatio >= 0.5 && expRatio <= 0.8) score = 100;
    else if (expRatio >= 0.3) score = 60;
    else score = 30;

    return {
        id: 'section-balance',
        name: 'Section Balance',
        nameAr: 'توازن الأقسام',
        nameFr: 'Équilibre des Sections',
        category: 'formatting',
        score,
        maxScore: 100,
        weight: 5,
        status: score >= 80 ? 'pass' : score >= 50 ? 'warning' : 'fail',
        message: score >= 80 ? 'Well-balanced sections' : 'Experience section should dominate',
        messageAr: score >= 80 ? 'تحقيق توازن جيد بين الأقسام' : 'يجب أن يهيمن قسم الخبرات',
        messageFr: score >= 80 ? 'Sections bien équilibrées' : 'La section expérience devrait dominer',
        tip: 'Ensure your work experience takes up 60-70% of your CV content',
        tipAr: 'تأكد من أن خبرة العمل تشغل 60-70% من محتوى سيرتك الذاتية',
        tipFr: 'Assurez-vous que l\'expérience occupe 60-70% du contenu de votre CV',
    };
}

function analyzeConsistency(cvData: CVData): ATSMetric {
    const experiences = cvData.experiences || [];
    const hasDates = experiences.every(e => e.startDate);
    const hasCompanies = experiences.every(e => e.company);

    let score = 0;
    if (hasDates && hasCompanies) score = 100;
    else if (hasCompanies) score = 60;
    else if (experiences.length > 0) score = 30;
    else score = 100; // Neutral if no entries

    return {
        id: 'consistency',
        name: 'Information Consistency',
        nameAr: 'تناسق المعلومات',
        nameFr: 'Cohérence des Infos',
        category: 'formatting',
        score,
        maxScore: 100,
        weight: 6,
        status: score >= 90 ? 'pass' : score >= 50 ? 'warning' : 'fail',
        message: score >= 90 ? 'High content consistency' : 'Inconsistent formatting detected',
        messageAr: score >= 90 ? 'تناسق عالي في المحتوى' : 'تم اكتشاف عدم تناسق في التنسيق',
        messageFr: score >= 90 ? 'Grande cohérence du contenu' : 'Formatage incohérent détecté',
        tip: 'Use the same format for all dates and job titles',
        tipAr: 'استخدم نفس التنسيق لجميع التواريخ والمسميات الوظيفية',
        tipFr: 'Utilisez le même format pour toutes les dates et titres',
    };
}

function analyzeProfileCompleteness(cvData: CVData): ATSMetric {
    let fieldsCount = 0;
    if (cvData.personalInfo.fullName) fieldsCount++;
    if (cvData.personalInfo.email) fieldsCount++;
    if (cvData.summary) fieldsCount++;
    if (cvData.experiences?.length > 0) fieldsCount++;
    if (cvData.education?.length > 0) fieldsCount++;
    if (cvData.skills?.length >= 5) fieldsCount++;

    const score = Math.round((fieldsCount / 6) * 100);

    return {
        id: 'completeness',
        name: 'Profile Completeness',
        nameAr: 'اكتمال الملف الشخصي',
        nameFr: 'Profil Complet',
        category: 'completeness',
        score,
        maxScore: 100,
        weight: 10,
        status: score >= 85 ? 'pass' : score >= 60 ? 'warning' : 'fail',
        message: score >= 85 ? 'Complete CV profile' : 'CV profile is incomplete',
        messageAr: score >= 85 ? 'ملف سيرة ذاتية مكتمل' : 'ملف السيرة الذاتية غير مكتمل',
        messageFr: score >= 85 ? 'Profil de CV complet' : 'Profil de CV incomplet',
        tip: 'Fill in all major sections: Summary, Experience, Education, and Skills',
        tipAr: 'املأ جميع الأقسام الرئيسية: الملخص، الخبرة، التعليم، والمهارات',
        tipFr: 'Remplissez toutes les sections : Résumé, Expérience, Formation et Compétences',
    };
}

function analyzeDateFormatting(cvData: CVData): ATSMetric {
    const dates = (cvData.experiences || []).map(e => e.startDate).filter(Boolean);
    const standardFormat = dates.every(d => /^\d{4}-\d{2}(-\d{2})?$/.test(d || ''));

    const score = standardFormat ? 100 : dates.length > 0 ? 50 : 0;

    return {
        id: 'date-format',
        name: 'ATS Date Format',
        nameAr: 'تنسيق التاريخ لـ ATS',
        nameFr: 'Format de Date ATS',
        category: 'completeness',
        score,
        maxScore: 100,
        weight: 5,
        status: score >= 90 ? 'pass' : score >= 50 ? 'warning' : 'fail',
        message: score >= 90 ? 'Standard date format used' : 'Use standard date format',
        messageAr: score >= 90 ? 'تم استخدام تنسيق تاريخ قياسي' : 'استخدم تنسيق تاريخ قياسي',
        messageFr: score >= 90 ? 'Format de date standard utilisé' : 'Utilisez un format de date standard',
        tip: 'Use standard date formats (YYYY-MM) that ATS can easily parse',
        tipAr: 'استخدم تنسيقات تاريخ قياسية (YYYY-MM) يمكن لأنظمة ATS قرائتها بسهولة',
        tipFr: 'Utilisez des formats de date standards (AAAA-MM) lisibles par les ATS',
    };
}

function analyzeOnlinePresence(cvData: CVData): ATSMetric {
    const hasLinkedIn = cvData.personalInfo.linkedin?.includes('linkedin.com');
    const hasPortfolio = cvData.personalInfo.website?.trim().length > 0;

    let score = 0;
    if (hasLinkedIn && hasPortfolio) score = 100;
    else if (hasLinkedIn) score = 70;
    else if (hasPortfolio) score = 50;
    else score = 20;

    return {
        id: 'online-presence',
        name: 'Online Presence',
        nameAr: 'التواجد الرقمي',
        nameFr: 'Présence en Ligne',
        category: 'completeness',
        score,
        maxScore: 100,
        weight: 4,
        status: score >= 70 ? 'pass' : 'warning',
        message: score >= 70 ? 'Strong professional presence' : 'Add your professional links',
        messageAr: score >= 70 ? 'تواجد مهني قوي' : 'أضف روابطك المهنية',
        messageFr: score >= 70 ? 'Forte présence professionnelle' : 'Ajoutez vos liens professionnels',
        tip: 'Include your LinkedIn profile and portfolio/GitHub link',
        tipAr: 'أدرج ملفك الشخصي على LinkedIn ورابط المحفظة/GitHub',
        tipFr: 'Incluez votre profil LinkedIn et un lien vers votre portfolio/GitHub',
    };
}

// ============ HELPER FUNCTIONS ============

function getAllText(cvData: CVData): string {
    const parts = [
        cvData.personalInfo.fullName,
        cvData.personalInfo.profession,
        cvData.summary,
        ...(cvData.experiences || []).map(e => `${e.company} ${e.position} ${e.description}`),
        ...(cvData.education || []).map(e => `${e.institution} ${e.degree}`),
        ...(cvData.skills || []).map(s => s.name),
        ...(cvData.languages || []).map(l => l.name)
    ];
    return parts.filter(Boolean).join(' ');
}

function getAllDescriptions(cvData: CVData): string {
    const parts = [
        cvData.summary,
        ...(cvData.experiences || []).map(e => e.description)
    ];
    return parts.filter(Boolean).join(' ');
}

function calculateCategoryScores(metrics: ATSMetric[]): Record<MetricCategory, number> {
    const categories: MetricCategory[] = ['content', 'formatting', 'keywords', 'impact', 'completeness'];
    const result: any = {};

    categories.forEach(cat => {
        const catMetrics = metrics.filter(m => m.category === cat);
        const totalWeight = catMetrics.reduce((s, m) => s + m.weight, 0);
        const weightedScore = catMetrics.reduce((s, m) => s + (m.score * m.weight), 0);
        result[cat] = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
    });

    return result as Record<MetricCategory, number>;
}

function getGrade(score: number) {
    if (score >= 90) return { grade: 'A' as const, gradeLabel: 'Excellent', gradeLabelAr: 'ممتاز', gradeLabelFr: 'Excellent' };
    if (score >= 80) return { grade: 'B' as const, gradeLabel: 'Very Good', gradeLabelAr: 'جيد جداً', gradeLabelFr: 'Très Bien' };
    if (score >= 70) return { grade: 'C' as const, gradeLabel: 'Good', gradeLabelAr: 'جيد', gradeLabelFr: 'Bien' };
    if (score >= 60) return { grade: 'D' as const, gradeLabel: 'Fair', gradeLabelAr: 'مقبول', gradeLabelFr: 'Passable' };
    return { grade: 'F' as const, gradeLabel: 'Poor', gradeLabelAr: 'ضعيف', gradeLabelFr: 'Insuffisant' };
}
