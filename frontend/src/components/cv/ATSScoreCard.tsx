
'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { aiService } from '../../services/ai.service';

interface Props {
    cvId: string;
    jobDescription?: string;
}

export function ATSScoreCard({ cvId, jobDescription }: Props) {
    const { data: atsData, isLoading, error } = useQuery({
        queryKey: ['atsScore', cvId, jobDescription],
        queryFn: () => aiService.calculateATSScore(cvId, jobDescription),
        enabled: !!cvId,
    });

    if (isLoading) return <div style={{ padding: '20px', textAlign: 'center' }}>Analyzing CV...</div>;
    if (error) return <div style={{ color: 'red' }}>Error calculating ATS score.</div>;

    const getScoreColor = (score: number) => {
        if (score >= 80) return '#16a34a'; // Green
        if (score >= 60) return '#ca8a04'; // Yellow
        return '#dc2626'; // Red
    };

    return (
        <div style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>ATS Score</h3>
                <div style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: getScoreColor(atsData.overallScore)
                }}>
                    {atsData.overallScore}/100
                </div>
            </div>

            {jobDescription && (
                <div style={{ marginTop: '16px' }}>
                    <p style={{ fontSize: '14px', color: '#4b5563' }}>
                        Match with job description: {atsData.matchPercentage}%
                    </p>
                    <div style={{
                        height: '8px',
                        width: '100%',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '4px',
                        marginTop: '4px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${atsData.matchPercentage}%`,
                            backgroundColor: '#3b82f6',
                            borderRadius: '4px'
                        }} />
                    </div>
                </div>
            )}

            {/* Breakdown */}
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(atsData.breakdown || {}).map(([key, value]: [string, any]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                        <span style={{ textTransform: 'capitalize' }}>{key}</span>
                        <span style={{ fontWeight: 600 }}>{value.score}/20</span>
                    </div>
                ))}
            </div>

            {/* Improvements */}
            <div style={{ marginTop: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Suggested Improvements</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(atsData.improvements || []).map((imp: any, idx: number) => (
                        <div key={idx} style={{
                            padding: '8px',
                            borderRadius: '4px',
                            fontSize: '13px',
                            backgroundColor: imp.priority === 'high' ? '#fee2e2' : imp.priority === 'medium' ? '#fef9c3' : '#dbeafe',
                            borderLeft: `4px solid ${imp.priority === 'high' ? '#ef4444' : imp.priority === 'medium' ? '#eab308' : '#3b82f6'}`
                        }}>
                            {imp.suggestion}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
