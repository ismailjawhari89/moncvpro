import { CVData, AISuggestion } from '@/types/cv';

// Action verbs for smart improvements
const ACTION_VERBS = [
    'Led', 'Managed', 'Developed', 'Created', 'Implemented', 'Achieved',
    'Increased', 'Improved', 'Designed', 'Built', 'Delivered', 'Launched',
    'Optimized', 'Streamlined', 'Reduced', 'Generated', 'Transformed',
    'Mentored', 'Coordinated', 'Established', 'Pioneered', 'Spearheaded'
];

/**
 * Service to handle pure CV logic (Smart Improvements, Keyword matching, etc.)
 * This service does NOT depend on the Store. It accepts data and returns transformed data.
 */
export const CVAIService = {
    /**
     * Add an action verb to the beginning of a description if not present.
     */
    addActionVerb(description: string): string {
        const trimmed = description.trim();
        if (!trimmed) return trimmed;

        // Check if already starts with action verb
        const startsWithActionVerb = ACTION_VERBS.some(verb =>
            trimmed.toLowerCase().startsWith(verb.toLowerCase())
        );

        if (startsWithActionVerb) return trimmed;

        // Choose random action verb
        const randomVerb = ACTION_VERBS[Math.floor(Math.random() * ACTION_VERBS.length)];

        // Lowercase first letter of original if it exists
        const modifiedDesc = trimmed.charAt(0).toLowerCase() + trimmed.slice(1);

        return `${randomVerb} ${modifiedDesc}`;
    },

    /**
     * Suggest skills based on profession.
     */
    suggestSkillsForProfession(profession?: string): string[] {
        if (!profession) return [];

        const professionLower = profession.toLowerCase();

        // Tech roles
        if (professionLower.includes('developer') || professionLower.includes('engineer') || professionLower.includes('programmer')) {
            return ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Git', 'Agile', 'REST APIs', 'Database Design'];
        }
        if (professionLower.includes('data') && (professionLower.includes('scientist') || professionLower.includes('analyst'))) {
            return ['Python', 'SQL', 'Machine Learning', 'Data Visualization', 'Statistics', 'Tableau', 'R'];
        }
        if (professionLower.includes('devops') || professionLower.includes('cloud')) {
            return ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux', 'Monitoring'];
        }

        // Business roles
        if (professionLower.includes('manager') || professionLower.includes('lead') || professionLower.includes('director')) {
            return ['Leadership', 'Project Management', 'Strategic Planning', 'Team Building', 'Budgeting', 'Stakeholder Management'];
        }
        if (professionLower.includes('product')) {
            return ['Product Strategy', 'User Research', 'Roadmap Planning', 'Agile/Scrum', 'Data Analysis', 'A/B Testing'];
        }

        // Marketing & Creative
        if (professionLower.includes('marketing')) {
            return ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics', 'Social Media', 'Email Marketing', 'PPC'];
        }
        if (professionLower.includes('design')) {
            return ['Figma', 'Adobe Creative Suite', 'UI/UX', 'Wireframing', 'Prototyping', 'User Research', 'Design Systems'];
        }
        if (professionLower.includes('content') || professionLower.includes('writer') || professionLower.includes('copywriter')) {
            return ['Content Writing', 'SEO Writing', 'Storytelling', 'Editing', 'Research', 'CMS', 'Social Media'];
        }

        // Sales & Customer
        if (professionLower.includes('sales') || professionLower.includes('account')) {
            return ['Negotiation', 'CRM (Salesforce)', 'Lead Generation', 'Client Relations', 'Presentation', 'Pipeline Management'];
        }
        if (professionLower.includes('customer') || professionLower.includes('support')) {
            return ['Customer Service', 'Problem Resolution', 'Communication', 'Zendesk', 'Conflict Resolution', 'Empathy'];
        }

        // Finance & HR
        if (professionLower.includes('finance') || professionLower.includes('accountant')) {
            return ['Financial Analysis', 'Budgeting', 'Excel', 'Forecasting', 'Reporting', 'QuickBooks', 'Compliance'];
        }
        if (professionLower.includes('hr') || professionLower.includes('recruiter') || professionLower.includes('talent')) {
            return ['Recruiting', 'Employee Relations', 'HRIS', 'Performance Management', 'Onboarding', 'Labor Law'];
        }

        // Default soft skills
        return ['Communication', 'Problem Solving', 'Teamwork', 'Time Management', 'Adaptability', 'Critical Thinking'];
    },

    /**
     * Improve summary with keywords.
     */
    improveSummaryWithKeywords(currentSummary: string, keywords: string[]): string {
        if (!currentSummary) return currentSummary;

        // Add keywords if not already present
        let improvedSummary = currentSummary;
        const missingKeywords = keywords.filter(
            kw => !currentSummary.toLowerCase().includes(kw.toLowerCase())
        );

        if (missingKeywords.length > 0) {
            improvedSummary += ` Key expertise includes: ${missingKeywords.join(', ')}.`;
        }

        return improvedSummary;
    },

    /**
     * Generate structured Smart Fix suggestions for the entire CV.
     */
    generateSmartFixSuggestions(cvData: CVData): AISuggestion[] {
        const suggestions: AISuggestion[] = [];
        const now = Date.now();

        // 1. Check Personal Info
        if (!cvData.personalInfo.phone) {
            suggestions.push({
                id: `fix-phone-${now}`,
                type: 'personal',
                field: 'phone',
                improvementBrief: 'Add phone number',
                suggestedContent: '+212 600 000 000',
                reason: 'A phone number is essential for recruiters to reach you.',
                applied: false,
                timestamp: now
            });
        }

        // 2. Check Summary
        if (!cvData.summary || cvData.summary.length < 50) {
            suggestions.push({
                id: `fix-summary-${now}`,
                type: 'summary',
                improvementBrief: 'Expand professional summary',
                originalContent: cvData.summary,
                suggestedContent: cvData.summary + ' Goal-oriented professional with a strong track record of delivering high-quality results in fast-paced environments.',
                reason: 'A stronger summary captures attention better.',
                applied: false,
                timestamp: now
            });
        }

        // 3. Check Experiences
        cvData.experiences.forEach((exp, index) => {
            if (exp.description.length < 30) {
                suggestions.push({
                    id: `fix-exp-${exp.id}-${now}`,
                    type: 'experience',
                    targetId: exp.id,
                    targetItemTitle: `${exp.position} at ${exp.company}`,
                    field: 'description',
                    improvementBrief: 'Enhance job description',
                    originalContent: exp.description,
                    suggestedContent: this.addActionVerb(exp.description) + '. Consistently met performance targets and improved team efficiency through proactive collaboration.',
                    reason: 'Adding action verbs and more detail makes your experience more impactful.',
                    applied: false,
                    timestamp: now
                });
            }
        });

        // 4. Check Skills
        if (cvData.skills.length < 5) {
            const extra = this.suggestSkillsForProfession(cvData.personalInfo.profession).slice(0, 2);
            extra.forEach((skillName, i) => {
                suggestions.push({
                    id: `fix-skill-${i}-${now}`,
                    type: 'general', // We treat new additions as general suggestions maybe? 
                    // Or we could have a "new-item" type. For now let's focus on improvements.
                    improvementBrief: `Add key skill: ${skillName}`,
                    suggestedContent: skillName,
                    reason: 'This skill is highly relevant to your profession.',
                    applied: false,
                    timestamp: now
                });
            });
        }

        return suggestions;
    },

    /**
     * Improve an experience description description by adding an action verb.
     */
    improveExperience(description: string): string {
        return this.addActionVerb(description);
    },

    /**
     * Generate All Improvements for the CV.
     * Returns the modified CV Data and a list of improvements made.
     */
    autoImproveAll(cvData: CVData): { improvedData: CVData, report: { section: string; improvement: string }[] } {
        const improvements: { section: string; improvement: string }[] = [];
        const newData = JSON.parse(JSON.stringify(cvData)); // Deep copy to avoid mutating

        // 1. Improve experiences with action verbs
        newData.experiences = newData.experiences.map((exp: any) => {
            const improved = this.addActionVerb(exp.description);
            if (improved !== exp.description) {
                improvements.push({
                    section: `Experience: ${exp.position}`,
                    improvement: 'Added action verb'
                });
            }
            return { ...exp, description: improved };
        });

        // 2. Suggest skills based on profession
        const suggestedSkills = this.suggestSkillsForProfession(newData.personalInfo.profession);
        const existingSkillNames = newData.skills.map((s: any) => s.name.toLowerCase());
        const newSkills = suggestedSkills
            .filter(s => !existingSkillNames.includes(s.toLowerCase()))
            .slice(0, 3) // Add max 3 new skills
            .map((name, index) => ({
                id: `auto-skill-${Date.now()}-${index}`,
                name,
                level: 4,
                category: 'technical' as const
            }));

        if (newSkills.length > 0) {
            newData.skills = [...newData.skills, ...newSkills];
            improvements.push({
                section: 'Skills',
                improvement: `Added ${newSkills.length} relevant skills`
            });
        }

        // 3. Improve summary length if too short
        if (newData.summary && newData.summary.length < 100) {
            newData.summary += ` Committed to delivering high-quality results and continuous professional development.`;
            improvements.push({
                section: 'Summary',
                improvement: 'Expanded professional summary'
            });
        }

        return { improvedData: newData, report: improvements };
    }
};
