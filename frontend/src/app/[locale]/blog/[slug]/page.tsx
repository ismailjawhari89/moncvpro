'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { blogService, type BlogPost } from '@/services/blogService';

// Edge Runtime for Cloudflare Pages
export const runtime = 'edge';

export default function BlogPostPage() {
    const router = useRouter();
    const params = useParams();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

    useEffect(() => {
        if (params?.slug) {
            loadPost(params.slug as string);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params?.slug]);

    const loadPost = async (slug: string) => {
        setLoading(true);
        try {
            const data = await blogService.getPostBySlug(slug);
            if (data) {
                setPost(data);
                const related = await blogService.getRelatedPosts(slug);
                setRelatedPosts(related);
            } else {
                router.push('/blog');
            }
        } catch (error) {
            console.error('Error loading post:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!post) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
                <div className="h-full bg-blue-600 w-0" id="progress-bar"></div>
            </div>

            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <button
                        onClick={() => router.push('/blog')}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back to Blog</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <article>
                {/* Hero */}
                <div className="bg-white pb-12 pt-8">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full">
                                {post.category}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500 text-sm">{post.readTime}</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex items-center justify-between border-t border-b border-gray-100 py-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                    {post.author.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">{post.author.name}</div>
                                    <div className="text-sm text-gray-500">{post.author.role}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <Calendar size={16} />
                                {new Date(post.publishedAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div
                        className="prose prose-lg prose-blue max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Tags */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            Related Topics
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 cursor-pointer transition-colors"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Share */}
                    <div className="mt-8 flex items-center gap-4">
                        <span className="font-semibold text-gray-900">Share this article:</span>
                        <div className="flex gap-2">
                            <button className="p-2 bg-[#1877F2] text-white rounded-full hover:opacity-90 transition-opacity">
                                <Facebook size={18} />
                            </button>
                            <button className="p-2 bg-[#1DA1F2] text-white rounded-full hover:opacity-90 transition-opacity">
                                <Twitter size={18} />
                            </button>
                            <button className="p-2 bg-[#0A66C2] text-white rounded-full hover:opacity-90 transition-opacity">
                                <Linkedin size={18} />
                            </button>
                            <button className="p-2 bg-gray-600 text-white rounded-full hover:opacity-90 transition-opacity">
                                <LinkIcon size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </article>

            {/* Related Posts */}
            <section className="bg-white border-t border-gray-200 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Read Next</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {relatedPosts.map((related) => (
                            <div
                                key={related.id}
                                onClick={() => router.push(`/blog/${related.slug}`)}
                                className="group cursor-pointer"
                            >
                                <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-4 relative">
                                    <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-blue-900/0 transition-colors" />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-blue-700">
                                        {related.category}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {related.title}
                                </h3>
                                <p className="text-gray-600 line-clamp-2">
                                    {related.excerpt}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-blue-600 py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to apply what you&apos;ve learned?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Create your professional CV in minutes with our free builder.
                    </p>
                    <button
                        onClick={() => router.push('/cv-builder')}
                        className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                        Build My CV Now
                    </button>
                </div>
            </section>
        </div>
    );
}
