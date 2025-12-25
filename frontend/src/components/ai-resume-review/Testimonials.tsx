'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Testimonials() {
    const t = useTranslations('ai-resume-review.testimonials');
    const testimonials = t.raw('items') as { id: number; name: string; role: string; text: string; metric: string }[];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative hover:shadow-md transition-shadow">
                    <Quote className="absolute top-6 right-6 text-gray-100" size={40} />

                    <div className="flex gap-1 text-yellow-400 mb-6">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={18}
                                fill={i < 5 ? "currentColor" : "none"}
                                className={i < 5 ? "text-yellow-400" : "text-gray-300"}
                            />
                        ))}
                    </div>

                    <p className="text-gray-700 mb-6 leading-relaxed relative z-10">
                        &quot;{testimonial.text}&quot;
                    </p>

                    <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                {testimonial.name.charAt(0)}
                            </div>
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">{testimonial.name}</div>
                            <div className="text-sm text-gray-500">{testimonial.role}</div>
                        </div>
                    </div>

                    <div className="mt-4 inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">
                        🚀 {testimonial.metric}
                    </div>
                </div>
            ))}
        </div>
    );
}
