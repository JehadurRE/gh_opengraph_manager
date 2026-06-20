/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/// <reference types="vite/client" />
import React, { useState, useEffect } from 'react';
import { Repository } from '../types';
import { Search, Plus, GitPullRequest, Star, AlertCircle, FileText, Blocks, Github, RefreshCw, X } from 'lucide-react';
import { getGithubOAuthUrl } from '../utils/github';

interface SidebarProps {
  repositories: Repository[];
  activeRepoId: string;
  onSelect: (repo: Repository) => void;
  onAddCustomRepo: (newRepo: Repository) => void;
  onSetRepositories?: (repos: Repository[]) => void;
  appLayout?: 'split' | 'bento' | 'focus' | 'hacker';
}

export default function Sidebar({
  repositories,
  activeRepoId,
  onSelect,
  onAddCustomRepo,
  onSetRepositories,
  appLayout,
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const isBento = appLayout === 'bento';
  const isFocus = appLayout === 'focus';
  const isHacker = appLayout === 'hacker';

  // Compute Tailwind styles based on layout mode
  let containerClass = "flex flex-col h-full bg-zinc-900 border border-zinc-805 rounded-2xl overflow-hidden";
  let headerClass = "p-4 border-b border-zinc-800 flex flex-col gap-3";
  let titleClass = "font-semibold text-zinc-105 font-sans tracking-tight flex items-center gap-1.5";
  let subtitleClass = "text-[11px] text-zinc-500 tracking-tight";
  let creatorLinkClass = "text-[11px] text-sky-450 hover:text-sky-350 font-semibold font-mono inline-flex items-center justify-center gap-1 group";
  let plusButtonClass = "flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sky-400 border border-zinc-700 cursor-pointer transition-colors";
  let inputClass = "w-full pl-9 pr-4 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-sky-500 transition-colors";
  let repoItemNormalClass = "border border-transparent hover:bg-zinc-850/60";
  let repoItemActiveClass = "bg-zinc-800/80 border border-zinc-700/60 shadow-md shadow-black/20";
  let activeIndicatorClass = "absolute left-0 top-0 bottom-0 w-1 bg-sky-500";
  let repoMetaClass = "text-[10px] text-zinc-500 font-mono";
  let repoNameClass = "font-semibold tracking-tight text-sm text-zinc-300";
  let repoNameActiveClass = "font-semibold tracking-tight text-sm text-zinc-100";
  let statsClass = "flex items-center gap-3 pt-1 text-[11px] text-zinc-500 font-mono";
  let searchIconClass = "absolute left-3 top-2.5 w-4 h-4 text-zinc-500";
  let addModalFormClass = "p-4 border-b border-zinc-800 bg-zinc-950 flex flex-col gap-3 text-xs";
  let addModalInputClass = "w-full px-2 py-1.5 bg-zinc-900 border border-zinc-810 rounded text-zinc-100";
  let addModalInputColorClass = "w-full px-1.5 py-1 bg-zinc-900 border border-zinc-810 rounded text-zinc-100 font-mono text-[10px]";
  let addModalSubmitClass = "w-full py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-semibold tracking-tight transition-colors cursor-pointer";
  let footerContainerClass = "p-3 border-t border-zinc-800 bg-zinc-950/80 text-center flex flex-col gap-1.5";
  let blocksIconClass = "w-5 h-5 text-sky-400";

  if (isBento) {
    containerClass = "flex flex-col h-full bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-black/10";
    headerClass = "p-4 border-b border-slate-800 flex flex-col gap-3";
    titleClass = "font-extrabold text-cyan-400 font-sans tracking-wider uppercase text-xs flex items-center gap-1.5";
    subtitleClass = "text-[11px] text-slate-450 tracking-tight font-mono uppercase";
    creatorLinkClass = "text-[11px] text-cyan-405 hover:text-cyan-300 font-bold font-mono inline-flex items-center justify-center gap-1 group";
    plusButtonClass = "flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 cursor-pointer shadow shadow-cyan-500/5 transition-all";
    inputClass = "w-full pl-9 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-colors";
    repoItemNormalClass = "border border-transparent hover:bg-slate-905/45 text-slate-300 hover:text-white";
    repoItemActiveClass = "bg-slate-900/75 border-2 border-cyan-500/40 shadow-md shadow-cyan-500/5";
    activeIndicatorClass = "absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-400 to-indigo-500";
    repoMetaClass = "text-[10px] text-slate-400 font-mono";
    repoNameClass = "font-semibold tracking-tight text-sm text-slate-300";
    repoNameActiveClass = "font-extrabold tracking-tight text-sm text-white";
    statsClass = "flex items-center gap-3 pt-1 text-[11px] text-slate-400 font-mono";
    searchIconClass = "absolute left-3 top-2.5 w-4 h-4 text-slate-500";
    addModalFormClass = "p-4 border-b border-slate-800 bg-slate-950/95 flex flex-col gap-3 text-xs";
    addModalInputClass = "w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-cyan-500";
    addModalInputColorClass = "w-full px-1.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-100 font-mono text-[10px]";
    addModalSubmitClass = "w-full py-1.5 rounded bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold tracking-tight cursor-pointer shadow shadow-cyan-500/15";
    footerContainerClass = "p-3 border-t border-slate-805 bg-slate-950/50 text-center flex flex-col gap-1.5 text-xs text-slate-400";
    blocksIconClass = "w-5 h-5 text-cyan-400";
  } else if (isFocus) {
    containerClass = "flex flex-col h-full bg-white border border-zinc-200/80 rounded-xl overflow-hidden shadow-sm";
    headerClass = "p-4 border-b border-zinc-150 flex flex-col gap-3 bg-zinc-50/50";
    titleClass = "font-serif italic text-zinc-900 font-extrabold tracking-tight text-sm flex items-center gap-1.5";
    subtitleClass = "text-[11px] text-zinc-400 font-mono";
    creatorLinkClass = "text-[11px] text-zinc-900 hover:underline font-semibold tracking-tight inline-flex items-center justify-center gap-1";
    plusButtonClass = "flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer transition-colors";
    inputClass = "w-full pl-9 pr-4 py-2 text-sm bg-zinc-50 border border-zinc-250 rounded text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-500 transition-colors";
    repoItemNormalClass = "border border-transparent hover:bg-zinc-50 text-zinc-700";
    repoItemActiveClass = "bg-zinc-100/80 border border-zinc-200/80 shadow-sm";
    activeIndicatorClass = "absolute left-0 top-0 bottom-0 w-1 bg-zinc-950";
    repoMetaClass = "text-[10px] text-zinc-500 font-mono";
    repoNameClass = "font-semibold tracking-tight text-sm text-zinc-650";
    repoNameActiveClass = "font-extrabold tracking-tight text-sm text-zinc-950";
    statsClass = "flex items-center gap-3 pt-1 text-[11px] text-zinc-400 font-mono";
    searchIconClass = "absolute left-3 top-2.5 w-4 h-4 text-zinc-400";
    addModalFormClass = "p-4 border-b border-zinc-200 bg-zinc-50 flex flex-col gap-3 text-xs";
    addModalInputClass = "w-full px-2 py-1.5 bg-white border border-zinc-300 rounded text-zinc-900 focus:border-zinc-900";
    addModalInputColorClass = "w-full px-1.5 py-1 bg-white border border-zinc-300 rounded text-zinc-900 font-mono text-[10px]";
    addModalSubmitClass = "w-full py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold tracking-tight cursor-pointer";
    footerContainerClass = "p-3 border-t border-zinc-150 bg-zinc-50/50 text-center flex flex-col gap-1.5";
    blocksIconClass = "w-5 h-5 text-zinc-900";
  } else if (isHacker) {
    containerClass = "flex flex-col h-full bg-black border-2 border-emerald-950 font-mono";
    headerClass = "p-4 border-b-2 border-dashed border-emerald-950 flex flex-col gap-3";
    titleClass = "font-bold text-emerald-400 tracking-wider uppercase text-xs flex items-center gap-1.5";
    subtitleClass = "text-[10px] text-emerald-700";
    creatorLinkClass = "text-[11px] text-emerald-400 bg-emerald-950 px-1 hover:text-emerald-300 font-bold font-mono inline-flex items-center justify-center gap-1";
    plusButtonClass = "flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 cursor-pointer transition-colors";
    inputClass = "w-full pl-9 pr-4 py-2 text-xs bg-black border border-emerald-950 text-emerald-400 placeholder-emerald-800 focus:outline-none focus:border-emerald-700 transition-colors";
    repoItemNormalClass = "border border-transparent hover:bg-emerald-950/20 text-emerald-605";
    repoItemActiveClass = "bg-black border-2 border-emerald-800 shadow-inner";
    activeIndicatorClass = "absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-400";
    repoMetaClass = "text-[10px] text-emerald-600 font-mono";
    repoNameClass = "font-semibold text-xs text-emerald-500";
    repoNameActiveClass = "font-extrabold text-xs text-emerald-300";
    statsClass = "flex items-center gap-3 pt-1 text-[11px] text-emerald-600 font-mono";
    searchIconClass = "absolute left-3 top-2.5 w-4 h-4 text-emerald-600";
    addModalFormClass = "p-4 border-b border-dashed border-emerald-950 bg-black flex flex-col gap-3 text-xs";
    addModalInputClass = "w-full px-2 py-1.5 bg-black border border-emerald-950 text-emerald-400 font-mono";
    addModalInputColorClass = "w-full px-1.5 py-1 bg-black border border-emerald-950 text-emerald-400 font-mono text-[10px]";
    addModalSubmitClass = "w-full py-1.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold uppercase cursor-pointer";
    footerContainerClass = "p-3 border-t-2 border-dashed border-emerald-950 bg-black text-center flex flex-col gap-1.5";
    blocksIconClass = "w-5 h-5 text-emerald-400";
  }

  const [formData, setFormData] = useState({
    name: 'custom-utility',
    owner: 'jehadurre',
    description: 'A custom developer helper tool created under high architectural standards.',
    stars: '150',
    forks: '25',
    openIssues: '2',
    primaryLanguage: 'React',
    languageColor: '#61dafb',
  });

  const [showSyncModal, setShowSyncModal] = useState(false);
  const [githubUsername, setGithubUsername] = useState('jehadurre');
  const [syncingFromGithub, setSyncingFromGithub] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSyncFromGithub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUsername.trim()) return;
    
    setSyncingFromGithub(true);
    try {
      const res = await fetch(`https://api.github.com/users/${githubUsername.trim()}/repos?sort=updated&per_page=15`);
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          const newRepos: Repository[] = data.map((r: any) => ({
            id: `github-${r.id}`,
            name: r.name,
            owner: r.owner.login,
            description: r.description || '',
            stars: r.stargazers_count,
            forks: r.forks_count,
            openIssues: r.open_issues_count,
            primaryLanguage: r.language || 'Unknown',
            languageColor: r.language === 'TypeScript' ? '#3178c6' : r.language === 'JavaScript' ? '#f1e05a' : '#38bdf8',
          }));
          if (onSetRepositories) {
            onSetRepositories(newRepos);
          }
        }
        setShowSyncModal(false);
      } else {
        console.error('Failed to fetch github repos', await res.text());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSyncingFromGithub(false);
    }
  };

  const handleConnectGithubOAuth = async () => {
    try {
      const origin = window.location.origin;
      const redirectUri = `${origin}/auth/callback`;
      let url = '';
      
      const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
      if (clientId) {
        url = getGithubOAuthUrl(clientId, redirectUri);
      } else {
        const response = await fetch(`/api/auth/github/url?origin=${encodeURIComponent(origin)}`);
        if (!response.ok) {
          throw new Error('Failed to get auth URL');
        }
        const data = await response.json();
        url = data.url;
      }
  
      const authWindow = window.open(
        url,
        'oauth_popup',
        'width=600,height=700'
      );
  
      if (!authWindow) {
        alert('Please allow popups for this site to connect your GitHub account.');
      }
    } catch (error) {
      console.error('OAuth error:', error);
    }
  };

  const fetchUserGithubRepos = async (token: string) => {
    setSyncingFromGithub(true);
    try {
      const res = await fetch('https://api.github.com/user/repos?sort=updated&per_page=15', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          const newRepos: Repository[] = data.map((r: any) => ({
            id: `github-${r.id}`,
            name: r.name,
            owner: r.owner.login,
            description: r.description || '',
            stars: r.stargazers_count,
            forks: r.forks_count,
            openIssues: r.open_issues_count,
            primaryLanguage: r.language || 'Unknown',
            languageColor: r.language === 'TypeScript' ? '#3178c6' : r.language === 'JavaScript' ? '#f1e05a' : '#38bdf8',
          }));
          if (onSetRepositories) {
            onSetRepositories(newRepos);
          }
        }
        setShowSyncModal(false);
      } else {
        console.error('Failed to fetch github repos via OAuth', await res.text());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSyncingFromGithub(false);
      setGithubUsername('jehadurre'); // reset
    }
  };

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem('github_oauth_token');
    if (storedToken) {
      setIsAuthenticated(true);
      if (onSetRepositories && repositories.length === 0) {
        fetchUserGithubRepos(storedToken);
      }
    }

    const handleMessage = async (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const token = event.data.token;
        if (token) {
          localStorage.setItem('github_oauth_token', token);
          setIsAuthenticated(true);
          fetchUserGithubRepos(token);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = repositories.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.primaryLanguage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRepo: Repository = {
      id: `custom-repo-${Date.now()}`,
      name: formData.name.trim() || 'my-workspace',
      owner: formData.owner.trim() || 'jehadurre',
      description: formData.description.trim(),
      stars: parseInt(formData.stars) || 0,
      forks: parseInt(formData.forks) || 0,
      openIssues: parseInt(formData.openIssues) || 0,
      primaryLanguage: formData.primaryLanguage || 'TypeScript',
      languageColor: formData.languageColor || '#3178c6',
    };

    onAddCustomRepo(newRepo);
    setShowAddModal(false);
    // Reset form
    setFormData({
      name: '',
      owner: 'jehadurre',
      description: '',
      stars: '0',
      forks: '0',
      openIssues: '0',
      primaryLanguage: 'TypeScript',
      languageColor: '#3178c6',
    });
  };

  return (
    <div className={containerClass} id="dashboard-sidebar">
      {/* Sidebar search header */}
      <div className={headerClass}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Blocks className={blocksIconClass} />
              <h3 className={titleClass}>Active Repositories</h3>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setShowSyncModal(!showSyncModal);
                  setShowAddModal(false);
                }}
                className={`${plusButtonClass} !bg-indigo-500/10 !text-indigo-400 !border-indigo-500/30 hover:!bg-indigo-500/20`}
                title="Sync from GitHub"
              >
                <Github className="w-3.5 h-3.5" />
              </button>
              <button
                id="btn-trigger-add-repo-panel"
                onClick={() => {
                  setShowAddModal(!showAddModal);
                  setShowSyncModal(false);
                }}
                className={plusButtonClass}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Repo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative group">
          <Search className={searchIconClass} />
          <input
            id="search-repos-input"
            type="text"
            placeholder="Search repository..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={inputClass}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-[10px] text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* GitHub Sync Form Modal Overlay */}
      {showSyncModal && (
        <form
          autoComplete="off"
          onSubmit={handleSyncFromGithub}
          className={addModalFormClass}
        >
          <div className="flex justify-between items-center font-semibold mb-1">
            <span className="flex items-center gap-1.5"><Github className="w-3.5 h-3.5"/> GitHub Import</span>
            <button
              type="button"
              onClick={() => setShowSyncModal(false)}
              className="hover:opacity-80"
            >
              Cancel
            </button>
          </div>
          <p className="text-[10px] opacity-70 leading-tight">Connect your account securely or fetch from public user.</p>
          
          <button
            type="button"
            onClick={handleConnectGithubOAuth}
            disabled={syncingFromGithub}
            className={`${addModalSubmitClass} !bg-[#2ea043] border border-[rgba(240,246,252,0.1)] !text-white flex items-center justify-center gap-2 hover:!bg-[#3fb950] transition-colors`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>Connect GitHub Account</span>
          </button>
          
          <div className="my-1 border-b border-white/10" />

          <div>
            <label className="block mb-1 opacity-70">GitHub Username</label>
            <input
              type="text"
              required
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              className={addModalInputClass}
              placeholder="e.g. jehadurre"
            />
          </div>
          <button
            type="submit"
            disabled={syncingFromGithub}
            className={`${addModalSubmitClass} flex items-center justify-center gap-2`}
          >
            {syncingFromGithub ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Github className="w-3.5 h-3.5" />}
            <span>{syncingFromGithub ? 'Fetching...' : 'Fetch Public Repos'}</span>
          </button>
        </form>
      )}

      {/* Add Custom Repo Form overlay (or inline expansion) */}
      {showAddModal && (
        <form
          id="custom-repo-creation-form"
          onSubmit={handleSubmit}
          className={addModalFormClass}
        >
          <div className="flex justify-between items-center font-semibold mb-1">
            <span>Configure Custom Repository</span>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="hover:opacity-80"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1 opacity-70">Repo Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={addModalInputClass}
                placeholder="e.g. core-engine"
              />
            </div>
            <div>
              <label className="block mb-1 opacity-70">Owner Name</label>
              <input
                type="text"
                required
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className={addModalInputClass}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 opacity-70">Brief Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`${addModalInputClass} text-xs`}
              placeholder="Describe what the repository achieves"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block mb-1 opacity-70">Stars</label>
              <input
                type="number"
                value={formData.stars}
                onChange={(e) => setFormData({ ...formData, stars: e.target.value })}
                className={addModalInputClass}
              />
            </div>
            <div>
              <label className="block mb-1 opacity-70">Forks</label>
              <input
                type="number"
                value={formData.forks}
                onChange={(e) => setFormData({ ...formData, forks: e.target.value })}
                className={addModalInputClass}
              />
            </div>
            <div>
              <label className="block mb-1 opacity-70">Issues</label>
              <input
                type="number"
                value={formData.openIssues}
                onChange={(e) => setFormData({ ...formData, openIssues: e.target.value })}
                className={addModalInputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1 opacity-70">Language</label>
              <input
                type="text"
                value={formData.primaryLanguage}
                onChange={(e) => setFormData({ ...formData, primaryLanguage: e.target.value })}
                className={addModalInputClass}
              />
            </div>
            <div>
              <label className="block mb-1 opacity-70">Hex Color</label>
              <div className="flex gap-1.5 items-center">
                <input
                  type="color"
                  value={formData.languageColor}
                  onChange={(e) => setFormData({ ...formData, languageColor: e.target.value })}
                  className="w-6 h-6 bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.languageColor}
                  onChange={(e) => setFormData({ ...formData, languageColor: e.target.value })}
                  className={addModalInputColorClass}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={addModalSubmitClass}
          >
            Create Repository Entry
          </button>
        </form>
      )}

      {/* Repositories Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
        {!isAuthenticated && (
          <div className="px-3 py-4 mb-4 rounded-xl border border-dashed border-indigo-500/30 bg-indigo-500/5 text-center flex flex-col items-center gap-3 mx-1 mt-1">
            <Github className="w-8 h-8 text-indigo-400" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-zinc-200">Connect to GitHub</h4>
              <p className="text-[10px] text-zinc-400 px-2 leading-relaxed">Sign in to securely sync your personal and organizational repositories.</p>
            </div>
            <button
              onClick={handleConnectGithubOAuth}
              className="w-full py-2 mt-1 bg-indigo-600 hover:bg-indigo-500/90 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              Sign In with GitHub
            </button>
          </div>
        )}
        {syncingFromGithub ? (
          <div className="space-y-2 p-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse bg-zinc-800/40 rounded-xl p-3 border border-white/5 space-y-2">
                <div className="h-4 bg-zinc-700/50 rounded w-1/2"></div>
                <div className="h-3 bg-zinc-700/50 rounded w-full"></div>
                <div className="h-3 bg-zinc-700/50 rounded w-3/4"></div>
                <div className="flex gap-2 mt-2">
                  <div className="h-3 bg-zinc-700/50 rounded w-8"></div>
                  <div className="h-3 bg-zinc-700/50 rounded w-8"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-sm">
            <span>No repositories matched search query.</span>
          </div>
        ) : (
          filtered.map((repo) => {
            const isActive = repo.id === activeRepoId;
            return (
              <div
                key={repo.id}
                id={`sidebar-item-${repo.name}`}
                onClick={() => onSelect(repo)}
                className={`w-full text-left p-3.5 rounded-xl transition-all cursor-pointer flex flex-col gap-1.5 relative overflow-hidden group ${
                  isActive ? repoItemActiveClass : repoItemNormalClass
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className={activeIndicatorClass} />
                )}

                <div className="flex gap-3">
                  <div className="w-12 h-8 rounded shrink-0 overflow-hidden border border-white/10 shadow-sm bg-black/40 self-start mt-1 hidden sm:block">
                    <img 
                      src={`https://opengraph.githubassets.com/1/${repo.owner}/${repo.name}`}
                      alt="OG Preview"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className={repoMetaClass}>
                          {repo.owner} /
                        </span>
                        <span className={`${isActive ? repoNameActiveClass : repoNameClass} truncate`}>
                          {repo.name}
                        </span>
                      </div>
                      {/* Language Pill */}
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0"
                        style={{
                          backgroundColor: `${repo.languageColor}15`,
                          color: repo.languageColor,
                          border: `1px solid ${repo.languageColor}30`,
                        }}
                      >
                        {repo.primaryLanguage}
                      </span>
                    </div>

                    <p className="text-xs opacity-70 line-clamp-1 mb-2">
                      {repo.description}
                    </p>

                    {/* Counter badges */}
                    <div className={statsClass}>
                      <div className="flex items-center gap-1 group-hover:text-amber-400/90 transition-colors">
                        <Star className="w-3 h-3" />
                        <span>{repo.stars.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 group-hover:text-emerald-400/90 transition-colors">
                        <GitPullRequest className="w-3 h-3" />
                        <span>{repo.forks.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{repo.openIssues}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Social and licensing credit to creator Md. Jehad */}
      <div className={footerContainerClass}>
        <span className={subtitleClass}>
          GitHub OG Image Manager Platform
        </span>
        <a
          href="https://github.com/jehadurre"
          referrerPolicy="no-referrer"
          target="_blank"
          className={creatorLinkClass}
        >
          <span>Created by @jehadurre</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </a>
      </div>
    </div>
  );
}
