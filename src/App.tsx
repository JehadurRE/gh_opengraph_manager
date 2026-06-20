/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Repository, TemplateConfig, LayoutTheme } from './types';
import { INITIAL_REPOSITORIES, DEFAULT_TEMPLATE } from './data';
import Sidebar from './components/Sidebar';
import CanvasPreview from './components/CanvasPreview';
import EditorPanels from './components/EditorPanels';
import AiAnalysisPanel from './components/AiAnalysisPanel';
import SyncSettings from './components/SyncSettings';
import TemplateGalleryModal from './components/TemplateGalleryModal';
import { Github, Sparkles, Layers, RefreshCw, Cpu, ExternalLink, ShieldCheck, Heart, Check } from 'lucide-react';

export default function App() {
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const saved = localStorage.getItem('og_repositories');
    return saved ? JSON.parse(saved) : INITIAL_REPOSITORIES;
  });

  const [activeRepo, setActiveRepo] = useState<Repository>(() => {
    const saved = localStorage.getItem('og_activeRepo');
    // Ensure active repo is synced with loaded repos if possible
    const parsed = saved ? JSON.parse(saved) : INITIAL_REPOSITORIES[0];
    return parsed;
  });

  const [config, setConfig] = useState<TemplateConfig>(() => {
    const saved = localStorage.getItem('og_config');
    return saved ? JSON.parse(saved) : DEFAULT_TEMPLATE;
  });

  const [appLayout, setAppLayout] = useState<'split' | 'bento' | 'focus' | 'hacker'>(() => {
    const saved = localStorage.getItem('og_appLayout');
    return (saved ? JSON.parse(saved) : 'hacker') as 'split' | 'bento' | 'focus' | 'hacker';
  });

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Keyboard shortcut listener for Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+S or Ctrl+S
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault(); // Prevent default browser save
        // Config is auto-saved to localStorage on change!
        // So we just provide visual feedback that "save" was acknowledged.
        setShowSavedToast(true);
        setTimeout(() => setShowSavedToast(false), 2000);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync editor settings whenever active repository is swapped (but not on mount)
  const prevRepoId = React.useRef(activeRepo.id);
  useEffect(() => {
    if (prevRepoId.current !== activeRepo.id) {
      setConfig({
        ...DEFAULT_TEMPLATE,
        title: activeRepo.name,
        tagline: activeRepo.tagline || activeRepo.description,
        ownerName: activeRepo.owner,
        primaryColor: activeRepo.suggestedPalette?.primary || DEFAULT_TEMPLATE.primaryColor,
        secondaryColor: activeRepo.suggestedPalette?.secondary || DEFAULT_TEMPLATE.secondaryColor,
        accentColor: activeRepo.suggestedPalette?.accent || DEFAULT_TEMPLATE.accentColor,
        backgroundColor: activeRepo.suggestedPalette?.background || DEFAULT_TEMPLATE.backgroundColor,
      });
      prevRepoId.current = activeRepo.id;
    }
  }, [activeRepo]);

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem('og_repositories', JSON.stringify(repositories));
  }, [repositories]);

  useEffect(() => {
    localStorage.setItem('og_activeRepo', JSON.stringify(activeRepo));
  }, [activeRepo]);

  useEffect(() => {
    localStorage.setItem('og_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('og_appLayout', JSON.stringify(appLayout));
  }, [appLayout]);

  const handleUpdateConfig = (updates: Partial<TemplateConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleAddCustomRepo = (newRepo: Repository) => {
    setRepositories((prev) => [newRepo, ...prev]);
    setActiveRepo(newRepo);
  };

  const handleSetRepositories = (loadedRepos: Repository[]) => {
    if (loadedRepos.length > 0) {
      setRepositories(loadedRepos);
      setActiveRepo(loadedRepos[0]);
    }
  };

  const handleApplyAiCustomizations = (updates: {
    tagline: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
  }) => {
    setConfig((prev) => ({
      ...prev,
      tagline: updates.tagline,
      primaryColor: updates.primaryColor,
      secondaryColor: updates.secondaryColor,
      accentColor: updates.accentColor,
      backgroundColor: updates.backgroundColor,
    }));
  };

  const handleApplyPalette = (themePalette: [string, string, string, string]) => {
    setConfig((prev) => ({
      ...prev,
      primaryColor: themePalette[0],
      secondaryColor: themePalette[1],
      accentColor: themePalette[2],
      backgroundColor: themePalette[3],
    }));
  };

  const QUICK_THEMES: { id: LayoutTheme; label: string; emoji: string; palette: [string, string, string, string] }[] = [
    { id: 'cosmic', label: 'Cosmic', emoji: '🌌', palette: ['#38bdf8', '#a78bfa', '#fb7185', '#0a0f1d'] },
    { id: 'cyberpunk', label: 'Cyberpunk', emoji: '⚡', palette: ['#f43f5e', '#ec4899', '#f59e0b', '#030712'] },
    { id: 'minimalist', label: 'Minimalist', emoji: '🇨🇭', palette: ['#18181b', '#3f3f46', '#22c55e', '#ffffff'] },
    { id: 'elegant', label: 'Elegant', emoji: '⚜️', palette: ['#ec4899', '#8b5cf6', '#6366f1', '#0f051d'] },
    { id: 'terminal', label: 'Terminal', emoji: '📟', palette: ['#22c55e', '#16a34a', '#4ade80', '#022c22'] },
  ];

  return (
    <div className={`min-h-screen selection:bg-sky-505/30 transition-all duration-300 relative ${
      appLayout === 'split' ? 'bg-black text-zinc-100 font-sans' : ''
    } ${
      appLayout === 'bento' ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-955 to-black text-slate-100 font-sans' : ''
    } ${
      appLayout === 'focus' ? 'bg-[#fafaf9] text-zinc-900 font-sans' : ''
    } ${
      appLayout === 'hacker' ? 'bg-black text-emerald-400 font-mono border-emerald-950' : ''
    }`}>
      
      {/* SCANLINE OVERLAY FOR HACKER LAYOUT */}
      {appLayout === 'hacker' && (
        <div className="pointer-events-none fixed inset-0 z-50 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.5)_100%)] opacity-35" />
      )}

      {/* GLOWING AMBIENT DECORATORS BASED ON SENSORY SCHEMES */}
      {appLayout === 'split' && (
        <>
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-900/10 rounded-full blur-[120px] pointer-events-none select-none" />
          <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none select-none" />
        </>
      )}

      {appLayout === 'bento' && (
        <>
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-cyan-950/10 rounded-full blur-[140px] pointer-events-none select-none" />
          <div className="absolute bottom-20 left-1/4 w-[500px] h-[500px] bg-indigo-950/15 rounded-full blur-[120px] pointer-events-none select-none" />
        </>
      )}

      {/* TOP DECK NAVBARS UNIQUE TO EACH INTERFACE */}
      {appLayout === 'split' && (
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800/80" id="main-global-header-split">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500 p-[1.5px] shadow-lg shadow-sky-500/10">
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                  <Layers className="w-4 h-4 text-sky-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-base font-sans tracking-tight leading-4">
                  GitHub OG Managers
                </span>
                <span className="text-[10px] text-zinc-400 font-mono tracking-wider">
                  BY @JEHADURRE
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/jehadurre"
                target="_blank"
                referrerPolicy="no-referrer"
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white transition-colors border border-zinc-800 flex items-center gap-1.5 cursor-pointer"
              >
                <Github className="w-3.5 h-3.5" />
                <span>@jehadurre</span>
                <ExternalLink className="w-3 h-3 text-zinc-500" />
              </a>
            </div>
          </div>
        </header>
      )}

      {appLayout === 'bento' && (
        <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800 shadow-lg shadow-black/20 animate-fade-in" id="main-global-header-bento">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-sky-400 p-[1.5px] animate-pulse">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div className="flex flex-col animate-pulse">
                <span className="font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-400 text-base leading-4">
                  COSMIC BENTO STUDIO
                </span>
                <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase font-mono">
                  Galactic Node Edition
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 text-[10px] text-cyan-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                CELESTIAL_SYNC
              </span>
              <a
                href="https://github.com/jehadurre"
                target="_blank"
                referrerPolicy="no-referrer"
                className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer shadow shadow-cyan-500/15"
              >
                <Github className="w-3.5 h-3.5" />
                <span>@jehadurre</span>
              </a>
            </div>
          </div>
        </header>
      )}

      {appLayout === 'focus' && (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-200 shadow-sm animate-fade-in" id="main-global-header-focus">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-zinc-900 rounded flex items-center justify-center">
                <Layers className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-serif italic font-extrabold tracking-tight text-zinc-900 text-base">
                The Minimalist.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-zinc-400 text-xs font-mono">No. 004 — Portfolio Stage</span>
              <a
                href="https://github.com/jehadurre"
                target="_blank"
                referrerPolicy="no-referrer"
                className="text-xs text-zinc-800 hover:text-black font-semibold tracking-tight border-b border-zinc-805 pb-0.5"
              >
                @jehadurre
              </a>
            </div>
          </div>
        </header>
      )}

      {appLayout === 'hacker' && (
        <header className="bg-black border-b border-dashed border-emerald-900/80 py-3 px-4 animate-fade-in" id="main-global-header-hacker">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-3">
              <span className="text-emerald-500 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800 text-xs font-bold font-mono animate-typewriter-fast">
                [SYS_SHELL_v3.2]
              </span>
              <span className="font-mono text-emerald-400 font-bold tracking-widest text-sm uppercase animate-typewriter">
                OG_RAW_IMAGE_MGR.EXE
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="text-emerald-600 font-mono animate-typewriter-fast">PORT: 3000 // STATUS: RAW</span>
              <a
                href="https://github.com/jehadurre"
                target="_blank"
                referrerPolicy="no-referrer"
                className="text-black bg-emerald-400 px-2.5 py-0.5 font-bold hover:bg-emerald-300 transition-colors uppercase text-[10px]"
              >
                @JEHADURRE_LOG
              </a>
            </div>
          </div>
        </header>
      )}

      {/* LANDING FEATURE HERO DECK (RESONATING UNIQUE VIBES) */}
      <section className={`relative overflow-hidden ${
        appLayout === 'split' ? 'pt-12 pb-6' : ''
      } ${
        appLayout === 'bento' ? 'pt-14 pb-10 bg-slate-900/10 border-b border-slate-800/80' : ''
      } ${
        appLayout === 'focus' ? 'pt-10 pb-6 bg-zinc-100/60 border-b border-zinc-200' : ''
      } ${
        appLayout === 'hacker' ? 'pt-6 pb-4 bg-zinc-950/30 border-b border-emerald-900/50' : ''
      }`}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center ${
          appLayout === 'focus' ? 'max-w-3xl' : ''
        }`}>
          
          {appLayout === 'split' && (
            <div className="max-w-3xl mx-auto flex flex-col items-center gap-4 animate-fade-in">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-sky-400 font-mono font-semibold tracking-wide">
                <Sparkles className="w-3 h-3 text-sky-400" />
                <span>PRODUCTION-READY EXPERIMENTAL LAB</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-100 to-zinc-400 tracking-tight font-sans">
                Programmatic Open Graph Studio
              </h1>

              <p className="text-zinc-400 text-sm leading-relaxed font-sans max-w-2xl">
                Create high-fidelity dynamic social graphics powered by instant SVG vector compilation, live repository metadata feeds, and smart Gemini AI diagnostics.
              </p>
            </div>
          )}

          {appLayout === 'bento' && (
            <div className="max-w-3xl mx-auto flex flex-col items-center gap-4 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] text-cyan-400 font-mono tracking-widest font-extrabold uppercase mb-1">
                🌌 Cosmic Bento Deck Active
              </div>

              <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-400 tracking-tighter uppercase">
                Celestial Bento Experience
              </h1>

              <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                Explore an immersive modular grid. Every dynamic card represents live, reactive web variables synced through our global state.
              </p>
            </div>
          )}

          {appLayout === 'focus' && (
            <div className="max-w-2xl mx-auto flex flex-col items-center gap-3 animate-fade-in">
              <span className="text-xs font-mono font-bold tracking-widest text-zinc-500 uppercase">Swiss Portfolio Standard</span>

              <h1 className="text-3xl sm:text-4xl font-serif text-zinc-900 tracking-tight leading-none font-extrabold">
                Minimalist Creative Room.
              </h1>

              <p className="text-zinc-500 text-xs sm:text-sm font-sans max-w-lg leading-relaxed">
                An objective visual stage designed with clean typography, luxurious white/off-white spacing, and delicate borders.
              </p>
            </div>
          )}

          {appLayout === 'hacker' && (
            <div className="text-left font-mono space-y-1 animate-fade-in">
              <div className="text-emerald-500 text-xs animate-pulse font-bold">
                &gt;&gt; HOST_INIT CONSOLE SOCIAL_PREVIEW v3.2 ACTIVE
              </div>
              <div className="text-emerald-700 text-[11px]">
                &gt;&gt; MODULES_STABLE: SVG_REACTOR | METADATA_SYNC_STREAM | SHADOW_OVERLAY
              </div>
            </div>
          )}

          {/* DYNAMIC DASHBOARD CONTAINER VARIATIONS DECK */}
          <div className={`mt-5 p-1.5 rounded-xl border flex flex-wrap justify-center items-center gap-1 max-w-xl mx-auto ${
            appLayout === 'split' ? 'bg-zinc-900/60 border-zinc-800' : ''
          } ${
            appLayout === 'bento' ? 'bg-slate-900/60 border-slate-800 backdrop-blur-md shadow-md shadow-black/10' : ''
          } ${
            appLayout === 'focus' ? 'bg-white border-zinc-200 shadow-sm' : ''
          } ${
            appLayout === 'hacker' ? 'bg-black border-2 border-dashed border-emerald-900 text-emerald-400 mt-2' : ''
          }`}>
            <span className={`text-[10px] font-mono font-bold uppercase px-2.5 ${
              appLayout === 'focus' ? 'text-zinc-400' : 'text-zinc-500'
            }`}>Dashboard Layout:</span>
            <button
              id="layout-btn-split"
              onClick={() => setAppLayout('split')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                appLayout === 'split'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Split Studio
            </button>
            <button
              id="layout-btn-bento"
              onClick={() => setAppLayout('bento')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                appLayout === 'bento'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Bento Hub
            </button>
            <button
              id="layout-btn-focus"
              onClick={() => setAppLayout('focus')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                appLayout === 'focus'
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Centered Focus
            </button>
            <button
              id="layout-btn-hacker"
              onClick={() => setAppLayout('hacker')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                appLayout === 'hacker'
                  ? 'bg-emerald-600 text-black font-extrabold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Hacker Terminal
            </button>

            <div className={`w-[1px] h-6 mx-1 ${
              appLayout === 'focus' ? 'bg-zinc-200' : 
              appLayout === 'hacker' ? 'bg-emerald-900 border-dashed border-r' : 'bg-zinc-800'
            }`} />

            <button
              onClick={() => setIsGalleryOpen(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                appLayout === 'focus' ? 'bg-zinc-100/50 hover:bg-zinc-100 text-zinc-800 border border-zinc-200' :
                appLayout === 'hacker' ? 'bg-black hover:bg-emerald-950 text-emerald-400 border border-emerald-900' :
                'bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Template Gallery
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 font-mono mt-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>SaaS container layout style is hot-swappable! Currently in <strong className="uppercase font-bold">{appLayout} Mode</strong>.</span>
          </div>

        </div>
      </section>

      {/* CORE INDUSTRIAL WORKSPACE BOARD (SPLIT LAYOUT) */}
      {appLayout === 'split' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in" id="saas-dashboard-master">
          {/* Left Side: Repositories Sidebar Index (Takes 4 cols) */}
          <section className="lg:col-span-4 h-[720px] lg:sticky lg:top-24">
            <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800/80 p-1.5 h-full overflow-hidden">
              <Sidebar
                repositories={repositories}
                activeRepoId={activeRepo.id}
                onSelect={setActiveRepo}
                onAddCustomRepo={handleAddCustomRepo}
                onSetRepositories={handleSetRepositories}
                appLayout={appLayout}
              />
            </div>
          </section>

          {/* Right Side: Interactive Preview Canvas & Customizer (Takes 8 cols) */}
          <section className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Main SVG Render Container */}
            <div className="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800/80 backdrop-blur-sm shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-zinc-805/60 pb-4">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-sky-450" />
                  <span className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-wider">
                    Target Canvas Safe-Zone Preview
                  </span>
                </div>
                
                {/* Horizontal Multi-UI selection deck */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {QUICK_THEMES.map((theme) => {
                    const isActive = config.layout === theme.id;
                    return (
                      <button
                        key={`direct-${theme.id}`}
                        id={`direct-theme-btn-${theme.id}`}
                        type="button"
                        onClick={() => {
                          handleUpdateConfig({ layout: theme.id });
                          handleApplyPalette(theme.palette);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
                          isActive
                            ? 'bg-zinc-800 text-white border-sky-505 shadow-md'
                            : 'bg-zinc-950 hover:bg-zinc-850 text-zinc-400 border-zinc-850'
                        }`}
                      >
                        <span>{theme.emoji}</span>
                        <span className="font-semibold">{theme.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <CanvasPreview
                config={config}
                onChange={handleUpdateConfig}
                stats={{
                  stars: activeRepo.stars,
                  forks: activeRepo.forks,
                  openIssues: activeRepo.openIssues,
                  primaryLanguage: activeRepo.primaryLanguage,
                  languageColor: activeRepo.languageColor,
                  repoName: activeRepo.name,
                  repoOwner: activeRepo.owner,
                }}
                appLayout={appLayout}
              />
            </div>

            {/* Tabular customizers segmented for pristine industrial layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-6 p-5 bg-zinc-900/50 rounded-2xl border border-zinc-800/80">
                <div className="text-xs font-mono text-sky-400 uppercase tracking-widest font-bold">Element Dimensions Controls</div>
                <EditorPanels config={config} onChange={handleUpdateConfig} activeRepo={activeRepo} appLayout={appLayout} />
              </div>

              <div className="flex flex-col gap-6 p-5 bg-zinc-900/50 rounded-2xl border border-zinc-800/80">
                <div className="text-xs font-mono text-purple-400 uppercase tracking-widest font-bold">AI Diagnostics Panel</div>
                <AiAnalysisPanel activeRepo={activeRepo} onApplyAiCustomizations={handleApplyAiCustomizations} appLayout={appLayout} />
                <div className="border-t border-zinc-800/80 pt-4">
                  <SyncSettings activeRepo={activeRepo} appLayout={appLayout} />
                </div>
              </div>
            </div>

          </section>
        </main>
      )}

      {/* MODERN BENTO CARD GRID LAYOUT */}
      {appLayout === 'bento' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 space-y-6 animate-fade-in" id="bento-dashboard-master">
          {/* Row 1: Header + Dynamic Premium Preview */}
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl shadow-xl shadow-black/20 relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
                <span className="text-xs font-mono text-cyan-400 uppercase font-bold tracking-widest">[BENTO STAGE MAIN INTERACTION]</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_THEMES.map((theme) => {
                  const isActive = config.layout === theme.id;
                  return (
                    <button
                      key={`bento-theme-${theme.id}`}
                      onClick={() => {
                        handleUpdateConfig({ layout: theme.id });
                        handleApplyPalette(theme.palette);
                      }}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all border ${
                        isActive 
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow shadow-cyan-500/10' 
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-cyan-450 hover:border-slate-700'
                      }`}
                    >
                      {theme.emoji} {theme.label}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <CanvasPreview
              config={config}
              onChange={handleUpdateConfig}
              stats={{
                stars: activeRepo.stars,
                forks: activeRepo.forks,
                openIssues: activeRepo.openIssues,
                primaryLanguage: activeRepo.primaryLanguage,
                languageColor: activeRepo.languageColor,
              }}
              appLayout={appLayout}
            />
          </div>

          {/* Row 2: Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
            <div className="lg:col-span-4 h-[630px] overflow-hidden bg-slate-900/40 rounded-2xl border border-slate-800 p-2 shadow-lg shadow-black/10">
              <div className="text-xs font-extrabold text-cyan-400 font-mono tracking-widest uppercase mb-2 px-3 pt-2">
                [GRID_NODE_A] ACTIVE PATHWAY
              </div>
              <Sidebar
                repositories={repositories}
                activeRepoId={activeRepo.id}
                onSelect={setActiveRepo}
                onAddCustomRepo={handleAddCustomRepo}
                onSetRepositories={handleSetRepositories}
                appLayout={appLayout}
              />
            </div>

            <div className="lg:col-span-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-lg shadow-black/10">
              <div className="text-xs font-extrabold text-cyan-400 font-mono tracking-widest uppercase mb-1">
                [GRID_NODE_B] STYLES REGISTRY
              </div>
              <EditorPanels config={config} onChange={handleUpdateConfig} appLayout={appLayout} activeRepo={activeRepo} />
            </div>

            <div className="lg:col-span-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-lg shadow-black/10">
              <div className="text-xs font-extrabold text-cyan-400 font-mono tracking-widest uppercase mb-1">
                [GRID_NODE_C] ANALYSIS ENGINE
              </div>
              <AiAnalysisPanel activeRepo={activeRepo} onApplyAiCustomizations={handleApplyAiCustomizations} appLayout={appLayout} />
              <div className="border-t border-slate-800 pt-4">
                <SyncSettings activeRepo={activeRepo} appLayout={appLayout} />
              </div>
            </div>
          </div>
        </main>
      )}

      {/* IMMERSIVE SINGLE-SCREEN FOCUS LAYOUT (ZEN MINIMALIST LIGHT DESIGN) */}
      {appLayout === 'focus' && (
        <main className="max-w-4xl mx-auto px-4 pt-10 pb-24 space-y-8 animate-fade-in" id="focus-dashboard-master">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 font-bold uppercase">Zen Designer Focus Stage</span>
            <h2 className="text-2xl font-serif italic text-zinc-900 tracking-tight">Focusing on {activeRepo.name} canvas</h2>
            <p className="text-xs text-zinc-505 max-w-md mx-auto">Objective architectural layout. Switch repository vectors via the pickers underneath.</p>
          </div>

          {/* Centered Large Preview inside beautiful crisp clean background */}
          <div className="bg-white p-6 rounded-xl border border-zinc-200/80 shadow-lg shadow-zinc-200/30">
            <div className="flex items-center justify-between mb-3 text-[11px] font-mono text-zinc-400 border-b border-zinc-100 pb-2">
              <span>CANVAS PREVIEW WORKSPACE</span>
              <span>1200x630 PIXELS SYSTEM</span>
            </div>
            <CanvasPreview
              config={config}
              onChange={handleUpdateConfig}
              stats={{
                stars: activeRepo.stars,
                forks: activeRepo.forks,
                openIssues: activeRepo.openIssues,
                primaryLanguage: activeRepo.primaryLanguage,
                languageColor: activeRepo.languageColor,
              }}
              appLayout={appLayout}
            />
          </div>

          {/* Quick inline metadata swapping pill */}
          <div className="flex flex-wrap items-center justify-center gap-2 bg-white p-3 rounded-lg border border-zinc-200 shadow-sm">
            <span className="text-[10px] text-zinc-400 font-mono font-bold uppercase mr-1">Select Code Repository:</span>
            {repositories.map((repo) => (
              <button
                key={`focus-repo-${repo.id}`}
                onClick={() => setActiveRepo(repo)}
                className={`px-3 py-1 rounded text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                  repo.id === activeRepo.id 
                    ? 'bg-zinc-900 text-white shadow' 
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-650'
                }`}
              >
                {repo.name}
              </button>
            ))}
          </div>

          {/* Accordion customization blocks strictly light style compatible */}
          <div className="space-y-4">
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 font-sans">Configure Master Elements</span>
                <span className="text-zinc-400 text-xs font-mono">STEP 01</span>
              </div>
              <div className="p-6">
                <EditorPanels config={config} onChange={handleUpdateConfig} activeRepo={activeRepo} appLayout={appLayout} />
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 font-sans">Gemini AI Engine & Webhook Settings</span>
                <span className="text-zinc-400 text-xs font-mono">STEP 02</span>
              </div>
              <div className="p-6 space-y-6">
                <AiAnalysisPanel activeRepo={activeRepo} onApplyAiCustomizations={handleApplyAiCustomizations} appLayout={appLayout} />
                <div className="border-t border-zinc-100 pt-6">
                  <SyncSettings activeRepo={activeRepo} appLayout={appLayout} />
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* RETRO HACKER MONITORS TERMINAL LAYOUT */}
      {appLayout === 'hacker' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 space-y-8 animate-fade-in" id="hacker-dashboard-master">
          <div className="border-2 border-emerald-950 bg-black p-4 rounded text-xs flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-2h-2 bg-emerald-505 rounded-full animate-ping text-[14px]">●</span>
              <span className="animate-typewriter">[ONLINE] PROTO-CONSOLE SOCIAL PREVIEW V3.2 IN PRODUCTION</span>
            </div>
            <div className="text-emerald-700 text-[10px] font-mono animate-typewriter-fast">
              IPCACHE: 127.0.0.1 // DEV_SERVER: PORT_3000 // SYSTEM: GREEN
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Terminal Left Sidebar (Col 4) */}
            <div className="lg:col-span-4 border-2 border-emerald-900 bg-black rounded overflow-hidden">
              <div className="bg-emerald-950/35 p-2 border-b border-emerald-900 text-[10px] tracking-widest text-emerald-500 font-bold uppercase font-mono animate-typewriter">
                [SECTION_A] RAW ACTIVE REPOSITORIES LIST
              </div>
              <div className="p-2">
                <Sidebar
                  repositories={repositories}
                  activeRepoId={activeRepo.id}
                  onSelect={setActiveRepo}
                  onAddCustomRepo={handleAddCustomRepo}
                  onSetRepositories={handleSetRepositories}
                  appLayout={appLayout}
                />
              </div>
            </div>

            {/* Terminal Preview Stage (Col 8) */}
            <div className="lg:col-span-8 space-y-6 font-mono">
              <div className="border-2 border-emerald-900 bg-black p-4 rounded shadow-inner">
                <div className="text-[10px] text-emerald-500 border-b border-emerald-900/60 pb-2 mb-4 tracking-widest uppercase font-bold animate-typewriter">
                  [SECTION_B] VECTOR_PORTAL RENDER BUFFER VIEW (1200x630)
                </div>
                <CanvasPreview
                  config={config}
                  onChange={handleUpdateConfig}
                  stats={{
                    stars: activeRepo.stars,
                    forks: activeRepo.forks,
                    openIssues: activeRepo.openIssues,
                    primaryLanguage: activeRepo.primaryLanguage,
                    languageColor: activeRepo.languageColor,
                    repoName: activeRepo.name,
                    repoOwner: activeRepo.owner,
                  }}
                  appLayout={appLayout}
                />
              </div>

              {/* Tweak Modules Side-by-side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-emerald-900 bg-black rounded p-4">
                  <div className="text-[10px] text-emerald-600 font-bold uppercase mb-2 animate-typewriter">
                    [MODULE.A] PARAMETER STYLING
                  </div>
                  <EditorPanels config={config} onChange={handleUpdateConfig} activeRepo={activeRepo} appLayout={appLayout} />
                </div>
                <div className="border-2 border-emerald-900 bg-black rounded p-4 space-y-4">
                  <div className="text-[10px] text-emerald-600 font-bold uppercase mb-2 animate-typewriter">
                    [MODULE.B] AI DISPATCH & WEBHOOK SYNCS
                  </div>
                  <AiAnalysisPanel activeRepo={activeRepo} onApplyAiCustomizations={handleApplyAiCustomizations} appLayout={appLayout} />
                  <div className="border-t border-emerald-950 pt-2 text-[10px]">
                    <SyncSettings activeRepo={activeRepo} appLayout={appLayout} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* FOOTER & CREATOR ATTRIBUTION BRANDING (UNIQUE DESIGN FOR EACH LAYOUT) */}
      {appLayout === 'split' && (
        <footer className="bg-zinc-950 border-t border-zinc-900 py-12 text-zinc-400" id="global-application-footer-split">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-extrabold text-white">GitHub OG Image Manager</span>
              <p className="text-xs text-zinc-500 font-mono leading-relaxed font-sans">
                Industrial SaaS architecture featuring Satori Vector logic & Gemini AI reasoning.
              </p>
            </div>

            <div className="text-center md:text-right flex flex-col gap-2">
              <span className="text-xs text-zinc-400 font-mono inline-flex items-center justify-center md:justify-end gap-1">
                <span>Made with high craft by</span>
                <a
                  href="https://github.com/jehadurre"
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="text-white hover:text-sky-450 transition-colors font-bold flex items-center gap-0.5"
                >
                  <span>@jehadurre</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </span>
              <span className="text-[10px] text-zinc-650 block">
                © 2026 Md. Jehad. All rights reserved. Registered SaaS Workspace template.
              </span>
            </div>
          </div>
        </footer>
      )}

      {appLayout === 'bento' && (
        <footer className="bg-slate-950/85 border-t border-slate-800 py-12 text-slate-300" id="global-application-footer-bento">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300">COSMIC BENTO GRID ENGINE</span>
              <p className="text-xs text-slate-400 font-mono leading-relaxed">
                Dynamic Open Graph automation in a reactive multi-dimensional portal.
              </p>
            </div>

            <div className="text-center md:text-right flex flex-col gap-2">
              <span className="text-xs text-slate-400 font-mono inline-flex items-center justify-center md:justify-end gap-1">
                <span>Forged under cosmic light by</span>
                <a
                  href="https://github.com/jehadurre"
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors font-bold flex items-center gap-0.5"
                >
                  <span>@jehadurre</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </span>
              <span className="text-[10px] text-slate-500 block">
                © 2026 Celestial Enterprise. Sync active on dynamic SVG frames.
              </span>
            </div>
          </div>
        </footer>
      )}

      {appLayout === 'focus' && (
        <footer className="bg-[#f5f5f4] border-t border-zinc-200 py-10 text-zinc-550 font-sans" id="global-application-footer-focus">
          <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-serif italic text-zinc-900 font-extrabold">The Minimalist Layout</span>
              <span className="text-[10px] text-zinc-400 font-mono">Zero decoration, pristine typography.</span>
            </div>

            <div className="text-center sm:text-right text-[11px] font-mono">
              Designed by <a href="https://github.com/jehadurre" target="_blank" referrerPolicy="no-referrer" className="text-zinc-900 font-bold hover:underline">@jehadurre</a>
              <span className="block text-[10px] text-zinc-450 mt-1">© 2026 Md. Jehad. Switzerland Portfolio Standard.</span>
            </div>
          </div>
        </footer>
      )}

      {appLayout === 'hacker' && (
        <footer className="bg-black border-t-2 border-emerald-950 border-dashed py-10 font-mono text-emerald-500" id="global-application-footer-hacker">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <div>[EOF_ATTRIBUTION_LOG]</div>
              <p className="text-[11px] text-emerald-800">
                CRON_SYS: ACTIVE // STATUS_STABLE // VECTOR_STREAMING_NODE_OK
              </p>
            </div>

            <div className="text-center md:text-right space-y-1">
              <span className="text-xs text-emerald-400 inline-flex items-center justify-center md:justify-end gap-1">
                <span>AUTHOR: @JEHADURRE</span>
                <span className="px-1 bg-emerald-900 text-black font-extrabold">DECRYPTED</span>
              </span>
              <span className="text-[10px] text-emerald-700 block">
                CONSOLE_YEAR_2026 // SYSTEM TERMINATED EXECUTING SUCCESS.
              </span>
            </div>
          </div>
        </footer>
      )}

      <TemplateGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        config={config}
        activeRepo={activeRepo}
        onSelectTemplate={(updates) => {
          handleUpdateConfig(updates);
          if (updates.primaryColor && updates.secondaryColor && updates.accentColor && updates.backgroundColor) {
            handleApplyPalette([updates.primaryColor, updates.secondaryColor, updates.accentColor, updates.backgroundColor]);
          }
        }}
        themes={QUICK_THEMES}
      />

      {/* Global Saved Toast Notification */}
      <div 
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-emerald-500/30 text-white rounded-full shadow-2xl shadow-emerald-500/20 font-medium text-sm transition-all duration-300 ease-out transform ${
          showSavedToast ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <Check className="w-4 h-4 text-emerald-400" />
        <span>Config saved successfully</span>
      </div>
    </div>
  );
}
