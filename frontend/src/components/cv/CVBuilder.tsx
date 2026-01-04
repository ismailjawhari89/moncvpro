
'use client';

import React, { useState, useEffect } from 'react';
import { ATSModeToggle } from './ATSModeToggle';
import CVPreview from './CVPreview';
import ExportPanel from './ExportPanel';
import { CVData } from '../../types/cv';
import { analytics } from '../../services/analytics';

// Dummy initial data
const initialData: CVData = {
    personalInfo: {
        fullName: 'John Doe',
        jobTitle: 'Senior Software Engineer',
        email: 'john.doe@example.com',
        phone: '+1 234 567 8900',
        location: 'San Francisco, CA',
        photoUrl: '/images/avatar-placeholder.png', // This should be a real path in a real app
        summary: 'Experienced software engineer specialized in frontend development and UX design.',
        address: '123 Tech Lane'
    },
    experience: [],
    education: [],
    skills: [],
    languages: []
};

export default function CVBuilder() {
    const [atsMode, setAtsMode] = useState<boolean>(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [cvData, setCvData] = useState<CVData>(initialData);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('modern-pro');

    useEffect(() => {
        analytics.pageView('CV Editor');
    }, []);

    const handleAtsToggle = (mode: boolean) => {
        setAtsMode(mode);
        analytics.identify('user_placeholder', { last_active_template: selectedTemplate }); // Example identity
        analytics.error('Example Test Error', { component: 'CVBuilder', action: 'toggleAts' }); // Smoke test error track
    };

    return (
        <div style={{ fontFamily: 'sans-serif', height: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* 1. Toolbar Section */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                borderBottom: '1px solid #e5e7eb',
                background: 'white',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <h1 style={{ fontSize: '18px', fontWeight: 'bold' }}>CV Builder</h1>

                    {/* NEW: ATS Mode Toggle */}
                    <ATSModeToggle
                        atsMode={atsMode}
                        onToggle={handleAtsToggle}
                        isDark={theme === 'dark'}
                    />

                    {/* Mode indicator text */}
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        {atsMode
                            ? '🛡️ ATS Optimized (No images)'
                            : '👁️ Professional (Full design)'}
                    </span>
                </div>

                {/* Simple Theme Toggle for demo */}
                <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} style={{ padding: '4px 8px' }}>
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
            </div>

            {/* Main Content Area */}
            <div style={{ display: 'flex', flex: 1, backgroundColor: '#f3f4f6' }}>

                {/* 2. Left Panel: Editor (Placeholder) */}
                <div style={{ flex: 1, padding: '20px', borderRight: '1px solid #e5e7eb', backgroundColor: 'white' }}>
                    <h2>Editor (Inputs)</h2>
                    <p>This section would contain the input forms for Personal Info, Experience, etc.</p>
                    <div style={{ marginTop: '20px', padding: '10px', background: '#e0f2fe', borderRadius: '4px' }}>
                        <strong>Debug Info:</strong><br />
                        Current Mode: {atsMode ? 'ATS' : 'Pro'}<br />
                        Template: {selectedTemplate}
                    </div>
                </div>

                {/* 3. Center Panel: Preview */}
                <div style={{ flex: 2, padding: '20px', overflowY: 'auto' }}>
                    <CVPreview
                        data={cvData}
                        activeTemplate={selectedTemplate}
                        atsMode={atsMode}  // PASSING STATE
                    />
                </div>

                {/* 4. Right Panel: Export & Settings */}
                <div style={{ width: '300px', padding: '20px', borderLeft: '1px solid #e5e7eb', backgroundColor: 'white' }}>
                    <ExportPanel
                        cvData={cvData}
                        atsMode={atsMode} // PASSING STATE
                        previewElementId="cv-preview"
                        isDark={theme === 'dark'}
                    />
                </div>

            </div>
        </div>
    );
}
