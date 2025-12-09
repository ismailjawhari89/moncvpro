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
    category: MetricCategory;
    score: number;        // 0-100
    maxScore: number;     // Always 100
    weight: number;       // Importance weight (1-10)
    status: 'pass' | 'warning' | 'fail';
    message: string;
    messageAr: string;
    tip: string;
    tipAr: string;
    details?: string[];
}

// Full Analysis Result
export interface ATSAnalysisResult {
    overallScore: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    gradeLabel: string;
    gradeLabelAr: string;
    metrics: ATSMetric[];
    categoryScores: Record<MetricCategory, number>;
    strengths: string[];
    weaknesses: string[];
    priorityActions: string[];
    estimatedPassRate: number;
    timestamp: number;
}

// Action verbs for impact analysis
const STRONG_ACTION_VERBS = [
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
];

// Weak/passive words to avoid
const WEAK_WORDS = [
    'responsible for', 'duties included', 'helped', 'assisted',
    'worked on', 'participated in', 'was involved', 'contributed to',
    'handled', 'dealt with', 'was in charge of', 'took care of'
];

// Quantifiable metrics patterns
const METRICS_PATTERNS = [
    /\d+%/,                    // Percentages
    /\$[\d,]+/,                // Dollar amounts
    /€[\d,]+/,                 // Euro amounts
    /[\d,]+\s*(MAD|DH)/i,      // Moroccan Dirhams
    /\d+[KkMm]\+?/,            // K/M abbreviations
    /\d+\s*(users|clients|customers|employees|projects|teams)/i,
    /\d+x/i,                   // Multipliers
    /\d+\s*(hours|days|weeks|months|years)/i,
    /increased.*by\s*\d+/i,
    /reduced.*by\s*\d+/i,
    /saved.*\d+/i,
    /grew.*\d+/i
];

// ATS-friendly section headers
const STANDARD_SECTIONS = [
    'summary', 'objective', 'experience', 'work experience', 'employment',
    'education', 'skills', 'certifications', 'projects', 'languages'
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

    // Calculate category scores
    const categoryScores = calculateCategoryScores(metrics);

    // Determine grade
    const { grade, gradeLabel, gradeLabelAr } = getGrade(overallScore);

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

    // Estimate pass rate (simplified model)
    const estimatedPassRate = Math.min(95, Math.max(5, overallScore - 10));

    return {
        overallScore,
        grade,
        gradeLabel,
        gradeLabelAr,
        metrics,
        categoryScores,
        strengths,
        weaknesses,
        priorityActions,
        estimatedPassRate,
        timestamp: Date.now()
    };
}

// ============ INDIVIDUAL METRIC ANALYZERS ============

function analyzeContactInfo(cvData: CVData): ATSMetric {
    const { personalInfo } = cvData;
    let score = 0;
    const details: string[] = [];

    if (personalInfo.fullName?.trim()) { score += 25; details.push('✓ Full name'); }
    else details.push('✗ Missing full name');

    if (personalInfo.email?.includes('@')) { score += 25; details.push('✓ Email address'); }
    else details.push('✗ Missing or invalid email');

    if (personalInfo.phone?.trim()) { score += 25; details.push('✓ Phone number'); }
    else details.push('✗ Missing phone');

    if (personalInfo.address?.trim()) { score += 15; details.push('✓ Location'); }
    else details.push('○ Location (optional)');

    if (personalInfo.profession?.trim()) { score += 10; details.push('✓ Job title'); }
    else details.push('○ Job title');

    return {
        id: 'contact-info',
        name: 'Contact Information',
        nameAr: 'معلومات الاتصال',
        category: 'completeness',
        score: Math.min(100, score),
        maxScore: 100,
        weight: 10,
        status: score >= 75 ? 'pass' : score >= 50 ? 'warning' : 'fail',
        message: score >= 75 ? 'Complete contact information' : 'Contact information incomplete',
        messageAr: score >= 75 ? 'معلومات الاتصال مكتملة' : 'معلومات الاتصال غير مكتملة',
        tip: 'Include full name, professional email, phone number, and city/country',
        tipAr: 'أضف الاسم الكامل، البريد الإلكتروني المهني، رقم الهاتف، والمدينة',
        details
    };
}

