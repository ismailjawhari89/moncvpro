/**
 * Job Description Matcher
 * Analyzes and compares CV data against job description requirements
 */

import type { CVData } from '@/types/cv';

// Match Result Interface
export interface JobMatchResult {
    matchScore: number;              // 0-100
    matchGrade: 'A' | 'B' | 'C' | 'D' | 'F';
    matchLabel: string;

    // Extracted from job description
    extractedRequirements: {
        hardSkills: string[];
        softSkills: string[];
        experience: string[];
        education: string[];
        certifications: string[];
        tools: string[];
        keywords: string[];
    };

    // Match analysis
    matchingSkills: string[];
    missingSkills: string[];
    matchingKeywords: string[];
    missingKeywords: string[];

    // Experience analysis  
    experienceMatch: {
        required: string | null;
        yours: number;
        status: 'exceeds' | 'meets' | 'close' | 'lacking';
    };

    // Education analysis
    educationMatch: {
        required: string[];
        yours: string[];
        status: 'meets' | 'partial' | 'lacking';
    };

    // Actionable improvements
    priorityActions: {
        category: 'skill' | 'keyword' | 'experience' | 'education' | 'certification';
        action: string;
        priority: 'high' | 'medium' | 'low';
        canAutoFix: boolean;
    }[];

    // Summary insights
    insights: {
        strongPoints: string[];
        gapAreas: string[];
        competitiveAdvantage: string | null;
    };

    timestamp: number;
}

// Common technical skills database
const TECH_SKILLS_DB = [
    // Programming Languages
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'go', 'rust', 'swift', 'kotlin',
    // Frontend
    'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt', 'html', 'css', 'sass', 'tailwind', 'bootstrap',
    // Backend
    'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', '.net', 'fastapi',
    // Databases
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb', 'firebase',
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'terraform', 'ansible', 'ci/cd',
    // Data & AI
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'tableau', 'power bi',
    // Tools
    'git', 'github', 'gitlab', 'jira', 'confluence', 'figma', 'sketch', 'photoshop', 'illustrator',
    // Other
    'agile', 'scrum', 'kanban', 'rest api', 'graphql', 'microservices', 'testing', 'tdd', 'bdd'
];

// Soft skills database
const SOFT_SKILLS_DB = [
    'leadership', 'communication', 'teamwork', 'problem solving', 'critical thinking',
    'adaptability', 'creativity', 'time management', 'collaboration', 'mentoring',
    'presentation', 'negotiation', 'conflict resolution', 'decision making', 'strategic thinking',
    'attention to detail', 'self-motivated', 'proactive', 'analytical', 'organized'
];

// Education keywords
const EDUCATION_DB = [
    'bachelor', 'master', 'phd', 'doctorate', 'degree', 'diploma', 'certificate', 'certification',
    'computer science', 'engineering', 'business', 'mba', 'information technology', 'data science'
];

// Experience level patterns
const EXPERIENCE_PATTERNS = [
    { pattern: /(\d+)\+?\s*(?:years?|yrs?|ans?)\s*(?:of\s+)?(?:experience|expérience)/gi, type: 'years' },
    { pattern: /senior|sr\./gi, type: 'senior' },
    { pattern: /junior|jr\./gi, type: 'junior' },
    { pattern: /mid[- ]?level|intermediate/gi, type: 'mid' },
    { pattern: /entry[- ]?level|débutant/gi, type: 'entry' },
    { pattern: /lead|principal|staff/gi, type: 'lead' }
];

/**
 * Main Job Matching Function
 */
