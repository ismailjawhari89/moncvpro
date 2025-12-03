'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        setSubmitted(true);
        setLoading(false);
        setFormData({ name: '', email: '', subject: '', message: '' });

        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">Contact Us</h1>
                    <p className="text-xl text-blue-100">
                        Have a question? We&apos;d love to hear from you
                    </p>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <Mail className="text-blue-600 mb-3" size={32} />
                                <h3 className="font-bold text-lg text-gray-900 mb-2">Email</h3>
                                <p className="text-gray-600">support@moncvpro.com</p>
                                <p className="text-sm text-gray-500 mt-2">We&apos;ll respond within 24 hours</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <MapPin className="text-purple-600 mb-3" size={32} />
                                <h3 className="font-bold text-lg text-gray-900 mb-2">Location</h3>
                                <p className="text-gray-600">Remote Team</p>
                                <p className="text-sm text-gray-500 mt-2">Serving users worldwide</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <Phone className="text-green-600 mb-3" size={32} />
                                <h3 className="font-bold text-lg text-gray-900 mb-2">Support Hours</h3>
                                <p className="text-gray-600">Monday - Friday</p>
                                <p className="text-sm text-gray-500 mt-2">9:00 AM - 6:00 PM CET</p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>

                                {submitted && (
                                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800">
                                        <CheckCircle size={20} />
                                        <span>Thank you! Your message has been sent successfully.</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Subject *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="How can we help?"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            required
                                            rows={6}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                            placeholder="Tell us more about your question or feedback..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        <details className="bg-gray-50 p-6 rounded-lg">
                            <summary className="font-semibold text-gray-900 cursor-pointer">
                                How long does it take to get a response?
                            </summary>
                            <p className="mt-3 text-gray-600">
                                We typically respond to all inquiries within 24 hours during business days.
                                For urgent matters, please mark your email as high priority.
                            </p>
                        </details>

                        <details className="bg-gray-50 p-6 rounded-lg">
                            <summary className="font-semibold text-gray-900 cursor-pointer">
                                Can I request new features?
                            </summary>
                            <p className="mt-3 text-gray-600">
                                Absolutely! We love hearing feature requests from our users. Please send us your
                                ideas and we&apos;ll carefully consider them for future updates.
                            </p>
                        </details>

                        <details className="bg-gray-50 p-6 rounded-lg">
                            <summary className="font-semibold text-gray-900 cursor-pointer">
                                Do you offer technical support?
                            </summary>
                            <p className="mt-3 text-gray-600">
                                Yes! If you&apos;re experiencing technical issues, please contact us with details about
                                the problem and we&apos;ll help you resolve it as quickly as possible.
                            </p>
                        </details>
                    </div>
                </div>
            </section>
        </div>
    );
}
