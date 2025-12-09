/**
 * STAR Framework Logic (Situation, Task, Action, Result)
 * Helps users structure their bullet points for maximum impact
 */

export interface STARContent {
    situation: string;
    task: string;
    action: string;
    result: string;
}

export interface AchievementTemplate {
    id: string;
    label: string;
    icon: string;
    prompts: STARContent;
    example: STARContent;
}

export const STAR_TEMPLATES: AchievementTemplate[] = [
    {
        id: 'technical-project',
        label: 'Technical Project',
        icon: 'Code',
        prompts: {
            situation: 'What was the problem or challenge you faced?',
            task: 'What was your specific role or goal?',
            action: 'What technical solution did you implement? (languages, tools)',
            result: 'What was the quantifiable outcome? (performance, cost, users)'
        },
        example: {
            situation: 'Legacy e-commerce platform was suffering from 5s load times during peak traffic.',
            task: 'I needed to optimize frontend performance to improve conversion rates.',
            action: 'Rebuilt the core product page using Next.js and implemented aggressive caching strategies.',
            result: 'Reduced load time by 60% (to 2s) and increased conversion rate by 15%.'
        }
    },
    {
        id: 'optimization',
        label: 'Process Optimization',
        icon: 'Zap',
        prompts: {
            situation: 'Describe an inefficient process or bottleneck.',
            task: 'What was the goal of the optimization?',
            action: ' What specific steps did you take to improve it?',
            result: 'How much time or money was saved?'
        },
        example: {
            situation: 'Manual data entry for monthly reports took 20 hours per week.',
            task: 'Automate the reporting pipeline to save engineering time.',
            action: 'Developed a Python script using Pandas to auto-generate reports from SQL databases.',
            result: 'Saved 80+ hours monthly and eliminated data entry errors.'
        }
    },
    {
        id: 'leadership',
        label: 'Leadership & Mentoring',
        icon: 'Users',
        prompts: {
            situation: 'What was the team context or challenge?',
            task: 'What was your leadership goal?',
            action: 'How did you mentor, guide, or lead the team?',
            result: 'What was the impact on team performance or morale?'
        },
        example: {
            situation: 'Junior developers were struggling with complex codebase onboarding.',
            task: 'Improve the onboarding process and code quality.',
            action: 'Implemented pair programming sessions and created comprehensive documentation.',
            result: 'Reduced onboarding time from 4 weeks to 2 weeks and decreased bug rate by 30%.'
        }
    },
    {
        id: 'sales',
        label: 'Revenue & Sales',
        icon: 'TrendingUp',
        prompts: {
            situation: 'What was the market condition or sales target?',
            task: 'What was your individual or team target?',
            action: 'What strategy did you use to close deals?',
            result: 'How much revenue did you generate?'
        },
        example: {
            situation: 'Q4 sales targets were at risk due to new competitor entry.',
            task: 'Exceed the annual revenue target of $1M.',
            action: 'Developed a new outreach strategy targeting underserved enterprise clients.',
            result: 'Generated $1.2M in revenue (120% of quota) and secured 3 key enterprise accounts.'
        }
    }
];

// Helper to assemble the components into a single strong bullet point
export function assembleSTARPoint(content: STARContent): string {
    const { situation, task, action, result } = content;

    // Combine into a cohesive sentence
    // Format 1: Action -> Result (Context)
    // Format 2: Context -> Action -> Result

    // We'll use a strong action-first format by default
    const fullSentence = `${action} to ${task}, resolving ${situation}. This resulted in ${result}.`;

    return fullSentence;
}

// Helper to generate a "preview" of the bullet point
export function generateSTARPreview(content: STARContent): string {
    const parts = [
        content.action,
        content.task ? `to ${content.task}` : '',
        content.result ? `resulting in ${content.result}` : ''
    ].filter(Boolean);

    return parts.join(', ');
}
