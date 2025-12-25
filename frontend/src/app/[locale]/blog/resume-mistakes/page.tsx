
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Common Resume Mistakes to Avoid in 2025',
    description: 'Avoid these top resume mistakes that get your application rejected. Learn what recruiters hate seeing on your CV.',
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
                        Common Resume Mistakes to Avoid
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
                            <span>3 min read</span>
                        </div>
                    </div>
                </div>
            </div>

            <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-lg prose-blue">
                <p className="lead text-xl text-gray-600 mb-8">
                    Even the most qualified candidates can get rejected due to simple mistakes on their CVs. Here are the top errors we see and how to fix them.
                </p>

                <h2>1. typos and Grammar Errors</h2>
                <p>
                    It seems obvious, but 50% of recruiters cite typos as a deal-breaker. Attention to detail is a key soft skill, and a typo proves you lack it. Always use a grammar checker.
                </p>

                <h2>2. One Size Fits All</h2>
                <p>
                    Sending the exact same resume to every job application is a recipe for failure. Tailor your summary and skills section to match the specific keywords of the job description.
                </p>

                <h2>3. Unprofessional Email Addresses</h2>
                <p>
                    Using <em>coolguy123@hotmail.com</em> won't do you any favors. Create a professional email using your first and last name (e.g., <em>firstname.lastname@gmail.com</em>).
                </p>

                <h2>4. Including a Photo (in US/UK)</h2>
                <p>
                    Unless you are an actor or model, or applying in a country where it is standard (like France or Germany), avoid including a photo. It can lead to bias and is often rejected by HR policies in the US/UK.
                </p>

                <div className="bg-green-50 border-l-4 border-green-600 p-6 my-8 rounded-r-lg">
                    <h3 className="text-green-900 font-bold mb-2 mt-0">Fix Your Mistakes Instantly</h3>
                    <p className="text-green-800 mb-4">
                        Our AI Assistant can proofread your text and suggest professional improvements in seconds.
                    </p>
                    <Link href="/cv-builder" className="inline-block bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors no-underline">
                        Check My CV With AI
                    </Link>
                </div>
            </article>
        </div>
    );
}
