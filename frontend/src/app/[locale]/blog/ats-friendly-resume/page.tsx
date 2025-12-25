
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';

export const metadata: Metadata = {
    title: 'ATS-Friendly Resume Guide | Pass Automated Screening',
    description: 'What is an ATS? Learn how Applicant Tracking Systems work and how to optimize your resume to pass the initial screening.',
};

export default function BlogPost() {
    return (
        <div className="min-h-screen bg-white">
            <div className="bg-gray-50 border-b border-gray-200">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Link href="/blog" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors">
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Blog
                    </Link>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        ATS-Friendly Resume Guide
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <User size={16} />
                            <span>MonCVPro Team</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>December 23, 2024</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>4 min read</span>
                        </div>
                    </div>
                </div>
            </div>

            <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-lg prose-blue">
                <p className="lead text-xl text-gray-600 mb-8">
                    Did you know that 75% of resumes are rejected by automated systems before they reach a human recruiter? Learning how to beat the Applicant Tracking System (ATS) is crucial.
                </p>

                <h2>What is an ATS?</h2>
                <p>
                    An Applicant Tracking System is software used by employers to collect, sort, and rank the resumes they receive. If your resume format confuses the ATS, you might be rejected instantly.
                </p>

                <h2>Key Rules for ATS Optimization</h2>
                <ul>
                    <li><strong>Use Standard Headings:</strong> Use "Work Experience" instead of "Professional History".</li>
                    <li><strong>Avoid Graphics and Columns:</strong> Tables, logos, and multi-column layouts can confuse parsers. Keep it simple.</li>
                    <li><strong>Keywords are King:</strong> Include skills and terms found in the job description exactly as they appear.</li>
                    <li><strong>Standard File Formats:</strong> PDF is usually fine, but ensure it's text-based. DOCX is the safest bet for older systems.</li>
                </ul>

                <h2>Checking Your ATS Score</h2>
                <p>
                    The best way to know if your resume is ATS-friendly is to test it. Our AI Resume Review tool simulates an ATS scan to give you a compatibility score.
                </p>

                <div className="bg-purple-50 border-l-4 border-purple-600 p-6 my-8 rounded-r-lg">
                    <h3 className="text-purple-900 font-bold mb-2 mt-0">Test Your Resume for Free</h3>
                    <p className="text-purple-800 mb-4">
                        Upload your CV to our AI Resume Review tool and get an instant ATS score and improvement tips.
                    </p>
                    <Link href="/ai-resume-review" className="inline-block bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors no-underline">
                        Get Free ATS Score
                    </Link>
                </div>
            </article>
        </div>
    );
}