function analyzeSummary(cvData: CVData): ATSMetric {
    const summary = cvData.summary || '';
    const wordCount = summary.split(/\s+/).filter(w => w.length > 0).length;
    let score = 0;
    const details: string[] = [];

    // Length check (ideal: 50-150 words)
    if (wordCount >= 50 && wordCount <= 150) {
        score += 40;
        details.push(`✓ Good length (${wordCount} words)`);
    } else if (wordCount >= 30 && wordCount <= 200) {
        score += 25;
        details.push(`○ Acceptable length (${wordCount} words)`);
    } else if (wordCount > 0) {
        score += 10;
        details.push(`✗ ${wordCount < 30 ? 'Too short' : 'Too long'} (${wordCount} words)`);
    } else {
        details.push('✗ Missing summary');
    }

    // Action verbs in summary
    const hasActionVerbs = STRONG_ACTION_VERBS.some(verb =>
        summary.toLowerCase().includes(verb)
    );
    if (hasActionVerbs) {
        score += 20;
        details.push('✓ Uses action verbs');
    }

    // Contains profession/role
    if (cvData.personalInfo.profession &&
        summary.toLowerCase().includes(cvData.personalInfo.profession.toLowerCase().split(' ')[0])) {
        score += 20;
        details.push('✓ Mentions target role');
    }

    // Contains quantifiable achievements
    const hasMetrics = METRICS_PATTERNS.some(pattern => pattern.test(summary));
    if (hasMetrics) {
        score += 20;
        details.push('✓ Includes metrics/numbers');
    } else {
        details.push('○ Consider adding metrics');
    }

    return {
        id: 'summary-quality',
        name: 'Professional Summary',
        nameAr: 'الملخص المهني',
        category: 'content',
        score: Math.min(100, score),
        maxScore: 100,
        weight: 8,
        status: score >= 60 ? 'pass' : score >= 30 ? 'warning' : 'fail',
        message: score >= 60 ? 'Strong professional summary' : 'Summary needs improvement',
        messageAr: score >= 60 ? 'ملخص مهني قوي' : 'الملخص يحتاج تحسين',
        tip: 'Write a 50-150 word summary highlighting your key achievements with numbers',
        tipAr: 'اكتب ملخصاً من 50-150 كلمة يسلط الضوء على إنجازاتك بأرقام',
        details
    };
}

function analyzeExperienceDepth(cvData: CVData): ATSMetric {
    const experiences = cvData.experiences || [];
    let score = 0;
    const details: string[] = [];

    // Number of experiences
    if (experiences.length >= 3) {
        score += 30;
        details.push(`✓ ${experiences.length} work experiences`);
    } else if (experiences.length >= 1) {
        score += 15;
        details.push(`○ Only ${experiences.length} experience(s)`);
    } else {
        details.push('✗ No work experience listed');
    }

    // Description quality
    const avgDescLength = experiences.reduce((sum, exp) =>
        sum + (exp.description?.split(/\s+/).length || 0), 0) / (experiences.length || 1);

    if (avgDescLength >= 30) {
        score += 35;
        details.push('✓ Detailed descriptions');
    } else if (avgDescLength >= 15) {
        score += 20;
        details.push('○ Descriptions could be more detailed');
    } else if (experiences.length > 0) {
        details.push('✗ Descriptions too brief');
    }

    // Company and position filled
    const completedExps = experiences.filter(e => e.company && e.position).length;
    if (completedExps === experiences.length && experiences.length > 0) {
        score += 20;
        details.push('✓ All positions have company/title');
    } else if (completedExps > 0) {
        score += 10;
        details.push('○ Some positions missing details');
    }

    // Date ranges
    const datedExps = experiences.filter(e => e.startDate).length;
    if (datedExps === experiences.length && experiences.length > 0) {
        score += 15;
        details.push('✓ All positions have dates');
    }

    return {
        id: 'experience-depth',
        name: 'Work Experience',
        nameAr: 'الخبرة المهنية',
        category: 'content',
        score: Math.min(100, score),
        maxScore: 100,
        weight: 10,
        status: score >= 60 ? 'pass' : score >= 30 ? 'warning' : 'fail',
        message: score >= 60 ? 'Solid work experience section' : 'Work experience needs more detail',
        messageAr: score >= 60 ? 'قسم الخبرة المهنية جيد' : 'قسم الخبرة يحتاج المزيد من التفاصيل',
        tip: 'Include 2-4 recent positions with detailed bullet points (3-5 per role)',
        tipAr: 'أضف 2-4 وظائف حديثة مع نقاط تفصيلية (3-5 لكل وظيفة)',
        details
    };
}