export function matchJobDescription(cvData: CVData, jobDescription: string): JobMatchResult {
    const jdLower = jobDescription.toLowerCase();

    // Extract requirements from job description
    const extractedRequirements = extractRequirements(jobDescription);

    // Get CV content for comparison
    const cvContent = extractCVContent(cvData);

    // Match skills
    const matchingSkills: string[] = [];
    const missingSkills: string[] = [];

    [...extractedRequirements.hardSkills, ...extractedRequirements.softSkills].forEach(skill => {
        if (cvContent.allText.includes(skill.toLowerCase())) {
            matchingSkills.push(skill);
        } else {
            missingSkills.push(skill);
        }
    });

    // Match keywords
    const matchingKeywords: string[] = [];
    const missingKeywords: string[] = [];

    extractedRequirements.keywords.forEach(keyword => {
        if (cvContent.allText.includes(keyword.toLowerCase())) {
            matchingKeywords.push(keyword);
        } else {
            missingKeywords.push(keyword);
        }
    });

    // Match experience
    const experienceMatch = analyzeExperience(cvData, jobDescription);

    // Match education
    const educationMatch = analyzeEducation(cvData, extractedRequirements.education);

    // Calculate match score
    const matchScore = calculateMatchScore({
        matchingSkills,
        missingSkills,
        matchingKeywords,
        missingKeywords,
        experienceMatch,
        educationMatch,
        totalRequirements: extractedRequirements
    });

    // Get match grade
    const { grade, label } = getMatchGrade(matchScore);

    // Generate priority actions
    const priorityActions = generatePriorityActions(missingSkills, missingKeywords, experienceMatch, educationMatch, extractedRequirements);

    // Generate insights
    const insights = generateInsights(matchingSkills, missingSkills, matchingKeywords, missingKeywords, experienceMatch, cvData);

    return {
        matchScore,
        matchGrade: grade,
        matchLabel: label,
        extractedRequirements,
        matchingSkills,
        missingSkills,
        matchingKeywords,
        missingKeywords,
        experienceMatch,
        educationMatch,
        priorityActions,
        insights,
        timestamp: Date.now()
    };
}

/**
 * Extract requirements from job description
 */
