
'use client';

import React, { useState } from 'react';
import { aiService } from '../../services/ai.service';

interface Props {
    cvId: string;
    section: 'experiences' | 'skills' | 'summary';
    jobDescription?: string;
    onApply: (improvedText: string) => void;
}

export function SuggestionPanel({ cvId, section, jobDescription, onApply }: Props) {
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [applying, setApplying] = useState<number | null>(null);

    const handleGetSuggestions = async () => {
        try {
            setIsLoading(true);
            const data = await aiService.getSectionSuggestions(cvId, section, jobDescription);
            setSuggestions(data.suggestions || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApplySuggestion = (idx: number) => {
        const suggestion = suggestions[idx];
        setApplying(idx);
        onApply(suggestion.improvedText);
        setTimeout(() => setApplying(null), 1000);
    };

    return (
        <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <button
                onClick={handleGetSuggestions}
                disabled={isLoading}
                style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    marginBottom: '16px'
                }}
            >
                {isLoading ? '🤖 Thinking...' : '✨ Get AI Suggestions'}
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {suggestions.map((sug, idx) => (
                    <div key={idx} style={{
                        padding: '12px',
                        backgroundColor: 'white',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb'
                    }}>
                        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>{sug.explanation}</p>

                        <div style={{ fontSize: '12px', color: '#991b1b', backgroundColor: '#fef2f2', padding: '6px', borderRadius: '4px', marginBottom: '8px' }}>
                            <strong>Before:</strong> {sug.originalText}
                        </div>

                        <div style={{ fontSize: '12px', color: '#166534', backgroundColor: '#f0fdf4', padding: '6px', borderRadius: '4px', marginBottom: '12px' }}>
                            <strong>After:</strong> {sug.improvedText}
                        </div>

                        <button
                            onClick={() => handleApplySuggestion(idx)}
                            disabled={applying === idx}
                            style={{
                                width: '100%',
                                padding: '6px',
                                backgroundColor: applying === idx ? '#9ca3af' : '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '13px'
                            }}
                        >
                            {applying === idx ? 'Applied! ✅' : 'Apply Change'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