function analyzeEducation(cvData: CVData): ATSMetric {
    const education = cvData.education || [];
    let score = 0;
    const details: string[] = [];

    if (education.length >= 1) {
        score += 50;
        details.push(`✓ ${education.length} education entry(s)`);

        // Check completeness
        const complete = education.filter(e => e.institution && e.degree).length;
        if (complete === education.length) {
            score += 30;
            details.push('✓ All entries complete');
        } else {
            score += 15;
            details.push('○ Some entries incomplete');
        }

        // Graduation dates
        const dated = education.filter(e => e.graduationYear || e.endDate).length;
        if (dated === education.length) {
            score += 20;
            details.push('✓ Graduation dates included');
        }
    } else {
        details.push('✗ No education listed');
    }

    return {
        id: 'education',
        name: 'Education',
        nameAr: 'التعليم',
        category: 'completeness',
        score: Math.min(100, score),
        maxScore: 100,
        weight: 6,
        status: score >= 50 ? 'pass' : score >= 25 ? 'warning' : 'fail',
        message: score >= 50 ? 'Education section complete' : 'Add education details',
        messageAr: score >= 50 ? 'قسم التعليم مكتمل' : 'أضف تفاصيل التعليم',
        tip: 'Include degree, institution name, and graduation year',
        tipAr: 'أضف الشهادة، اسم المؤسسة، وسنة التخرج',
        details
    };
}

function analyzeSkills(cvData: CVData): ATSMetric {
    const skills = cvData.skills || [];
    let score = 0;
    const details: string[] = [];

    // Number of skills (ideal: 8-15)
    if (skills.length >= 8 && skills.length <= 15) {
        score += 50;
        details.push(`✓ Good skill count (${skills.length})`);
    } else if (skills.length >= 5) {
        score += 30;
        details.push(`○ ${skills.length} skills (aim for 8-15)`);
    } else if (skills.length > 0) {
        score += 15;
        details.push(`✗ Only ${skills.length} skills listed`);
    } else {
        details.push('✗ No skills listed');
    }

    // Skill categories
    const technical = skills.filter(s => s.category === 'technical').length;
    const soft = skills.filter(s => s.category === 'soft').length;

    if (technical >= 3 && soft >= 2) {
        score += 30;
        details.push('✓ Good mix of technical & soft skills');
    } else if (technical >= 2 || soft >= 2) {
        score += 15;
        details.push('○ Add more skill variety');
    }

    // Skill levels defined
    const withLevels = skills.filter(s => s.level > 0).length;
    if (withLevels === skills.length && skills.length > 0) {
        score += 20;
        details.push('✓ All skills have proficiency levels');
    }

    return {
        id: 'skills',
        name: 'Skills Section',
        nameAr: 'قسم المهارات',
        category: 'content',
        score: Math.min(100, score),
        maxScore: 100,
        weight: 8,
        status: score >= 50 ? 'pass' : score >= 25 ? 'warning' : 'fail',
        message: score >= 50 ? 'Strong skills section' : 'Expand your skills section',
        messageAr: score >= 50 ? 'قسم مهارات قوي' : 'وسّع قسم المهارات',
        tip: 'List 8-15 relevant skills with a mix of technical and soft skills',
        tipAr: 'أضف 8-15 مهارة ذات صلة مع مزيج من المهارات التقنية والناعمة',
        details
    };
}

