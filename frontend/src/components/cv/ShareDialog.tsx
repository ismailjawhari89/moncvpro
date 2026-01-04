
'use client';

import React, { useState } from 'react';
import api from '@/lib/axios';

interface Props {
    cvId: string;
    onClose: () => void;
}

export function ShareDialog({ cvId, onClose }: Props) {
    const [email, setEmail] = useState('');
    const [permission, setPermission] = useState('comment');
    const [shareLink, setShareLink] = useState('');
    const [loading, setLoading] = useState(false);

    const handleShare = async () => {
        try {
            setLoading(true);
            const response = await api.post(`/sharing/cvs/${cvId}/share`, {
                email,
                permission
            });
            if (response.data.share?.token) {
                setShareLink(`${window.location.origin}/shared/${response.data.share.token}`);
            }
            alert('Invitation sent!');
        } catch (error) {
            console.error(error);
            alert('Failed to share.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                width: '400px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Share CV</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>×</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="mentor@example.com"
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '6px',
                                border: '1px solid #d1d5db'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>Permission Level</label>
                        <select
                            value={permission}
                            onChange={(e) => setPermission(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '6px',
                                border: '1px solid #d1d5db',
                                backgroundColor: 'white'
                            }}
                        >
                            <option value="view">View Only</option>
                            <option value="comment">Can Comment</option>
                            <option value="edit">Can Edit</option>
                        </select>
                    </div>

                    <button
                        onClick={handleShare}
                        disabled={loading || !email}
                        style={{
                            padding: '12px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            opacity: (loading || !email) ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Sending...' : 'Send Invite'}
                    </button>

                    {shareLink && (
                        <div style={{ marginTop: '16px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Shareable Link:</p>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    value={shareLink}
                                    readOnly
                                    style={{
                                        flex: 1,
                                        padding: '8px',
                                        fontSize: '12px',
                                        backgroundColor: '#f3f4f6',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px'
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(shareLink);
                                        alert('Copied!');
                                    }}
                                    style={{
                                        padding: '8px 12px',
                                        backgroundColor: '#e5e7eb',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
