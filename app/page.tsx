'use client';

import { useState } from 'react';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [buyerPersona, setBuyerPersona] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !buyerPersona) return;

    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, buyerPersona }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error generating campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-6 flex flex-col items-center justify-start py-12">
      <div className="max-w-2xl w-full bg-slate-950 rounded-3xl shadow-2xl p-8 border border-slate-800">
        
        {/* Header Branding */}
        <div className="mb-8 border-b border-slate-800 pb-6">
          <span className="bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-indigo-500/20">
            Caarya AI Live Engine
          </span>
          <h1 className="text-3xl font-black tracking-tight text-white mt-3">Content Blueprint Studio</h1>
          <p className="text-xs text-slate-400 mt-1">
            Powered by Groq Hardware Integration for instantaneous asset compilation.
          </p>
        </div>

        {/* User Input Forms */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Campaign Core Topic / Product Name
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Notion Portfolio Templates for Engineers"
              className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder-slate-600 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Target Ideal Buyer Persona
            </label>
            <input
              type="text"
              value={buyerPersona}
              onChange={(e) => setBuyerPersona(e.target.value)}
              placeholder="e.g., Unemployed pre-placement college grads"
              className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder-slate-600 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-indigo-600/20 disabled:opacity-50 text-sm"
          >
            {loading ? 'Streaming from Groq clusters...' : 'Orchestrate Live AI Campaign'}
          </button>
        </form>

        {/* Live Presentation Layout */}
        {result && !result.error && (
          <div className="mt-8 pt-8 border-t border-slate-800 space-y-6">
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 text-xs text-emerald-400 font-medium">
              🎯 Target Context: Configured specifically for <strong className="text-white">{result.personaText}</strong>
            </div>
            
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">AI Hook Headline</h3>
              <p className="text-xl font-extrabold text-white tracking-tight">{result.headline}</p>
            </div>
            
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Strategic Value Prompt</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">{result.subheading}</p>
            </div>

            {/* NEW FULL ARTICLE COMPONENT */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Generated Premium Content Article</h3>
              <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-serif">
                {result.article}
              </div>
            </div>
            
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Social Channels Distribution</h3>
              <div className="space-y-2">
                {result.socialPosts.map((post: string, idx: number) => (
                  <p key={idx} className="bg-slate-900 text-slate-300 p-3.5 rounded-xl text-xs border border-slate-800 font-mono italic">
                    "{post}"
                  </p>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-800/60">
              <span>Status: Live Groq Pipeline Functional</span>
              <span>Speed Index: Sub-Second Processing</span>
            </div>
          </div>
        )}

        {result && result.error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs font-medium">
            ⚠️ Error: {result.error}
          </div>
        )}

      </div>
    </main>
  );
}