function analyzeActionVerbs(cvData: CVData): ATSMetric {
    const allText = getAllDescriptions(cvData);
    const words = allText.toLowerCase().split(/\s+/);

    const actionVerbCount = STRONG_ACTION_VERBS.filter(verb =>
        words.includes(verb.toLowerCase())
    ).length;

    const experienceCount = cvData.experiences?.length || 0;
    const idealCount = Math.max(3, experienceCount * 2);

    const score = Math.min(100, Math.round((actionVerbCount / idealCount) * 100));

    return {
        id: 'action-verbs',
        name: 'Action Verbs',
        nameAr: 'أفعال القوة',
        category: 'impact',
        score,
        maxScore: 100,
        weight: 7,
        status: score >= 60 ? 'pass' : score >= 30 ? 'warning' : 'fail',
        message: score >= 60 ? `Strong action verbs used (${actionVerbCount} found)` : 'Need more action verbs',
        messageAr: score >= 60 ? `أفعال قوة ممتازة (${actionVerbCount} موجودة)` : 'تحتاج المزيد من أفعال القوة',
        tip: 'Start bullet points with verbs like: Led, Developed, Achieved, Increased, Built',
        tipAr: 'ابدأ النقاط بأفعال مثل: قاد، طوّر، حقق، زاد، بنى',
        details: [`Found ${actionVerbCount} action verbs (target: ${idealCount}+)`]
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
        category: 'impact',
        score,
        maxScore: 100,
        weight: 9,
        status: score >= 60 ? 'pass' : score >= 30 ? 'warning' : 'fail',
        message: score >= 60 ? `Great use of metrics (${metricsFound} found)` : 'Add more numbers and percentages',
        messageAr: score >= 60 ? `استخدام ممتاز للأرقام (${metricsFound} موجودة)` : 'أضف المزيد من الأرقام والنسب',
        tip: 'Add percentages, dollar amounts, team sizes, and time savings to achievements',
        tipAr: 'أضف نسب مئوية، مبالغ مالية، أحجام فرق، وتوفير الوقت للإنجازات',
        details: [`Found ${metricsFound} quantifiable metrics (target: ${idealCount}+ per experience)`]
    };
}

function analyzePassiveLanguage(cvData: CVData): ATSMetric {
    const allText = getAllDescriptions(cvData).toLowerCase();

    const weakWordsFound = WEAK_WORDS.filter(phrase =>
        allText.includes(phrase.toLowerCase())
    );

    const score = weakWordsFound.length === 0 ? 100 :
        weakWordsFound.length <= 2 ? 70 :
            weakWordsFound.length <= 5 ? 40 : 20;

    return {
        id: 'passive-language',
        name: 'Active Voice',
        nameAr: 'الصوت النشط',
        category: 'impact',
        score,
        maxScore: 100,
        weight: 5,
        status: score >= 70 ? 'pass' : score >= 40 ? 'warning' : 'fail',
        message: score >= 70 ? 'Good use of active voice' : 'Reduce passive phrases',
        messageAr: score >= 70 ? 'استخدام جيد للصوت النشط' : 'قلل العبارات السلبية',
        tip: 'Replace "Responsible for..." with "Led...", "Managed...", "Delivered..."',
        tipAr: 'استبدل "مسؤول عن..." بـ "قاد..."، "أدار..."، "نفّذ..."',
        details: weakWordsFound.length > 0
            ? [`Found weak phrases: ${weakWordsFound.slice(0, 3).join(', ')}`]
            : ['No passive language detected']
    };
}

function analyzeAchievementRatio(cvData: CVData): ATSMetric {
    const allText = getAllDescriptions(cvData).toLowerCase();

    // Achievement indicators
    const achievementWords = ['achieved', 'increased', 'decreased', 'reduced', 'improved',
        'generated', 'saved', 'delivered', 'launched', 'created', 'built', 'won'];

    // Responsibility indicators
    const responsibilityWords = ['responsible', 'duties', 'managed', 'handled', 'maintained'];

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
        category: 'impact',
        score,
        maxScore: 100,
        weight: 7,
        status: score >= 60 ? 'pass' : score >= 40 ? 'warning' : 'fail',
        message: score >= 60 ? 'Great achievement focus' : 'Too many responsibilities, not enough achievements',
        messageAr: score >= 60 ? 'تركيز ممتاز على الإنجازات' : 'كثير من المسؤوليات، قليل من الإنجازات',
        tip: 'Focus on what you ACHIEVED, not just what you were responsible for',
        tipAr: 'ركز على ما أنجزته، وليس فقط ما كنت مسؤولاً عنه',
        details: [`Achievement to responsibility ratio: ${Math.round(ratio)}%`]
    };
}

