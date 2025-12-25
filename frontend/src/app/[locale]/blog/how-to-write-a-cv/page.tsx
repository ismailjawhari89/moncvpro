
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';

export const metadata: Metadata = {
    title: 'How to Write a Professional CV | Step-by-Step Guide',
    description: 'Learn how to write a professional CV that lands interviews. Expert tips on structure, content, and formatting for 2025.',
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
                        How to Write a Professional CV
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
                            <span>5 min read</span>
                        </div>
                    </div>
                </div>
            </div>

            <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-lg prose-blue">
                <p className="lead text-xl text-gray-600 mb-8">
                    Writing a professional CV can be daunting, but it doesn't have to be. With the right structure and a focus on your achievements, you can create a document that stands out to recruiters.
                </p>

                <h2>1. Choose the Right Format</h2>
                <p>
                    The reverse-chronological format is the most widely accepted standard. It lists your work experience from newest to oldest, which is exactly what recruiters want to see.
                    Ensure your layout is clean, with plenty of white space and professional fonts like Arial, Calibri, or Roboto.
                </p>

                <h2>2. Write a Compelling Summary</h2>
                <p>
                    Your professional summary is your elevator pitch. In 3-4 lines, highlight your years of experience, key skills, and biggest achievements. Tailor this section to the job you're applying for.
                </p>

                <h2>3. Focus on Achievements, Not Just Duties</h2>
                <p>
                    Don't just list what you did; list what you achieved. Use numbers to quantify your success.
                    <br />
                    <em>Weak:</em> "Managed sales team."
                    <br />
                    <em>Strong:</em> "Managed a team of 10 sales reps, increasing annual revenue by 20% to $1.5M."
                </p>

                <h2>4. Optimize for ATS</h2>
                <p>
                    Applicant Tracking Systems (ATS) scan resumes for keywords before a human ever sees them. Use standard headings (Experience, Education, Skills) and include keywords from the job description.
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8 rounded-r-lg">
                    <h3 className="text-blue-900 font-bold mb-2 mt-0">Ready to build your CV?</h3>
                    <p className="text-blue-800 mb-4">
                        Use our AI-powered builder to create a professional, ATS-friendly CV in minutes.
                    </p>
                    <Link href="/cv-builder" className="inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors no-underline">
                        Build My CV Now
                    </Link>
                </div>
            </article>
        </div>
    );
}
