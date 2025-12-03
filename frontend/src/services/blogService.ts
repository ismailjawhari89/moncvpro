import { User } from 'lucide-react';

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    coverImage: string;
    author: {
        name: string;
        avatar: string;
        role: string;
    };
    category: string;
    tags: string[];
    publishedAt: string;
    readTime: string;
}

const BLOG_POSTS: BlogPost[] = [
    {
        id: '1',
        slug: 'how-to-write-perfect-cv-2025',
        title: 'How to Write the Perfect CV in 2025: The Ultimate Guide',
        excerpt: 'Discover the latest trends in CV writing, from AI-friendly formats to skills-based layouts. Learn what recruiters are really looking for this year.',
        coverImage: '/blog/perfect-cv-2025.jpg',
        author: {
            name: 'Sarah Johnson',
            avatar: '/avatars/sarah.jpg',
            role: 'Senior HR Specialist'
        },
        category: 'CV Tips',
        tags: ['CV Writing', 'Career Advice', '2025 Trends'],
        publishedAt: '2025-12-01',
        readTime: '8 min read',
        content: `
            <h2>The Evolution of CVs in 2025</h2>
            <p>The job market has changed dramatically. Gone are the days of generic, one-size-fits-all resumes. In 2025, personalization and ATS optimization are key.</p>
            
            <h3>1. AI Compatibility is Non-Negotiable</h3>
            <p>With 99% of Fortune 500 companies using Applicant Tracking Systems (ATS), your CV needs to be machine-readable. Avoid complex graphics, tables, and unusual fonts.</p>
            
            <h3>2. Focus on Skills, Not Just Duties</h3>
            <p>Recruiters are shifting towards skills-based hiring. Instead of listing your daily tasks, highlight the specific skills you used and the impact you made.</p>
            
            <h3>3. Quantifiable Achievements</h3>
            <p>Don't just say you "managed a team." Say you "led a team of 15 developers, increasing productivity by 20%." Numbers speak louder than words.</p>
            
            <h2>Key Sections to Include</h2>
            <ul>
                <li><strong>Professional Summary:</strong> A hook that grabs attention in 6 seconds.</li>
                <li><strong>Core Competencies:</strong> A list of your top hard and soft skills.</li>
                <li><strong>Experience:</strong> Reverse chronological order with achievement-focused bullets.</li>
                <li><strong>Education:</strong> Relevant degrees and certifications.</li>
            </ul>
        `
    },
    {
        id: '2',
        slug: 'top-skills-employers-want-2025',
        title: 'Top 10 Soft & Hard Skills Employers Want in 2025',
        excerpt: 'Stay ahead of the curve by mastering the most in-demand skills. From AI literacy to emotional intelligence, here is what you need to know.',
        coverImage: '/blog/top-skills.jpg',
        author: {
            name: 'Mike Chen',
            avatar: '/avatars/mike.jpg',
            role: 'Career Coach'
        },
        category: 'Career Development',
        tags: ['Skills', 'Job Market', 'Professional Growth'],
        publishedAt: '2025-11-28',
        readTime: '6 min read',
        content: `
            <h2>The Skills Gap is Real</h2>
            <p>As technology evolves, so do the skills required to succeed. Here are the top skills you should highlight on your CV in 2025.</p>
            
            <h3>Top Hard Skills</h3>
            <ol>
                <li><strong>AI Literacy:</strong> Understanding how to work with AI tools is now a basic requirement in many fields.</li>
                <li><strong>Data Analysis:</strong> The ability to interpret data to make informed decisions.</li>
                <li><strong>Cloud Computing:</strong> Familiarity with AWS, Azure, or Google Cloud.</li>
            </ol>
            
            <h3>Top Soft Skills</h3>
            <ol>
                <li><strong>Adaptability:</strong> The ability to pivot quickly in a changing environment.</li>
                <li><strong>Emotional Intelligence:</strong> Understanding and managing your own emotions and those of others.</li>
                <li><strong>Critical Thinking:</strong> Analyzing facts to form a judgment.</li>
            </ol>
        `
    },
    {
        id: '3',
        slug: 'common-cv-mistakes-to-avoid',
        title: '7 Common CV Mistakes That Are Costing You Interviews',
        excerpt: 'Are you making these fatal errors on your resume? Find out how to fix them and boost your chances of landing an interview.',
        coverImage: '/blog/cv-mistakes.jpg',
        author: {
            name: 'Emma Wilson',
            avatar: '/avatars/emma.jpg',
            role: 'Recruitment Manager'
        },
        category: 'CV Mistakes',
        tags: ['Mistakes', 'Job Search', 'Tips'],
        publishedAt: '2025-11-25',
        readTime: '5 min read',
        content: `
            <h2>Don't Let These Mistakes Hold You Back</h2>
            <p>Even the most qualified candidates can get rejected due to simple CV errors. Here's what to avoid.</p>
            
            <h3>1. Typos and Grammatical Errors</h3>
            <p>Attention to detail is crucial. A single typo can send your CV to the "no" pile. Always proofread.</p>
            
            <h3>2. Using an Unprofessional Email Address</h3>
            <p>party.animal99@gmail.com won't cut it. Use a variation of your name (e.g., firstname.lastname@gmail.com).</p>
            
            <h3>3. Including Irrelevant Information</h3>
            <p>No need to include your marital status, religion, or a photo (unless required in your country). Keep it professional.</p>
            
            <h3>4. Generic Objectives</h3>
            <p>Replace "Looking for a challenging role" with a specific professional summary tailored to the job.</p>
        `
    }
];

export const blogService = {
    getAllPosts: async (): Promise<BlogPost[]> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return BLOG_POSTS;
    },

    getPostBySlug: async (slug: string): Promise<BlogPost | null> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return BLOG_POSTS.find(post => post.slug === slug) || null;
    },

    getRecentPosts: async (limit: number = 3): Promise<BlogPost[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return BLOG_POSTS.slice(0, limit);
    },

    getRelatedPosts: async (currentSlug: string, limit: number = 2): Promise<BlogPost[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return BLOG_POSTS.filter(post => post.slug !== currentSlug).slice(0, limit);
    }
};