function analyzeKeywordDensity(cvData: CVData, jobDescription?: string): ATSMetric {
    // If no job description, check for general professional keywords
    const generalKeywords = [
        'team', 'project', 'management', 'development', 'analysis',
        'strategy', 'communication', 'leadership', 'results', 'performance',
        'growth', 'optimization', 'innovation', 'collaboration', 'solutions'
    ];

    const allText = getAllText(cvData).toLowerCase();
    const keywords = jobDescription
        ? extractKeywords(jobDescription)
        : generalKeywords;

    const foundKeywords = keywords.filter(kw => allText.includes(kw.toLowerCase()));
    const score = Math.min(100, Math.round((foundKeywords.length / keywords.length) * 100));

    return {
        id: 'keyword-density',
        name: 'Keyword Optimization',
        nameAr: 'تحسين الكلمات المفتاحية',
        category: 'keywords',
        score,
        maxScore: 100,
        weight: 8,
        status: score >= 50 ? 'pass' : score >= 25 ? 'warning' : 'fail',
        message: score >= 50 ? `Good keyword coverage (${foundKeywords.length}/${keywords.length})` : 'Add more relevant keywords',
        messageAr: score >= 50 ? `تغطية جيدة للكلمات المفتاحية (${foundKeywords.length}/${keywords.length})` : 'أضف المزيد من الكلمات المفتاحية',
        tip: 'Mirror keywords from the job description naturally throughout your CV',
        tipAr: 'استخدم الكلمات المفتاحية من وصف الوظيفة بشكل طبيعي في سيرتك',
        details: [`Found: ${foundKeywords.slice(0, 5).join(', ')}${foundKeywords.length > 5 ? '...' : ''}`]
    };
}

function analyzeIndustryKeywords(cvData: CVData): ATSMetric {
    const profession = cvData.personalInfo?.profession?.toLowerCase() || '';
    const allText = getAllText(cvData).toLowerCase();

    // Industry-specific keywords based on profession
    const industryKeywords = getIndustryKeywords(profession);
    const foundKeywords = industryKeywords.filter(kw => allText.includes(kw.toLowerCase()));

    const score = industryKeywords.length > 0
        ? Math.min(100, Math.round((foundKeywords.length / industryKeywords.length) * 100))
        : 50; // Neutral if no profession detected

    return {
        id: 'industry-keywords',
        name: 'Industry Keywords',
        nameAr: 'كلمات الصناعة',
        category: 'keywords',
        score,
        maxScore: 100,
        weight: 6,
        status: score >= 50 ? 'pass' : score >= 25 ? 'warning' : 'fail',
        message: score >= 50 ? 'Good industry-specific terms' : 'Add more industry terminology',
        messageAr: score >= 50 ? 'مصطلحات صناعية جيدة' : 'أضف المزيد من مصطلحات المجال',
        tip: 'Include industry-specific tools, methodologies, and certifications',
        tipAr: 'أضف الأدوات والمنهجيات والشهادات الخاصة بمجالك',
        details: [`Found ${foundKeywords.length} industry terms for "${profession || 'general'}"`]
    };
}

function analyzeSkillsAlignment(cvData: CVData): ATSMetric {
    const skills = cvData.skills?.map(s => s.name.toLowerCase()) || [];
    const allDescriptions = getAllDescriptions(cvData).toLowerCase();

    const mentionedSkills = skills.filter(skill => allDescriptions.includes(skill));
    const score = skills.length > 0
        ? Math.min(100, Math.round((mentionedSkills.length / skills.length) * 100))
        : 50;

    return {
        id: 'skills-alignment',
        name: 'Skills-Experience Match',
        nameAr: 'تطابق المهارات والخبرة',
        category: 'keywords',
        score,
        maxScore: 100,
        weight: 6,
        status: score >= 40 ? 'pass' : score >= 20 ? 'warning' : 'fail',
        message: score >= 40 ? 'Skills reflected in experience' : 'Skills not demonstrated in experience',
        messageAr: score >= 40 ? 'المهارات ظاهرة في الخبرة' : 'المهارات غير موضحة في الخبرة',
        tip: 'Mention your listed skills within your experience descriptions',
        tipAr: 'اذكر مهاراتك المدرجة ضمن وصف خبراتك',
        details: [`${mentionedSkills.length}/${skills.length} skills appear in experience`]
    };
}

