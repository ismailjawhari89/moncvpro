'use client';

import { useState } from 'react';
import CVForm from '@/components/cv/CVForm';
import CVPreview from '@/components/cv/CVPreview';
import type { CVData, TemplateType } from '@/types/cv';

export default function CVBuilderClient() {
    const [cvData, setCVData] = useState<CVData>({
        personal: { fullName: '', email: '', phone: '', location: '', summary: '' },
        experiences: [],
        education: [],
        skills: [],
        languages: []
    });
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');

    const handleDataChange = (data: CVData) => {
        setCVData(data);
    };

    return (
        <>
            <div className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
                <CVForm onDataChange={handleDataChange} initialData={cvData} />
            </div>

            <div>
                <CVPreview
                    data={cvData}
                    selectedTemplate={selectedTemplate}
                    onTemplateChange={setSelectedTemplate}
                />
            </div>
        </>
    );
}
