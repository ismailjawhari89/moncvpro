'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { blogService, type BlogPost } from '@/services/blogService';

export default function BlogPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const data = await blogService.getAllPosts();
            setPosts(data);
        } catch (error) {
            console.error('Error loading posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                        Career Advice & CV Tips
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
                        Expert insights to help you build the perfect CV and land your dream job.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search articles, topics, or skills..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 pl-12"
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-200" size={20} />
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-96 animate-pulse">
                                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPosts.map((post) => (
                                <article
                                    key={post.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col"
                                >
                                    {/* Image Placeholder (since we don't have real images yet) */}
                                    <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center text-blue-900/20 font-bold text-4xl transform group-hover:scale-110 transition-transform duration-500">
                                            MonCVPro
                                        </div>
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-blue-700">
                                            {post.category}
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {new Date(post.publishedAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {post.readTime}
                                            </div>
                                        </div>

                                        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>

                                        <p className="text-gray-600 mb-6 line-clamp-3 flex-1">
                                            {post.excerpt}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold">
                                                    {post.author.name.charAt(0)}
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">
                                                    {post.author.name}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => router.push(`/blog/${post.slug}`)}
                                                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                                            >
                                                Read More
                                                <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {!loading && filteredPosts.length === 0 && (
                        <div className="text-center py-16">
                            <Search className="mx-auto text-gray-300 mb-4" size={48} />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No articles found</h3>
                            <p className="text-gray-600">Try searching for something else</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="bg-white border-t border-gray-200 py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Stay Ahead in Your Career
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Get the latest CV tips and career advice delivered straight to your inbox.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-1 px-6 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                        <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                            Subscribe
                        </button>
                    </form>
                    <p className="text-xs text-gray-500 mt-4">
                        We respect your privacy. Unsubscribe at any time.
                    </p>
                </div>
            </section>
        </div>
    );
}