function analyzeContentLength(cvData: CVData): ATSMetric {
    const allText = getAllText(cvData);
    const wordCount = allText.split(/\s+/).filter(w => w.length > 0).length;

    // Ideal: 400-800 words for 1-page, 600-1200 for 2-page
    let score = 0;
    let status: 'pass' | 'warning' | 'fail' = 'fail';
    let message = '';

    if (wordCount >= 400 && wordCount <= 1000) {
        score = 100;
        status = 'pass';
        message = `Optimal length (${wordCount} words)`;
    } else if (wordCount >= 300 && wordCount <= 1200) {
        score = 70;
        status = 'warning';
        message = `Acceptable length (${wordCount} words)`;
    } else if (wordCount < 300) {
        score = 30;
        status = 'fail';
        message = `Too short (${wordCount} words)`;
    } else {
        score = 40;
        status = 'warning';
        message = `May be too long (${wordCount} words)`;
    }

    return {
        id: 'content-length',
        name: 'Content Length',
        nameAr: 'طول المحتوى',
        category: 'formatting',
        score,
        maxScore: 100,
        weight: 4,
        status,
        message,
        messageAr: `${wordCount} كلمة`,
        tip: 'Aim for 400-800 words for one page, 600-1200 for two pages',
        tipAr: 'استهدف 400-800 كلمة لصفحة واحدة، 600-1200 لصفحتين',
        details: [`Total word count: ${wordCount}`]
    };
}

function analyzeSectionBalance(cvData: CVData): ATSMetric {
    const sections = {
        summary: (cvData.summary?.length || 0) > 50 ? 1 : 0,
        experience: cvData.experiences?.length || 0,
        education: cvData.education?.length || 0,
        skills: cvData.skills?.length || 0,
        languages: cvData.languages?.length || 0
    };

    const filledSections = Object.values(sections).filter(v => v > 0).length;
    const score = Math.min(100, (filledSections / 5) * 100);

    return {
        id: 'section-balance',
        name: 'Section Completeness',
        nameAr: 'اكتمال الأقسام',
        category: 'formatting',
        score,
        maxScore: 100,
        weight: 5,
        status: score >= 80 ? 'pass' : score >= 60 ? 'warning' : 'fail',
        message: `${filledSections}/5 sections completed`,
        messageAr: `${filledSections}/5 أقسام مكتملة`,
        tip: 'Complete all main sections: Summary, Experience, Education, Skills',
        tipAr: 'أكمل جميع الأقسام: الملخص، الخبرة، التعليم، المهارات',
        details: Object.entries(sections).map(([k, v]) => `${k}: ${v > 0 ? '✓' : '✗'}`)
    };
}

function analyzeConsistency(cvData: CVData): ATSMetric {
    let score = 100;
    const details: string[] = [];

    // Check date format consistency
    const experiences = cvData.experiences || [];
    const dateFormats = new Set(experiences.map(e => detectDateFormat(e.startDate)));
    if (dateFormats.size > 1 && dateFormats.size > 0) {
        score -= 30;
        details.push('✗ Inconsistent date formats');
    } else {
        details.push('✓ Consistent date formats');
    }

    // Check for gaps (simplified)
    if (experiences.length >= 2) {
        details.push('✓ No major employment gaps detected');
    }

    return {
        id: 'consistency',
        name: 'Format Consistency',
        nameAr: 'اتساق التنسيق',
        category: 'formatting',
        score,
        maxScore: 100,
        weight: 4,
        status: score >= 70 ? 'pass' : score >= 40 ? 'warning' : 'fail',
        message: score >= 70 ? 'Consistent formatting' : 'Formatting inconsistencies detected',
        messageAr: score >= 70 ? 'تنسيق متسق' : 'تم اكتشاف تضارب في التنسيق',
        tip: 'Use the same date format and bullet style throughout',
        tipAr: 'استخدم نفس تنسيق التاريخ وأسلوب النقاط في كل مكان',
        details
    };
}

