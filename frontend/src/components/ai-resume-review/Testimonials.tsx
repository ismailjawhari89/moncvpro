'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
    {
        id: 1,
        name: "Sarah Jenkins",
        role: "Marketing Manager",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        text: "I was applying for months with no response. After using MonCVPro's AI review, I realized my CV wasn't ATS friendly. I fixed it and got 3 interviews the next week!",
        rating: 5,
        metric: "3 Interviews in 1 week"
    },
    {
        id: 2,
        name: "David Chen",
        role: "Software Engineer",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        text: "The keyword optimization feature is a game changer. It told me exactly what skills I was missing compared to the job description. Highly recommended.",
        rating: 5,
        metric: "Landed job at TechGiant"
    },
    {
        id: 3,
        name: "Emily Wilson",
        role: "Recent Graduate",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        text: "As a fresh grad, I didn't know how to structure my CV. The AI gave me specific tips on how to highlight my projects and internships effectively.",
        rating: 4,
        metric: "First job offer secured"
    }
];

export default function Testimonials() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial) => (
                <div key={testimonial.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative hover:shadow-md transition-shadow">
                    <Quote className="absolute top-6 right-6 text-gray-100" size={40} />

                    <div className="flex gap-1 text-yellow-400 mb-6">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={18}
                                fill={i < testimonial.rating ? "currentColor" : "none"}
                                className={i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}
                            />
                        ))}
                    </div>

                    <p className="text-gray-700 mb-6 leading-relaxed relative z-10">
                        &quot;{testimonial.text}&quot;
                    </p>

                    <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                            {/* Using a colored div as fallback if image fails or for privacy if preferred */}
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
