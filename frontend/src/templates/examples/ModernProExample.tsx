/**
 * Modern Pro Template Usage Example
 * Demonstrates how to use the Modern Pro template
 */

import React from 'react';
import { getTemplate } from '../definitions';
import { TemplateRenderer } from '../components/TemplateRenderer';
import { CVData } from '../types';

// Sample CV data
const sampleCVData: CVData = {
    personalInfo: {
        fullName: 'Ahmed Hassan',
        jobTitle: 'Senior Software Engineer',
        email: 'ahmed.hassan@example.com',
        phone: '+212 6 12 34 56 78',
        location: 'Casablanca, Morocco',
        photoUrl: '/images/sample-photo.jpg',
        summary: 'Experienced software engineer with 8+ years in full-stack development. Specialized in React, Node.js, and cloud architecture. Passionate about building scalable applications and mentoring junior developers.',
    },
    experience: [
        {
            id: '1',
            jobTitle: 'Senior Software Engineer',
            company: 'Tech Solutions Inc.',
            location: 'Casablanca, Morocco',
            startDate: '2020-01',
            endDate: undefined,
            current: true,
            description: 'Leading development of enterprise web applications',
            achievements: [
                'Architected and deployed microservices infrastructure serving 1M+ users',
                'Reduced application load time by 60% through optimization',
                'Mentored team of 5 junior developers',
            ],
        },
        {
            id: '2',
            jobTitle: 'Full Stack Developer',
            company: 'Digital Agency',
            location: 'Rabat, Morocco',
            startDate: '2017-06',
            endDate: '2019-12',
            current: false,
            description: 'Developed client-facing web applications',
            achievements: [
                'Built 15+ responsive web applications',
                'Implemented CI/CD pipeline reducing deployment time by 40%',
            ],
        },
    ],
    education: [
        {
            id: '1',
            degree: 'Master of Computer Science',
            institution: 'Mohammed V University',
            location: 'Rabat, Morocco',
            startDate: '2013-09',
            endDate: '2015-06',
            current: false,
            gpa: '3.8/4.0',
        },
        {
            id: '2',
            degree: 'Bachelor of Software Engineering',
            institution: 'Hassan II University',
            location: 'Casablanca, Morocco',
            startDate: '2009-09',
            endDate: '2013-06',
            current: false,
        },
    ],
    skills: [
        { id: '1', name: 'React', category: 'Frontend', level: 5 },
        { id: '2', name: 'TypeScript', category: 'Frontend', level: 5 },
        { id: '3', name: 'Next.js', category: 'Frontend', level: 4 },
        { id: '4', name: 'Node.js', category: 'Backend', level: 5 },
        { id: '5', name: 'Express', category: 'Backend', level: 4 },
        { id: '6', name: 'PostgreSQL', category: 'Database', level: 4 },
        { id: '7', name: 'MongoDB', category: 'Database', level: 4 },
        { id: '8', name: 'AWS', category: 'DevOps', level: 4 },
        { id: '9', name: 'Docker', category: 'DevOps', level: 4 },
    ],
    languages: [
        { id: '1', name: 'Arabic', proficiency: 'Native', level: 5 },
        { id: '2', name: 'French', proficiency: 'Fluent', level: 5 },
        { id: '3', name: 'English', proficiency: 'Fluent', level: 5 },
    ],
};

/**
 * Example: Using Modern Pro Template
 */
export const ModernProExample: React.FC = () => {
    // Get the Modern Pro template
    const template = getTemplate('modern-pro');

    if (!template) {
        return <div>Template not found</div>;
    }

    return (
        <div>
            <h1>Modern Pro Template Example</h1>

            {/* Render with default settings */}
            <TemplateRenderer
                template={template}
                data={sampleCVData}
                locale="en"
            />
        </div>
    );
};

/**
 * Example: Using Modern Pro Template with Customizations
 */
export const ModernProCustomizedExample: React.FC = () => {
    const template = getTemplate('modern-pro');

    if (!template) {
        return <div>Template not found</div>;
    }

    // Custom color scheme
    const customColors = {
        colors: {
            primary: '#059669', // Green instead of blue
            background: '#ffffff',
            text: '#111827',
            mutedText: '#6b7280',
            borders: '#e5e7eb',
        },
    };

    return (
        <div>
            <h1>Modern Pro Template - Customized</h1>

            {/* Render with custom colors */}
            <TemplateRenderer
                template={template}
                data={sampleCVData}
                locale="en"
                customizations={customColors}
            />
        </div>
    );
};

/**
 * Example: Using Modern Pro Template in RTL (Arabic)
 */
export const ModernProRTLExample: React.FC = () => {
    const template = getTemplate('modern-pro');

    if (!template) {
        return <div>Template not found</div>;
    }

    // Arabic CV data
    const arabicCVData: CVData = {
        personalInfo: {
            fullName: 'أحمد حسن',
            jobTitle: 'مهندس برمجيات أول',
            email: 'ahmed.hassan@example.com',
            phone: '+212 6 12 34 56 78',
            location: 'الدار البيضاء، المغرب',
            photoUrl: '/images/sample-photo.jpg',
            summary: 'مهندس برمجيات ذو خبرة تزيد عن 8 سنوات في تطوير التطبيقات الكاملة. متخصص في React و Node.js والبنية السحابية.',
        },
        experience: sampleCVData.experience,
        education: sampleCVData.education,
        skills: sampleCVData.skills,
        languages: sampleCVData.languages,
    };

    return (
        <div>
            <h1>Modern Pro Template - RTL (Arabic)</h1>

            {/* Render in Arabic (RTL) */}
            <TemplateRenderer
                template={template}
                data={arabicCVData}
                locale="ar"
            />
        </div>
    );
};

export default ModernProExample;
