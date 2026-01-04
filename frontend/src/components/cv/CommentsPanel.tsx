
'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

interface Props {
    cvId: string;
}

export function CommentsPanel({ cvId }: Props) {
    const [newComment, setNewComment] = useState('');
    const [selectedSection, setSelectedSection] = useState('general');
    const queryClient = useQueryClient();



    const { data: comments, isLoading } = useQuery({
        queryKey: ['cvComments', cvId],
        queryFn: async () => {
            const response = await api.get(`/sharing/cvs/${cvId}/comments`);
            return response.data;
        },
        enabled: !!cvId
    });

    const mutation = useMutation({
        mutationFn: async (payload: any) => {
            return api.post(`/sharing/cvs/${cvId}/comments`, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cvComments', cvId] });
            setNewComment('');
        }
    });

    const handleAddComment = () => {
        if (!newComment) return;
        mutation.mutate({
            section: selectedSection,
            text: newComment
        });
    };

    return (
        <div style={{
            width: '320px',
            height: '100%',
            backgroundColor: 'white',
            borderLeft: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Feedback & Comments</h3>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {isLoading ? (
                    <p style={{ textAlign: 'center', color: '#6b7280' }}>Loading comments...</p>
                ) : (comments || []).length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', marginTop: '20px' }}>No feedback yet. Be the first to comment!</p>
                ) : comments.map((comment: any) => (
                    <div key={comment.id} style={{
                        padding: '12px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '8px',
                        border: comment.resolved ? '1px solid #10b981' : 'none'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600 }}>{comment.userId || 'Anonymous'}</span>
                            <span style={{ fontSize: '10px', color: '#9ca3af' }}>{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p style={{ fontSize: '13px', color: '#374151' }}>{comment.text}</p>
                        <div style={{ fontSize: '10px', color: '#3b82f6', marginTop: '4px', textTransform: 'capitalize' }}>
                            On: {comment.section}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add comment input */}
            <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    style={{ width: '100%', marginBottom: '8px', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                >
                    <option value="general">General Feedback</option>
                    <option value="personalInfo">Contact Info</option>
                    <option value="experiences">Experience</option>
                    <option value="education">Education</option>
                    <option value="skills">Skills</option>
                </select>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add your feedback..."
                    style={{
                        width: '100%',
                        height: '80px',
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        fontSize: '13px',
                        marginBottom: '8px',
                        resize: 'none'
                    }}
                />
                <button
                    disabled={mutation.isPending || !newComment}
                    onClick={handleAddComment}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        opacity: (mutation.isPending || !newComment) ? 0.7 : 1
                    }}
                >
                    {mutation.isPending ? 'Posting...' : 'Post Comment'}
                </button>
            </div>
        </div>
    );
}
