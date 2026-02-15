'use client';

import { useState, useEffect, use } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FileText, User, Calendar, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function OriginalPostPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [originalContent, setOriginalContent] = useState('');

  useEffect(() => {
    async function fetchPostData() {
      try {
        const res = await fetch('/api/posts');
        const allPosts = await res.json();
        const foundPost = allPosts.find(p => p.id === id);
        
        if (foundPost) {
          setPost(foundPost);
          // Fetch the original markdown content
          const contentRes = await fetch(foundPost.originalUrl);
          const contentText = await contentRes.text();
          setOriginalContent(contentText);
        }
      } catch (error) {
        console.error("Failed to fetch post:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPostData();
  }, [id]);

  const MarkdownComponents = {
    h1: ({ children }) => <h1 className="text-4xl font-black text-primary-green mb-8 mt-12">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-bold text-primary-skyblue mb-6 mt-10">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-8">{children}</h3>,
    p: ({ children }) => <p className="text-gray-600 mb-6 leading-relaxed text-lg">{children}</p>,
    ul: ({ children }) => <ul className="list-disc list-inside mb-6 space-y-3 text-gray-600 text-lg">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside mb-6 space-y-3 text-gray-600 text-lg">{children}</ol>,
    li: ({ children }) => <li className="pl-2">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-8 border-primary-green pl-8 py-4 italic my-10 bg-green-50/50 rounded-r-2xl text-xl">
        {children}
      </blockquote>
    ),
    img: ({ src, alt }) => (
      <img 
        src={src} 
        alt={alt} 
        className="rounded-3xl shadow-2xl my-12 max-w-full h-auto border-8 border-white"
      />
    ),
    a: ({ href, children }) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-primary-skyblue font-bold underline hover:text-primary-green transition-colors"
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="bg-gray-100 text-primary-skyblue px-2 py-1 rounded-lg font-mono text-base">
        {children}
      </code>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-12 rounded-2xl border-2 border-gray-100 shadow-sm">
        <table className="w-full text-left border-collapse">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-gray-50 text-gray-700 font-bold">{children}</thead>,
    tbody: ({ children }) => <tbody className="divide-y-2 divide-gray-50">{children}</tbody>,
    tr: ({ children }) => <tr className="hover:bg-gray-50/30 transition-colors">{children}</tr>,
    th: ({ children }) => <th className="px-8 py-5 border-b-2 border-gray-100">{children}</th>,
    td: ({ children }) => <td className="px-8 py-5 text-gray-600">{children}</td>,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-12 h-12 text-primary-skyblue animate-spin" />
        <p className="text-gray-400 font-bold text-xl">Loading original document...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Post Not Found</h1>
        <Link href="/posts" className="text-primary-green font-bold flex items-center justify-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Back to Research
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header Info */}
      <div className="bg-white border-b border-gray-100 py-12 px-4 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <Link href="/posts" className="inline-flex items-center gap-2 text-primary-green font-bold mb-8 hover:text-primary-skyblue transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Research
          </Link>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
              Original Document
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-skyblue" />
              <span className="font-medium">{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary-skyblue" />
              <span className="font-medium">{post.author}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100">
          <div className="prose prose-lg prose-green max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              components={MarkdownComponents}
            >
              {originalContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>
      
      {/* Footer Navigation */}
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <Link href="/posts" className="inline-flex items-center gap-2 bg-primary-green text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary-skyblue hover:scale-105 transition-all shadow-xl">
          <ArrowLeft className="w-5 h-5" />
          Back to All Research
        </Link>
      </div>
    </div>
  );
}
