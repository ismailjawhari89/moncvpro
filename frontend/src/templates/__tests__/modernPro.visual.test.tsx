
/**
 * Visual Regression Tests for Modern Pro Template
 * Note: specific screenshot functionality requires Percy/Cypress integration.
 * This file sets up the render scenarios for manual or automated visual inspection.
 */

import React from 'react';
import { TemplateRenderer } from '../components/TemplateRenderer';
import { getTemplate } from '../definitions';
import { CVData } from '../types';

// Standard Test Data
const fullCVData: CVData = {
    personalInfo: {
        fullName: 'Visual Test User',
        jobTitle: 'Visual Tester & Designer',
        email: 'visual@test.com',
        phone: '+1 234 567 8900',
        location: 'Design City, DC',
        photoUrl: '/images/sample-photo.jpg',
        summary: 'A comprehensive summary text properly filling the space to test line height, font rendering, and wrapping behavior across multiple lines in the layout.',
    },
    experience: [
        {
            id: '1',
            jobTitle: 'Senior Tester',
            company: 'Quality Corp',
            location: 'New York',
            startDate: '2020',
            current: true,
            description: 'Ensuring pixel-perfect implementation.',
            achievements: ['Visual bug detection', 'Layout verification']
        },
        {
            id: '1',
            jobTitle: 'Junior Tester',
            company: 'Buggy Soft',
            location: 'New York',
            startDate: '2019',
            endDate: '2020',
            current: false,
            description: 'Finding bugs manually.',
        }
    ],
    education: [
        {
            id: '1',
            degree: 'BS Design',
            institution: 'Art School',
            location: 'Paris',
            startDate: '2015',
            endDate: '2019',
            current: false
        }
    ],
    skills: [
        { id: '1', name: 'CSS', category: 'Tech', level: 5 },
        { id: '2', name: 'Layout', category: 'Design', level: 4 }
    ],
    languages: [
        { id: '1', name: 'English', proficiency: 'Native' }
    ]
};

const rtlCVData: CVData = {
    ...fullCVData,
    personalInfo: {
        ...fullCVData.personalInfo,
        fullName: 'مستخدم تجريبي',
        jobTitle: 'مصمم واجهات',
        summary: 'هذا نص تجريبي للتحقق من دعم اللغة العربية وضبط الاتجاه من اليمين إلى اليسار.'
    }
};

export const VisualScenarios = () => {
    const template = getTemplate('modern-pro');

    if (!template) return <div>Template missing</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '20px', background: '#f0f0f0' }}>

            {/* Scenario 1: Desktop Viewport (A4 approx) */}
            <div id="visual-desktop" style={{ width: '794px', background: 'white', margin: '0 auto', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                <h3>Desktop / A4 Standard</h3>
                <TemplateRenderer template={template} data={fullCVData} />
            </div>

            {/* Scenario 2: Mobile Viewport */}
            <div id="visual-mobile" style={{ width: '375px', background: 'white', margin: '0 auto', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                <h3>Mobile / 375px</h3>
                <TemplateRenderer template={template} data={fullCVData} />
            </div>

            {/* Scenario 3: RTL Support */}
            <div id="visual-rtl" style={{ width: '794px', background: 'white', margin: '0 auto', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                <h3>RTL / Arabic</h3>
                <TemplateRenderer template={template} data={rtlCVData} locale="ar" />
            </div>

        </div>
    );
};

export default VisualScenarios;
