'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AI_RESUME_FAQ } from '@/data/ai-resume-faq';

export default function FAQAccordion() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-4">
            {AI_RESUME_FAQ.map((faq, index) => (
                <div
                    key={index}
                    className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden
                        ${openIndex === index ? 'border-blue-200 shadow-md' : 'border-gray-200 hover:border-blue-100'}
                    `}
                >
                    <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                    >
                        <span className={`font-semibold text-lg transition-colors ${openIndex === index ? 'text-blue-600' : 'text-gray-900'}`}>
                            {faq.question}
                        </span>
                        {openIndex === index ? (
                            <ChevronUp className="text-blue-600 flex-shrink-0" size={20} />
                        ) : (
                            <ChevronDown className="text-gray-400 flex-shrink-0" size={20} />
                        )}
                    </button>

                    <div
                        className={`transition-all duration-300 ease-in-out
                            ${openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}
                        `}
                    >
                        <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4 mt-2">
                            {faq.answer}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