function extractRequirements(jobDescription: string): JobMatchResult['extractedRequirements'] {
    const jdLower = jobDescription.toLowerCase();
    const words = jdLower.split(/[\s,;.!?\-–—()[\]{}'"]+/).filter(w => w.length > 2);

    // Extract hard skills
    const hardSkills: string[] = [];
    TECH_SKILLS_DB.forEach(skill => {
        if (jdLower.includes(skill)) {
            hardSkills.push(skill);
        }
    });

    // Also check for multi-word skills
    const multiWordSkills = [
        'machine learning', 'deep learning', 'data science', 'data analysis',
        'project management', 'product management', 'user experience', 'user interface',
        'full stack', 'front end', 'back end', 'cloud computing', 'web development',
        'mobile development', 'devops', 'site reliability', 'quality assurance'
    ];
    multiWordSkills.forEach(skill => {
        if (jdLower.includes(skill) && !hardSkills.includes(skill)) {
            hardSkills.push(skill);
        }
    });

    // Extract soft skills
    const softSkills: string[] = [];
    SOFT_SKILLS_DB.forEach(skill => {
        if (jdLower.includes(skill)) {
            softSkills.push(skill);
        }
    });

    // Extract experience requirements
    const experience: string[] = [];
    EXPERIENCE_PATTERNS.forEach(({ pattern }) => {
        const matches = jobDescription.match(pattern);
        if (matches) {
            experience.push(...matches);
        }
    });

    // Extract education requirements
    const education: string[] = [];
    EDUCATION_DB.forEach(term => {
        if (jdLower.includes(term)) {
            education.push(term);
        }
    });

    // Extract certifications
    const certifications: string[] = [];
    const certPatterns = [
        /(?:certified|certification)\s+\w+/gi,
        /\b(aws|azure|gcp|pmp|scrum|cissp|cpa|cfa)\s+(?:certified|certification)?/gi
    ];
    certPatterns.forEach(pattern => {
        const matches = jobDescription.match(pattern);
        if (matches) {
            certifications.push(...matches.map(m => m.trim()));
        }
    });

    // Extract tools (from capitalized words and known patterns)
    const tools: string[] = [];
    const toolPatterns = [
        'jira', 'confluence', 'slack', 'asana', 'trello', 'monday',
        'salesforce', 'hubspot', 'zendesk', 'intercom',
        'figma', 'sketch', 'adobe', 'invision',
        'excel', 'powerpoint', 'word', 'outlook', 'office'
    ];
    toolPatterns.forEach(tool => {
        if (jdLower.includes(tool) && !hardSkills.includes(tool)) {
            tools.push(tool);
        }
    });

    // Extract important keywords (frequent words)
    const wordFreq: Record<string, number> = {};
    const stopWords = new Set(['the', 'and', 'for', 'with', 'our', 'you', 'your', 'will', 'are', 'have', 'this', 'that', 'from', 'they', 'been', 'has', 'their', 'more', 'about', 'which', 'when', 'what', 'who', 'all', 'can', 'had', 'her', 'were', 'one', 'would', 'there', 'each', 'make', 'like', 'how', 'him', 'into', 'time', 'very', 'just', 'know', 'take', 'people', 'could', 'than', 'first', 'way', 'these', 'its', 'also', 'new', 'some', 'work', 'able']);

    words.forEach(word => {
        if (!stopWords.has(word) && word.length > 3) {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        }
    });

    const keywords = Object.entries(wordFreq)
        .filter(([_, count]) => count >= 2)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([word]) => word)
        .filter(word => !hardSkills.includes(word) && !softSkills.includes(word));

    return {
        hardSkills: [...new Set(hardSkills)],
        softSkills: [...new Set(softSkills)],
        experience: [...new Set(experience)],
        education: [...new Set(education)],
        certifications: [...new Set(certifications)],
        tools: [...new Set(tools)],
        keywords: [...new Set(keywords)]
    };
}

/**
 * Extract all text content from CV
 */
function extractCVContent(cvData: CVData): { allText: string; skills: string[]; experience: string } {
    const parts: string[] = [];

    // Personal info
    if (cvData.personalInfo?.fullName) parts.push(cvData.personalInfo.fullName);
    if (cvData.personalInfo?.profession) parts.push(cvData.personalInfo.profession);

    // Summary
    if (cvData.summary) parts.push(cvData.summary);

    // Experiences
    cvData.experiences?.forEach(exp => {
        if (exp.position) parts.push(exp.position);
        if (exp.company) parts.push(exp.company);
        if (exp.description) parts.push(exp.description);
    });

    // Education
    cvData.education?.forEach(edu => {
        if (edu.degree) parts.push(edu.degree);
        if (edu.field) parts.push(edu.field);
        if (edu.institution) parts.push(edu.institution);
    });

    // Skills
    const skillNames = cvData.skills?.map(s => s.name) || [];
    parts.push(...skillNames);

    return {
        allText: parts.join(' ').toLowerCase(),
        skills: skillNames,
        experience: cvData.experiences?.map(e => e.description || '').join(' ') || ''
    };
}

/**
 * Analyze experience match
 */
function analyzeExperience(cvData: CVData, jobDescription: string): JobMatchResult['experienceMatch'] {
    // Extract required years from JD
    const yearsMatch = jobDescription.match(/(\d+)\+?\s*(?:years?|yrs?|ans?)/i);
    const requiredYears = yearsMatch ? parseInt(yearsMatch[1]) : null;

    // Calculate user's total experience
    let totalMonths = 0;
    cvData.experiences?.forEach(exp => {
        if (exp.startDate) {
            const start = new Date(exp.startDate);
            const end = exp.current ? new Date() : (exp.endDate ? new Date(exp.endDate) : new Date());
            const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
            totalMonths += Math.max(0, months);
        }
    });

    const userYears = Math.round(totalMonths / 12);

    // Determine status
    let status: 'exceeds' | 'meets' | 'close' | 'lacking' = 'meets';
    if (requiredYears) {
        if (userYears >= requiredYears + 2) status = 'exceeds';
        else if (userYears >= requiredYears) status = 'meets';
        else if (userYears >= requiredYears - 1) status = 'close';
        else status = 'lacking';
    }

    return {
        required: requiredYears ? `${requiredYears}+ years` : null,
        yours: userYears,
        status
    };
}

/**
 * Analyze education match
 */
function analyzeEducation(cvData: CVData, requiredEducation: string[]): JobMatchResult['educationMatch'] {
    const userEducation = cvData.education?.map(e =>
        `${e.degree || ''} ${e.field || ''}`.toLowerCase()
    ) || [];

    const userEducationText = userEducation.join(' ');

    // Check how many required terms are matched
    const matchedTerms = requiredEducation.filter(term =>
        userEducationText.includes(term.toLowerCase())
    );

    let status: 'meets' | 'partial' | 'lacking' = 'lacking';
    if (requiredEducation.length === 0 || matchedTerms.length === requiredEducation.length) {
        status = 'meets';
    } else if (matchedTerms.length > 0) {
        status = 'partial';
    }

    return {
        required: requiredEducation,
        yours: userEducation,
        status
    };
}

/**
 * Calculate overall match score
 */
function calculateMatchScore(data: {
    matchingSkills: string[];
    missingSkills: string[];
    matchingKeywords: string[];
    missingKeywords: string[];
    experienceMatch: JobMatchResult['experienceMatch'];
    educationMatch: JobMatchResult['educationMatch'];
    totalRequirements: JobMatchResult['extractedRequirements'];
}): number {
    let score = 0;
    let maxScore = 0;

    // Skills (40% weight)
    const totalSkills = data.matchingSkills.length + data.missingSkills.length;
    if (totalSkills > 0) {
        const skillScore = (data.matchingSkills.length / totalSkills) * 40;
        score += skillScore;
    } else {
        score += 20; // No skills requirements = assume 50%
    }
    maxScore += 40;

    // Keywords (25% weight)
    const totalKeywords = data.matchingKeywords.length + data.missingKeywords.length;
    if (totalKeywords > 0) {
        const keywordScore = (data.matchingKeywords.length / totalKeywords) * 25;
        score += keywordScore;
    } else {
        score += 12.5;
    }
    maxScore += 25;

    // Experience (20% weight)
    switch (data.experienceMatch.status) {
        case 'exceeds': score += 20; break;
        case 'meets': score += 18; break;
        case 'close': score += 12; break;
        case 'lacking': score += 5; break;
    }
    maxScore += 20;

    // Education (15% weight)
    switch (data.educationMatch.status) {
        case 'meets': score += 15; break;
        case 'partial': score += 10; break;
        case 'lacking': score += 3; break;
    }
    maxScore += 15;

    return Math.round(score);
}

/**
 * Get match grade from score
 */
function getMatchGrade(score: number): { grade: 'A' | 'B' | 'C' | 'D' | 'F'; label: string } {
    if (score >= 85) return { grade: 'A', label: 'Excellent Match' };
    if (score >= 70) return { grade: 'B', label: 'Strong Match' };
    if (score >= 55) return { grade: 'C', label: 'Moderate Match' };
    if (score >= 40) return { grade: 'D', label: 'Weak Match' };
    return { grade: 'F', label: 'Poor Match' };
}

/**
 * Generate priority actions for improvement
 */
function generatePriorityActions(
    missingSkills: string[],
    missingKeywords: string[],
    experienceMatch: JobMatchResult['experienceMatch'],
    educationMatch: JobMatchResult['educationMatch'],
    requirements: JobMatchResult['extractedRequirements']
): JobMatchResult['priorityActions'] {
    const actions: JobMatchResult['priorityActions'] = [];

    // High priority: Missing hard skills
    const techMissing = missingSkills.filter(s => TECH_SKILLS_DB.includes(s.toLowerCase()));
    techMissing.slice(0, 3).forEach(skill => {
        actions.push({
            category: 'skill',
            action: `Add "${skill}" to your skills section`,
            priority: 'high',
            canAutoFix: true
        });
    });

    // Medium priority: Missing keywords
    missingKeywords.slice(0, 3).forEach(keyword => {
        actions.push({
            category: 'keyword',
            action: `Include "${keyword}" in your experience descriptions`,
            priority: 'medium',
            canAutoFix: true
        });
    });

    // High priority: Experience gap
    if (experienceMatch.status === 'lacking') {
        actions.push({
            category: 'experience',
            action: `Highlight relevant projects or freelance work to compensate for ${experienceMatch.required || 'required'} experience`,
            priority: 'high',
            canAutoFix: false
        });
    }

    // Medium priority: Education gap
    if (educationMatch.status === 'lacking' && requirements.education.length > 0) {
        actions.push({
            category: 'education',
            action: `Consider adding relevant certifications to compensate for education requirements`,
            priority: 'medium',
            canAutoFix: false
        });
    }

    // Medium priority: Missing certifications
    if (requirements.certifications.length > 0) {
        actions.push({
            category: 'certification',
            action: `This role may prefer: ${requirements.certifications.slice(0, 2).join(', ')}`,
            priority: 'medium',
            canAutoFix: false
        });
    }

    // Medium priority: Soft skills
    const softMissing = missingSkills.filter(s => SOFT_SKILLS_DB.includes(s.toLowerCase()));
    if (softMissing.length > 0) {
        actions.push({
            category: 'skill',
            action: `Demonstrate "${softMissing[0]}" in your experience bullets`,
            priority: 'medium',
            canAutoFix: true
        });
    }

    return actions.slice(0, 8); // Max 8 actions
}

/**
 * Generate insights about the match
 */
function generateInsights(
    matchingSkills: string[],
    missingSkills: string[],
    matchingKeywords: string[],
    missingKeywords: string[],
    experienceMatch: JobMatchResult['experienceMatch'],
    cvData: CVData
): JobMatchResult['insights'] {
    const strongPoints: string[] = [];
    const gapAreas: string[] = [];
    let competitiveAdvantage: string | null = null;

    // Strong points
    if (matchingSkills.length >= 5) {
        strongPoints.push(`Strong technical alignment with ${matchingSkills.length} matching skills`);
    }

    if (experienceMatch.status === 'exceeds') {
        strongPoints.push(`Experience exceeds requirements (${experienceMatch.yours} years)`);
        competitiveAdvantage = 'Your experience level is a key differentiator';
    } else if (experienceMatch.status === 'meets') {
        strongPoints.push(`Experience meets requirements`);
    }

    if (matchingKeywords.length >= 5) {
        strongPoints.push('Good keyword optimization for ATS');
    }

    // Check for unique skills
    const uniqueSkills = cvData.skills?.filter(s =>
        !missingSkills.map(m => m.toLowerCase()).includes(s.name.toLowerCase()) &&
        !matchingSkills.map(m => m.toLowerCase()).includes(s.name.toLowerCase())
    ) || [];

    if (uniqueSkills.length >= 3) {
        strongPoints.push(`${uniqueSkills.length} additional relevant skills that may set you apart`);
    }

    // Gap areas
    if (missingSkills.length > matchingSkills.length) {
        gapAreas.push(`Missing ${missingSkills.length} required skills`);
    }

    if (experienceMatch.status === 'lacking') {
        gapAreas.push(`Experience gap: you have ${experienceMatch.yours}yr vs ${experienceMatch.required} required`);
    }

    if (missingKeywords.length > 5) {
        gapAreas.push('Many important keywords missing - consider customizing your CV');
    }

    // Competitive advantage
    if (!competitiveAdvantage && matchingSkills.length >= 8) {
        competitiveAdvantage = 'Your skill set is highly aligned with this role';
    }

    return {
        strongPoints,
        gapAreas,
        competitiveAdvantage
    };
}

/**
 * Quick match check - returns just the score
 */
export function quickMatchScore(cvData: CVData, jobDescription: string): number {
    return matchJobDescription(cvData, jobDescription).matchScore;
}

/**
 * Get suggested skills to add based on job description
 */
export function getSuggestedSkills(cvData: CVData, jobDescription: string): string[] {
    const result = matchJobDescription(cvData, jobDescription);
    return result.missingSkills.slice(0, 5);
}

export default matchJobDescription;
