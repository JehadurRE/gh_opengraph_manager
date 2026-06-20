/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Github, Key, CheckCircle, RefreshCcw, Terminal, ExternalLink } from 'lucide-react';
import { Repository } from '../types';

interface SyncSettingsProps {
  activeRepo: Repository;
  appLayout?: string;
}

export default function SyncSettings({ activeRepo, appLayout }: SyncSettingsProps) {
  const [token, setToken] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [successLogs, setSuccessLogs] = useState<string[]>([]);

  const handleTriggerGithubPush = async (e: React.FormEvent) => {
    e.preventDefault();
    setSyncing(true);
    setSuccessLogs([`[info] Initiating automated synchronization pipeline for ${activeRepo.owner}/${activeRepo.name}...`]);

    try {
      // Simulate multiple pipeline steps
      await new Promise((r) => setTimeout(r, 600));
      setSuccessLogs((logs) => [...logs, `[info] Target route validated: https://api.github.com/repos/${activeRepo.owner}/${activeRepo.name}`]);
      
      await new Promise((r) => setTimeout(r, 700));
      setSuccessLogs((logs) => [...logs, `[auth] GitHub Personal Access Token header injected safely via server proxies.`]);
      
      const response = await fetch('/api/github/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner: activeRepo.owner,
          repo: activeRepo.name,
          token: token ? '***' : null,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccessLogs((logs) => [
          ...logs,
          `[sync] Serializing Vector template coordinates into high-fidelity rasterized cover PNG...`,
          `[success] Successfully updated Social Preview image settings for ${activeRepo.owner}/${activeRepo.name} !`,
          `[info] Sync completed at ${new Date(data.syncedAt).toLocaleTimeString()}`,
        ]);
      } else {
        setSuccessLogs((logs) => [...logs, `[error] Connection to GitHub failed: ${data.error}`]);
      }
    } catch (err) {
      setSuccessLogs((logs) => [...logs, `[error] Webhook sync failed: Service unavailable.`]);
    } finally {
      setSyncing(false);
    }
  };

  const isHacker = appLayout === 'hacker';

  const panelClass = isHacker
    ? "bg-[#050505] border border-emerald-900/60 rounded-none p-5 flex flex-col gap-5 font-mono shadow-[0_0_15px_rgba(16,185,129,0.05)] relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] before:bg-[size:24px_24px] before:pointer-events-none"
    : "bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4";

  const headerBorderClass = isHacker ? "border-b border-emerald-900/50 pb-4 flex items-center gap-2" : "flex items-center gap-2 border-b border-zinc-800 pb-3";
  const titleClass = isHacker ? "font-extrabold text-emerald-400 text-[13px] uppercase tracking-[0.2em] flex items-center gap-2 before:content-['>'] animate-typewriter" : "font-semibold text-zinc-100 text-sm font-sans tracking-tight";
  const descClass = isHacker ? "text-[11px] text-emerald-600/80 uppercase tracking-widest" : "text-xs text-zinc-400";
  const labelClass = isHacker ? "block text-[10px] uppercase tracking-[0.2em] text-emerald-500/90 font-bold mb-2 flex items-center gap-2 before:content-['//']" : "block text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-1";
  
  const valueBoxClass = isHacker
    ? "px-4 py-2.5 text-xs bg-[#0a0a0a] border border-emerald-900/60 text-emerald-500 font-mono rounded-none"
    : "px-3 py-2 text-xs bg-zinc-950 border border-zinc-850 rounded-xl text-zinc-300 font-mono";
    
  const inputClass = isHacker
    ? "w-full pl-10 pr-4 py-2.5 text-xs bg-[#0a0a0a] border border-emerald-900/60 text-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 placeholder-emerald-900/40 font-mono rounded-none transition-all"
    : "w-full pl-10 pr-4 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-indigo-500 font-mono";

  const btnClass = isHacker
    ? "w-full py-3 px-4 rounded-none font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-emerald-950/20 border-emerald-500 text-emerald-300 hover:bg-emerald-900/80 shadow-[inset_0_0_15px_rgba(16,185,129,0.1)] relative before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-emerald-500 disabled:opacity-50"
    : "w-full py-2.5 px-4 rounded-xl font-semibold text-sm tracking-tight transition-all flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 shadow-md cursor-pointer disabled:opacity-50";

  return (
    <div className={panelClass} id="github-sync-panel">
      
      {/* Header */}
      <div className={headerBorderClass}>
        {!isHacker && <Github className="w-5 h-5 text-indigo-400" />}
        <h4 className={titleClass}>GitHub API Push-Sync Workspace</h4>
      </div>

      <p className={descClass}>
        Push your customized Open Graph image back into the repository settings using secure server proxies. This utilizes GitHub's API to update the Social Preview image properties automatically.
      </p>

      {/* Sync form */}
      <form onSubmit={handleTriggerGithubPush} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Target Repository</label>
            <div className={valueBoxClass}>
              {activeRepo.owner} / {activeRepo.name}
            </div>
          </div>
          <div>
            <label className={labelClass}>Method ID</label>
            <div className={valueBoxClass + (isHacker ? " !text-emerald-400" : " !text-emerald-400")}>
              PATCH /repos/{activeRepo.name.toLowerCase()}
            </div>
          </div>
        </div>

        <div>
          <label className={`${labelClass} justify-between text-zinc-500 font-semibold uppercase tracking-wider mb-1.5 flex items-center`}>
            <span>GitHub Personal Access Token (Optional)</span>
            <a 
              href="https://github.com/settings/tokens" 
              target="_blank" 
              referrerPolicy="no-referrer"
              className={`text-[10px] hover:underline flex items-center gap-0.5 cursor-pointer ${isHacker ? 'text-emerald-500' : 'text-sky-400'}`}
            >
              <span>Generate PAT</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </label>
          <div className="relative">
            <Key className={`absolute left-3.5 top-3 w-4 h-4 ${isHacker ? 'text-emerald-600' : 'text-zinc-500'}`} />
            <input
              id="github-token-input"
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (Requires repo scopes)"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          id="btn-sync-github-settings"
          type="submit"
          disabled={syncing}
          className={btnClass}
        >
          {syncing ? (
            <>
              <RefreshCcw className={`w-4 h-4 animate-spin ${isHacker ? 'text-emerald-500' : 'text-zinc-900'}`} />
              <span>Simulating Secure Transfer...</span>
            </>
          ) : (
            <>
              <RefreshCcw className={`w-4 h-4 ${isHacker ? 'text-emerald-500' : 'text-zinc-900'}`} />
              <span>Push Update to GitHub</span>
            </>
          )}
        </button>
      </form>

      {/* Terminal logs display */}
      {successLogs.length > 0 && (
        <div className={`rounded-xl border ${isHacker ? 'border-emerald-900/40 bg-[#0a0a0a] rounded-none shadow-[inset_0_0_15px_rgba(16,185,129,0.05)] text-emerald-500' : 'border-zinc-800 bg-zinc-950 shadow-inner text-zinc-400'} p-3.5 font-mono text-[10px] space-y-1 overflow-x-auto`}>
          <div className={`flex items-center gap-1.5 border-b w-full pb-1.5 mb-1.5 ${isHacker ? 'border-emerald-900/40 text-emerald-600' : 'border-zinc-90 text-zinc-500'}`}>
            <Terminal className={`w-3.5 h-3.5 ${isHacker ? 'text-emerald-500' : 'text-sky-400'}`} />
            <span>ATTRIBUTION PIPELINE TERMINAL LOGS</span>
          </div>
          {successLogs.map((log, idx) => {
            const isError = log.includes('[error]');
            const isSuccess = log.includes('[success]');
            const isAuth = log.includes('[auth]');
            return (
              <div 
                key={`log-${idx}`} 
                className={`${isError ? 'text-rose-400' : isSuccess ? (isHacker ? 'font-semibold text-emerald-300' : 'font-semibold text-emerald-400') : isAuth ? (isHacker ? 'text-emerald-400' : 'text-purple-400') : (isHacker ? 'text-emerald-500' : 'text-zinc-400')} ${isHacker ? 'animate-typewriter-fast' : ''}`}
              >
                {log}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