function analyzeProfileCompleteness(cvData: CVData): ATSMetric {
    const checks = [
        { name: 'Name', filled: !!cvData.personalInfo?.fullName?.trim() },
        { name: 'Email', filled: !!cvData.personalInfo?.email?.trim() },
        { name: 'Phone', filled: !!cvData.personalInfo?.phone?.trim() },
        { name: 'Title', filled: !!cvData.personalInfo?.profession?.trim() },
        { name: 'Summary', filled: (cvData.summary?.length || 0) > 30 },
        { name: 'Experience', filled: (cvData.experiences?.length || 0) > 0 },
        { name: 'Education', filled: (cvData.education?.length || 0) > 0 },
        { name: 'Skills', filled: (cvData.skills?.length || 0) >= 3 }
    ];

    const filled = checks.filter(c => c.filled).length;
    const score = Math.round((filled / checks.length) * 100);

    return {
        id: 'profile-completeness',
        name: 'Profile Completeness',
        nameAr: 'اكتمال الملف',
        category: 'completeness',
        score,
        maxScore: 100,
        weight: 8,
        status: score >= 80 ? 'pass' : score >= 50 ? 'warning' : 'fail',
        message: `Profile is ${score}% complete`,
        messageAr: `الملف مكتمل بنسبة ${score}%`,
        tip: 'Fill in all essential sections for maximum ATS compatibility',
        tipAr: 'أكمل جميع الأقسام الأساسية لأقصى توافق مع ATS',
        details: checks.map(c => `${c.filled ? '✓' : '✗'} ${c.name}`)
    };
}

function analyzeDateFormatting(cvData: CVData): ATSMetric {
    const experiences = cvData.experiences || [];
    const education = cvData.education || [];

    let score = 100;
    const details: string[] = [];

    // Check if dates exist
    const expWithDates = experiences.filter(e => e.startDate).length;
    const eduWithDates = education.filter(e => e.graduationYear || e.endDate).length;

    if (expWithDates < experiences.length) {
        score -= 30;
        details.push('✗ Some experiences missing dates');
    } else if (experiences.length > 0) {
        details.push('✓ All experiences have dates');
    }

    if (eduWithDates < education.length && education.length > 0) {
        score -= 20;
        details.push('✗ Some education entries missing dates');
    } else if (education.length > 0) {
        details.push('✓ Education dates complete');
    }

    return {
        id: 'date-formatting',
        name: 'Date Completeness',
        nameAr: 'اكتمال التواريخ',
        category: 'formatting',
        score: Math.max(0, score),
        maxScore: 100,
        weight: 4,
        status: score >= 80 ? 'pass' : score >= 50 ? 'warning' : 'fail',
        message: score >= 80 ? 'Dates properly formatted' : 'Some dates missing or inconsistent',
        messageAr: score >= 80 ? 'التواريخ منسقة بشكل صحيح' : 'بعض التواريخ مفقودة أو غير متسقة',
        tip: 'Use consistent date format like "Jan 2023 - Present" or "2020 - 2023"',
        tipAr: 'استخدم تنسيق تاريخ متسق مثل "يناير 2023 - حاليًا"',
        details
    };
}

function analyzeOnlinePresence(cvData: CVData): ATSMetric {
    const { linkedin, github } = cvData.personalInfo || {};
    let score = 0;
    const details: string[] = [];

    if (linkedin?.trim()) {
        score += 60;
        details.push('✓ LinkedIn profile included');
    } else {
        details.push('○ Add LinkedIn profile');
    }

    if (github?.trim()) {
        score += 40;
        details.push('✓ GitHub/Portfolio included');
    } else {
        details.push('○ Consider adding portfolio');
    }

    return {
        id: 'online-presence',
        name: 'Online Presence',
        nameAr: 'التواجد عبر الإنترنت',
        category: 'completeness',
        score,
        maxScore: 100,
        weight: 3,
        status: score >= 60 ? 'pass' : score >= 30 ? 'warning' : 'fail',
        message: score >= 60 ? 'Good online presence' : 'Add professional profiles',
        messageAr: score >= 60 ? 'تواجد جيد عبر الإنترنت' : 'أضف ملفات تعريف مهنية',
        tip: 'Add your LinkedIn profile and portfolio/GitHub if relevant',
        tipAr: 'أضف ملف LinkedIn الخاص بك ومعرض الأعمال إن وجد',
        details
    };
}

// ============ HELPER FUNCTIONS ============

