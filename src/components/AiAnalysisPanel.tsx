/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Loader2, PlaySquare, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Repository, TemplateConfig } from '../types';

interface AiAnalysisPanelProps {
  activeRepo: Repository;
  onApplyAiCustomizations: (updates: {
    tagline: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
  }) => void;
  appLayout?: string;
}

export default function AiAnalysisPanel({ activeRepo, onApplyAiCustomizations, appLayout }: AiAnalysisPanelProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [readmeText, setReadmeText] = useState('');
  
  // High-fidelity fallback presets if user has no README text prepared
  const handleLoadSampleReadme = () => {
    setReadmeText(`# ${activeRepo.name}

> A premium software core orchestrating multi-agent environments. Built with high performance standards for ${activeRepo.primaryLanguage}.

## Key Features
- Zero cold-start latency with optimized V8 edge execution.
- Auto-healing self-regulatory node topology.
- Direct memory-compaction cache layer for sub-5ms lookup.

## Installation
\`\`\`bash
npm i @jehadurre/${activeRepo.name.toLowerCase()}
\`\`\`
`);
  };

  const handleTriggerAiAnalysis = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: activeRepo.name,
          owner: activeRepo.owner,
          description: activeRepo.description,
          readmeText: readmeText || activeRepo.description,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Apply updates to the active template config
        onApplyAiCustomizations({
          tagline: data.tagline,
          primaryColor: data.suggestedPalette.primary,
          secondaryColor: data.suggestedPalette.secondary,
          accentColor: data.suggestedPalette.accent,
          backgroundColor: data.suggestedPalette.background,
        });
        setSuccess(true);
      } else {
        console.error('Gemini error feedback:', data.error);
        alert(`Gemini was unable to run search context: ${data.error}`);
      }
    } catch (err) {
      console.error('Failed to contact Gemini API:', err);
      alert('Failed to connect to full-stack server-side route.');
    } finally {
      setLoading(false);
    }
  };

  const isHacker = appLayout === 'hacker';
  
  const panelClass = isHacker 
    ? "bg-[#050505] border border-emerald-900/60 rounded-none p-5 flex flex-col gap-5 font-mono shadow-[0_0_15px_rgba(16,185,129,0.05)] relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] before:bg-[size:24px_24px] before:pointer-events-none"
    : "bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4";

  const headerBorderClass = isHacker ? "border-b border-emerald-900/50 pb-4" : "flex items-center justify-between border-b border-zinc-800 pb-3";
  const titleClass = isHacker ? "font-extrabold text-emerald-400 text-[13px] uppercase tracking-[0.2em] flex items-center gap-2 before:content-['>'] animate-typewriter" : "font-semibold text-zinc-100 text-sm font-sans tracking-tight";
  const descClass = isHacker ? "text-[11px] text-emerald-600/80 uppercase tracking-widest" : "text-xs text-zinc-400";
  const labelClass = isHacker ? "block text-[10px] uppercase tracking-[0.2em] text-emerald-500/90 font-bold mb-2 flex items-center gap-2 before:content-['//']" : "block text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-1.5";
  const textareaClass = isHacker ? "w-full text-xs font-mono p-4 bg-[#0a0a0a] border border-emerald-900/60 text-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 rounded-none transition-all resize-y" : "w-full text-xs font-mono p-3 bg-zinc-950 border border-zinc-850 rounded-xl text-zinc-300 placeholder-zinc-650 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20";
  const primaryBtnClass = isHacker ? "w-full py-3 px-4 rounded-none font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-emerald-950/20 border-emerald-500/50 border hover:bg-emerald-900 border-emerald-500 shadow-[inset_0_0_15px_rgba(16,185,129,0.1)] text-emerald-300 relative disabled:opacity-50" : "w-full py-3 px-4 rounded-xl font-semibold tracking-tight transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-950/20 cursor-pointer disabled:opacity-50";

  return (
    <div className={panelClass} id="ai-context-panel">
      
      {/* Header */}
      <div className={headerBorderClass}>
        <div className="flex items-center gap-2">
          {!isHacker && <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />}
          <h4 className={titleClass}>Gemini AI README Inspector</h4>
        </div>
        <button
          onClick={handleLoadSampleReadme}
          className={`text-xs font-mono flex items-center gap-1 cursor-pointer ${isHacker ? 'text-emerald-500 hover:text-emerald-400 border border-emerald-900/60 p-1.5 bg-[#0a0a0a]' : 'text-sky-400 hover:text-sky-300'}`}
        >
          <PlaySquare className="w-3.5 h-3.5" />
          <span>Load Sample README</span>
        </button>
      </div>

      <p className={descClass}>
        Analyze your project markdown directory to automatically discover high-conversion taglines, features, and premium color palettes designed by our Gemini engine.
      </p>

      {/* Text Area */}
      <div className="space-y-3">
        <div>
          <label className={labelClass}>
            README.md Markdown Contents (Optional)
          </label>
          <textarea
            id="input-readme-analyze-content"
            rows={5}
            value={readmeText}
            onChange={(e) => setReadmeText(e.target.value)}
            className={textareaClass}
            placeholder="# Repository Header&#10;Paste markdown snippet or installation directions here..."
          />
        </div>

        {/* Sync Trigger button */}
        <button
          id="btn-trigger-ai-readme-analysis"
          disabled={loading}
          onClick={handleTriggerAiAnalysis}
          className={primaryBtnClass}
        >
          {loading ? (
            <>
              <Loader2 className={`w-4 h-4 animate-spin ${isHacker ? 'text-emerald-500' : ''}`} />
              <span>Analyzing layout with Gemini-3.5...</span>
            </>
          ) : (
            <>
              <Sparkles className={`w-4 h-4 ${isHacker ? 'text-emerald-500' : ''}`} />
              <span>Analyze with Gemini AI</span>
            </>
          )}
        </button>

        {/* Visual feedback of completion */}
        {success && (
          <div className={`flex items-center gap-2 p-3 text-xs ${isHacker ? 'bg-[#0a0a0a] border border-emerald-900/60 text-emerald-400 rounded-none' : 'bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-emerald-300'}`}>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Success! Copied custom tagline extraction & color palette recommendations directly to editing canvas.</span>
          </div>
        )}
      </div>

    </div>
  );
}