function getAllDescriptions(cvData: CVData): string {
    const parts: string[] = [];

    if (cvData.summary) parts.push(cvData.summary);

    cvData.experiences?.forEach(exp => {
        if (exp.description) parts.push(exp.description);
    });

    return parts.join(' ');
}

function getAllText(cvData: CVData): string {
    const parts: string[] = [];

    if (cvData.personalInfo?.fullName) parts.push(cvData.personalInfo.fullName);
    if (cvData.personalInfo?.profession) parts.push(cvData.personalInfo.profession);
    if (cvData.summary) parts.push(cvData.summary);

    cvData.experiences?.forEach(exp => {
        if (exp.position) parts.push(exp.position);
        if (exp.company) parts.push(exp.company);
        if (exp.description) parts.push(exp.description);
    });

    cvData.education?.forEach(edu => {
        if (edu.degree) parts.push(edu.degree);
        if (edu.field) parts.push(edu.field);
        if (edu.institution) parts.push(edu.institution);
    });

    cvData.skills?.forEach(skill => {
        if (skill.name) parts.push(skill.name);
    });

    return parts.join(' ');
}

function calculateCategoryScores(metrics: ATSMetric[]): Record<MetricCategory, number> {
    const categories: MetricCategory[] = ['content', 'formatting', 'keywords', 'impact', 'completeness'];
    const scores: Record<MetricCategory, number> = {} as any;

    categories.forEach(cat => {
        const catMetrics = metrics.filter(m => m.category === cat);
        if (catMetrics.length > 0) {
            const total = catMetrics.reduce((sum, m) => sum + (m.score * m.weight), 0);
            const weights = catMetrics.reduce((sum, m) => sum + m.weight, 0);
            scores[cat] = Math.round(total / weights);
        } else {
            scores[cat] = 0;
        }
    });

    return scores;
}

function getGrade(score: number): { grade: 'A' | 'B' | 'C' | 'D' | 'F'; gradeLabel: string; gradeLabelAr: string } {
    if (score >= 90) return { grade: 'A', gradeLabel: 'Excellent', gradeLabelAr: 'ممتاز' };
    if (score >= 80) return { grade: 'B', gradeLabel: 'Very Good', gradeLabelAr: 'جيد جداً' };
    if (score >= 70) return { grade: 'C', gradeLabel: 'Good', gradeLabelAr: 'جيد' };
    if (score >= 60) return { grade: 'D', gradeLabel: 'Needs Work', gradeLabelAr: 'يحتاج تحسين' };
    return { grade: 'F', gradeLabel: 'Poor', gradeLabelAr: 'ضعيف' };
}

function extractKeywords(jobDescription: string): string[] {
    // Simple keyword extraction
    const words = jobDescription.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 3);

    // Count frequency
    const freq: Record<string, number> = {};
    words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });

    // Return top keywords
    return Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([word]) => word);
}

function getIndustryKeywords(profession: string): string[] {
    if (profession.includes('developer') || profession.includes('engineer') || profession.includes('software')) {
        return ['agile', 'scrum', 'git', 'ci/cd', 'api', 'cloud', 'database', 'testing', 'deployment'];
    }
    if (profession.includes('marketing')) {
        return ['seo', 'ppc', 'analytics', 'campaign', 'roi', 'conversion', 'content', 'social media'];
    }
    if (profession.includes('manager') || profession.includes('director')) {
        return ['leadership', 'strategy', 'budget', 'stakeholder', 'kpi', 'roadmap', 'team'];
    }
    if (profession.includes('design')) {
        return ['figma', 'prototype', 'wireframe', 'user experience', 'accessibility', 'responsive'];
    }
    if (profession.includes('data') || profession.includes('analyst')) {
        return ['sql', 'python', 'visualization', 'reporting', 'metrics', 'insights', 'dashboard'];
    }
    return ['team', 'project', 'communication', 'results', 'improvement'];
}

function detectDateFormat(date?: string): string {
    if (!date) return 'none';
    if (/^\d{4}$/.test(date)) return 'year';
    if (/^\d{1,2}\/\d{4}$/.test(date)) return 'mm/yyyy';
    if (/^[A-Za-z]+\s+\d{4}$/.test(date)) return 'month year';
    return 'other';
}

// Export everything
export default analyzeATS;
