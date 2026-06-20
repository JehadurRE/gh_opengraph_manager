/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TemplateConfig, LayoutTheme, Repository } from '../types';
import { Sparkles, Eye, Code, Palette, Sliders, Image as ImageIcon, UploadCloud, Move } from 'lucide-react';

interface EditorPanelsProps {
  config: TemplateConfig;
  onChange: (updated: Partial<TemplateConfig>) => void;
  appLayout?: 'split' | 'bento' | 'focus' | 'hacker';
  activeRepo?: Repository;
}

const THEMES: { id: LayoutTheme; label: string; desc: string; palette: [string, string, string, string] }[] = [
  {
    id: 'cosmic',
    label: 'Deep Cosmic Portal',
    desc: 'Breathtaking space gradients and orbital paths.',
    palette: ['#38bdf8', '#a78bfa', '#fb7185', '#0a0f1d'],
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk Grid',
    desc: 'Terminal grid, scanlines, and high neon contrasts.',
    palette: ['#f43f5e', '#ec4899', '#f59e0b', '#030712'],
  },
  {
    id: 'minimalist',
    label: 'Swiss Minimalist',
    desc: 'Swiss style high contrast clean grid.',
    palette: ['#18181b', '#3f3f46', '#22c55e', '#ffffff'],
  },
  {
    id: 'elegant',
    label: 'Luxury Serif',
    desc: 'Soft gradient abstract fluid cards and elegant typography.',
    palette: ['#ec4899', '#8b5cf6', '#6366f1', '#0f051d'],
  },
  {
    id: 'terminal',
    label: 'CRT Terminal',
    desc: 'Monochromatic command shell, raw phosphor grid.',
    palette: ['#22c55e', '#16a34a', '#4ade80', '#022c22'],
  },
];

export default function EditorPanels({ config, onChange, appLayout, activeRepo }: EditorPanelsProps) {
  const handleApplyPalette = (themePalette: [string, string, string, string]) => {
    onChange({
      primaryColor: themePalette[0],
      secondaryColor: themePalette[1],
      accentColor: themePalette[2],
      backgroundColor: themePalette[3],
    });
  };

  const isBento = appLayout === 'bento';
  const isFocus = appLayout === 'focus';
  const isHacker = appLayout === 'hacker';

  // Card background and borders
  let cardClass = "bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4";
  let titleClass = "font-semibold text-zinc-101 text-sm font-sans tracking-tight";
  let textClass = "text-xs text-zinc-400";
  let labelClass = "block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1.5";
  let inputClass = "w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-sky-500 transition-colors";
  let textareaClass = "w-full text-xs font-mono p-3 bg-zinc-950 border border-zinc-850 rounded-xl text-zinc-300 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20";
  let borderClass = "border-b border-zinc-800 pb-3";
  let innerCardClass = "flex items-center justify-between p-3 bg-zinc-950/50 rounded-xl border border-zinc-850 text-zinc-400 font-medium";
  let presetCardNormalClass = "text-left p-4 rounded-xl transition-all cursor-pointer border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-zinc-950/40 border-zinc-800/80 hover:bg-zinc-850/50 text-zinc-300";
  let presetCardActiveClass = "text-left p-4 rounded-xl transition-all cursor-pointer border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-zinc-850/90 border-sky-500 shadow-md shadow-sky-950/10 text-white";
  let colorPillClass = "flex items-center gap-1.5 bg-zinc-950 p-1.5 rounded-lg border border-zinc-800 text-zinc-400";
  let dividerClass = "border-t border-zinc-850 pt-2";
  let checkboxClass = "w-4 h-4 rounded cursor-pointer accent-sky-500";

  if (isBento) {
    cardClass = "bg-slate-900/45 border border-slate-800 backdrop-blur-xl rounded-2xl p-5 flex flex-col gap-4 shadow-sm shadow-black/20";
    titleClass = "font-sans uppercase tracking-wider text-xs font-extrabold text-cyan-400";
    textClass = "text-xs text-slate-400";
    labelClass = "block text-xs uppercase tracking-wide text-slate-300 font-bold mb-1.5";
    inputClass = "w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500/50 placeholder-slate-600 transition-colors";
    textareaClass = "w-full text-xs font-mono p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500/50 transition-colors";
    borderClass = "border-b border-slate-800/80 pb-3";
    innerCardClass = "flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 text-slate-250 text-xs";
    presetCardNormalClass = "text-left p-3 rounded-xl transition-all cursor-pointer border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/40 border-slate-800/50 hover:bg-slate-900/60 text-slate-400 hover:text-slate-100";
    presetCardActiveClass = "text-left p-3 rounded-xl transition-all cursor-pointer border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border-2 border-cyan-500/80 shadow shadow-cyan-500/10 text-white";
    colorPillClass = "flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-800 text-slate-300";
    dividerClass = "border-t border-slate-800/80 pt-2";
    checkboxClass = "w-4 h-4 rounded cursor-pointer accent-cyan-500";
  } else if (isFocus) {
    cardClass = "bg-white border border-zinc-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm";
    titleClass = "font-serif italic font-extrabold text-zinc-900 text-sm";
    textClass = "text-xs text-zinc-650";
    labelClass = "block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-1.5";
    inputClass = "w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-250 rounded text-zinc-900 focus:outline-none focus:border-zinc-900 placeholder-zinc-400 font-sans";
    textareaClass = "w-full text-xs font-mono p-3 bg-zinc-50 border border-zinc-250 rounded text-zinc-900 focus:outline-none focus:border-zinc-900";
    borderClass = "border-b border-zinc-150 pb-3";
    innerCardClass = "flex items-center justify-between p-3 bg-zinc-50 rounded border border-zinc-200 text-zinc-700 text-xs";
    presetCardNormalClass = "text-left p-4 rounded border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border-zinc-250 hover:bg-zinc-50 transition-colors text-zinc-700";
    presetCardActiveClass = "text-left p-4 rounded border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-zinc-50 border-zinc-900 shadow-sm text-zinc-900";
    colorPillClass = "flex items-center gap-1.5 bg-zinc-50 p-1.5 rounded border border-zinc-250 text-zinc-805";
    dividerClass = "border-t border-zinc-150 pt-2";
    checkboxClass = "w-4 h-4 rounded cursor-pointer accent-zinc-900";
  } else if (isHacker) {
    cardClass = "bg-[#050505] border border-emerald-900/60 rounded-none p-5 flex flex-col gap-5 font-mono shadow-[0_0_15px_rgba(16,185,129,0.05)] relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] before:bg-[size:24px_24px] before:pointer-events-none";
    titleClass = "font-extrabold text-emerald-400 text-[13px] uppercase tracking-[0.2em] flex items-center gap-2 before:content-['>'] animate-typewriter";
    textClass = "text-[11px] text-emerald-600/80 uppercase tracking-widest";
    labelClass = "block text-[10px] uppercase tracking-[0.2em] text-emerald-500/90 font-bold mb-2 flex items-center gap-2 before:content-['//']";
    inputClass = "w-full px-4 py-2.5 text-xs bg-[#0a0a0a] border border-emerald-900/60 text-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 placeholder-emerald-900/40 font-mono rounded-none transition-all";
    textareaClass = "w-full text-xs font-mono p-4 bg-[#0a0a0a] border border-emerald-900/60 text-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 rounded-none transition-all resize-y";
    borderClass = "border-b border-emerald-900/50 pb-4";
    innerCardClass = "flex items-center justify-between p-3.5 bg-[#0a0a0a] border border-emerald-900/40 text-emerald-500 text-[11px] rounded-none hover:border-emerald-800/80 transition-colors uppercase tracking-wider";
    presetCardNormalClass = "text-left p-4 rounded-none transition-all cursor-pointer border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#0a0a0a] border-emerald-900/40 hover:border-emerald-700/80 hover:bg-emerald-950/20 text-emerald-600 hover:text-emerald-400";
    presetCardActiveClass = "text-left p-4 rounded-none transition-all cursor-pointer border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-emerald-950/20 border-emerald-500 shadow-[inset_0_0_15px_rgba(16,185,129,0.1)] text-emerald-300 relative before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-emerald-500";
    colorPillClass = "flex items-center gap-2 bg-[#0a0a0a] p-2 border border-emerald-900/40 text-emerald-500 rounded-none uppercase text-[10px] tracking-widest";
    dividerClass = "border-t border-emerald-900/40 pt-4 relative before:content-[''] before:absolute before:-top-px before:left-0 before:w-12 before:h-px before:bg-emerald-500/50";
    checkboxClass = "w-4 h-4 rounded-none cursor-pointer accent-emerald-500 bg-[#0a0a0a] border-emerald-900";
  }

  return (
    <div className="flex flex-col gap-6" id="editor-control-panels">
      
      {/* 1. ARCHITECTURAL PRESETS */}
      <div className={cardClass}>
        <div className={`flex items-center gap-2 ${borderClass}`}>
          <Palette className="w-5 h-5 text-emerald-400" />
          <h4 className={titleClass}>1. Core Layout Presets</h4>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {THEMES.map((theme) => {
            const isSelected = config.layout === theme.id;
            return (
              <button
                key={theme.id}
                id={`preset-selector-${theme.id}`}
                type="button"
                onClick={() => {
                  onChange({ layout: theme.id });
                  handleApplyPalette(theme.palette);
                }}
                className={isSelected ? presetCardActiveClass : presetCardNormalClass}
              >
                <div>
                  <h5 className="font-bold text-sm">{theme.label}</h5>
                  <p className="text-xs opacity-70 mt-1">{theme.desc}</p>
                </div>
                {/* Visual Palette Representation */}
                <div className={colorPillClass}>
                  {theme.palette.map((color, colorIdx) => (
                    <span
                      key={`${theme.id}-preset-color-${colorIdx}`}
                      className="w-3.5 h-3.5 rounded-full border border-black/30"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. DYNAMIC BRANDING ELEMENTS */}
      <div className={cardClass}>
        <div className={`flex items-center gap-2 ${borderClass}`}>
          <Sparkles className="w-5 h-5 text-sky-400" />
          <h4 className={titleClass}>2. Typography & Details</h4>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className={labelClass}>Repository Title</label>
            <input
              id="input-title-tagger"
              type="text"
              value={config.title}
              onChange={(e) => onChange({ title: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Punchy Tagline</label>
            <input
              id="input-tagline-tagger"
              type="text"
              value={config.tagline}
              onChange={(e) => onChange({ tagline: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Logo Initials</label>
              <input
                id="input-logo-tagger"
                type="text"
                value={config.customLogoText}
                onChange={(e) => onChange({ customLogoText: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Custom Watermark</label>
              <input
                id="input-watermark-tagger"
                type="text"
                value={config.customWatermark}
                onChange={(e) => onChange({ customWatermark: e.target.value })}
                className={inputClass}
                placeholder="via @jehadurre"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Owner Avatar URL</label>
            <input
              id="input-avatar-url-tagger"
              type="text"
              value={config.ownerAvatarUrl}
              onChange={(e) => onChange({ ownerAvatarUrl: e.target.value })}
              className={inputClass}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* 3. AESTHETIC MANIPULATIONS */}
      <div className={cardClass}>
        <div className={`flex items-center gap-2 ${borderClass}`}>
          <Sliders className="w-5 h-5 text-pink-400" />
          <h4 className={titleClass}>3. Color Tweak & Effects</h4>
        </div>

        {/* Manual hex entries */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div>
            <label className="block text-[10px] opacity-75 font-semibold mb-1">Primary</label>
            <div className={colorPillClass}>
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => onChange({ primaryColor: e.target.value })}
                className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent text-xs"
              />
              <span className="text-[10px] font-mono opacity-80">{config.primaryColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-[10px] opacity-75 font-semibold mb-1">Secondary</label>
            <div className={colorPillClass}>
              <input
                type="color"
                value={config.secondaryColor}
                onChange={(e) => onChange({ secondaryColor: e.target.value })}
                className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent text-xs"
              />
              <span className="text-[10px] font-mono opacity-80">{config.secondaryColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-[10px] opacity-75 font-semibold mb-1">Accent</label>
            <div className={colorPillClass}>
              <input
                type="color"
                value={config.accentColor}
                onChange={(e) => onChange({ accentColor: e.target.value })}
                className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent text-xs"
              />
              <span className="text-[10px] font-mono opacity-80">{config.accentColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-[10px] opacity-75 font-semibold mb-1">Background</label>
            <div className={colorPillClass}>
              <input
                type="color"
                value={config.backgroundColor}
                onChange={(e) => onChange({ backgroundColor: e.target.value })}
                className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent text-xs"
              />
              <span className="text-[10px] font-mono opacity-80">{config.backgroundColor}</span>
            </div>
          </div>
        </div>

        {/* Sliders and Toggles */}
        <div className="space-y-4 pt-2">
          {/* Borders */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs">
              <span className="opacity-70 font-medium">Border Width</span>
              <span className="font-mono text-sky-400">{config.borderWidth}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="16"
              value={config.borderWidth}
              onChange={(e) => onChange({ borderWidth: parseInt(e.target.value) })}
              className="w-full accent-purple-500 cursor-pointer h-1.5 bg-black/45 rounded-lg appearance-none"
            />
          </div>

          {/* Glow effect toggle */}
          <div className={`flex items-center justify-between py-1 ${dividerClass}`}>
            <div>
              <span className="block text-xs font-semibold">Neon Glow Effect</span>
              <span className="block text-[10px] opacity-65">Inject radial glowing backdrop vector lights</span>
            </div>
            <input
              type="checkbox"
              checked={config.glowEffect}
              onChange={(e) => onChange({ glowEffect: e.target.checked })}
              className={checkboxClass}
            />
          </div>

          {/* Watermark toggle */}
          <div className={`flex items-center justify-between py-1 ${dividerClass}`}>
            <div>
              <span className="block text-xs font-semibold">Attribution Badge</span>
              <span className="block text-[10px] opacity-65">Display creator credit Md. Jehad (@jehadurre)</span>
            </div>
            <input
              type="checkbox"
              checked={config.showWatermark}
              onChange={(e) => onChange({ showWatermark: e.target.checked })}
              className={checkboxClass}
            />
          </div>

          {/* QR Code toggle */}
          <div className="flex flex-col gap-3">
            <div className={`flex items-center justify-between py-1 ${dividerClass}`}>
              <div>
                <span className="block text-xs font-semibold">Overlay QR Code</span>
                <span className="block text-[10px] opacity-65">Render a scannable QR link to the repository</span>
              </div>
              <input
                type="checkbox"
                checked={!!config.showQRCode}
                onChange={(e) => onChange({ showQRCode: e.target.checked })}
                className={checkboxClass}
              />
            </div>

            {config.showQRCode && (
              <div className="flex flex-col gap-4 pl-4 border-l-2 border-zinc-800/50 mt-1 mb-2">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass.replace('mb-1.5', 'mb-0')}>
                    QR Matrix Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.qrCodeColor || '#09090b'}
                      onChange={(e) => onChange({ qrCodeColor: e.target.value })}
                      className="w-10 h-10 rounded cursor-pointer p-0 border-0 bg-transparent flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={config.qrCodeColor || '#09090b'}
                      onChange={(e) => onChange({ qrCodeColor: e.target.value })}
                      className={inputClass}
                      placeholder="#09090b"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className={`${labelClass.replace('mb-1.5', 'mb-0')} flex items-center justify-between`}>
                    <span>QR Code Size</span>
                    <span>{config.qrCodeSize || 80}px</span>
                  </label>
                  <input
                    type="range"
                    min="40"
                    max="140"
                    step="2"
                    value={config.qrCodeSize || 80}
                    onChange={(e) => onChange({ qrCodeSize: Number(e.target.value) })}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. VISUAL STATISTICS SHOW/HIDE FIELDS */}
      <div className={cardClass}>
        <div className={`flex items-center gap-2 ${borderClass}`}>
          <Eye className="w-5 h-5 text-indigo-400" />
          <h4 className={titleClass}>4. Stats & Badges Displays</h4>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <div className={innerCardClass}>
            <span className="font-medium">Show Star Count</span>
            <input
              type="checkbox"
              checked={config.showStars}
              onChange={(e) => onChange({ showStars: e.target.checked })}
              className={checkboxClass}
            />
          </div>
          <div className={innerCardClass}>
            <span className="font-medium">Show Fork Count</span>
            <input
              type="checkbox"
              checked={config.showForks}
              onChange={(e) => onChange({ showForks: e.target.checked })}
              className={checkboxClass}
            />
          </div>
          <div className={innerCardClass}>
            <span className="font-medium">Show Issue Count</span>
            <input
              type="checkbox"
              checked={config.showIssues}
              onChange={(e) => onChange({ showIssues: e.target.checked })}
              className={checkboxClass}
            />
          </div>
          <div className={innerCardClass}>
            <span className="font-medium">Language Tag</span>
            <input
              type="checkbox"
              checked={config.showLanguage}
              onChange={(e) => onChange({ showLanguage: e.target.checked })}
              className={checkboxClass}
            />
          </div>
        </div>
      </div>

      {/* 5. CODE SNIPPET (CYBERPUNK / TERMINAL ONLY) */}
      {(config.layout === 'cyberpunk' || config.layout === 'terminal') && (
        <div className={cardClass}>
          <div className={`flex items-center gap-2 ${borderClass}`}>
            <Code className="w-5 h-5 text-amber-400" />
            <h4 className={titleClass}>5. Embedded Code Block</h4>
          </div>

          <div>
            <span className="block text-xs font-semibold opacity-70 mb-2">Configure Code Overlay LINES:</span>
            <textarea
              rows={4}
              value={config.customCodeSnippet}
              onChange={(e) => onChange({ customCodeSnippet: e.target.value })}
              className={textareaClass}
              placeholder="e.g. import { Module } from 'system';"
            />
          </div>
        </div>
      )}

      {/* 6. CUSTOM BACKGROUND OVERRIDE */}
      <div className={cardClass}>
        <div className={`flex items-center gap-2 ${borderClass}`}>
          <ImageIcon className="w-5 h-5 text-rose-400" />
          <h4 className={titleClass}>Custom OG Asset Upload</h4>
        </div>
        
        <div>
          <span className="block text-[10px] font-semibold opacity-70 mb-2 uppercase tracking-wide">Override Global Background / Avatar</span>
          <label className={`w-full flex-col flex items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer ${
            config.customBackgroundImageUrl 
              ? 'border-emerald-500/50 bg-emerald-500/5' 
              : 'border-zinc-500/30 hover:border-zinc-500/60 transition-colors'
          }`}>
            <UploadCloud className={`w-8 h-8 mb-2 ${config.customBackgroundImageUrl ? 'text-emerald-400' : 'text-zinc-500'}`} />
            <span className="text-xs font-semibold text-center opacity-80">
              {config.customBackgroundImageUrl ? 'Change Associated Image' : 'Click to Upload Asset'}
            </span>
            <span className="text-[10px] opacity-60 text-center mt-1">PNG, JPG, WEBP (Max 5MB)</span>
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/webp" 
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Validation
                  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                    alert('Invalid file format. Please upload a JPEG, PNG, or WEBP image.');
                    return;
                  }
                  if (file.size > 5 * 1024 * 1024) {
                    alert('File is too large. Maximum size is 5MB.');
                    return;
                  }
                  
                  onChange({ customBackgroundImageUrl: URL.createObjectURL(file) });
                }
              }} 
            />
          </label>
          
          {config.customBackgroundImageUrl ? (
            <div className="mt-4 flex flex-col gap-3">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-800/80 shadow bg-black/40">
                <img 
                  src={config.customBackgroundImageUrl} 
                  alt="Custom uploaded background" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => onChange({ customBackgroundImageUrl: undefined })}
                className="w-full py-1.5 px-3 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors font-semibold"
              >
                Remove Custom Override
              </button>
            </div>
          ) : activeRepo && (
            <div className="mt-4 flex flex-col gap-2">
              <span className="block text-[10px] font-semibold opacity-60 uppercase tracking-wide">Current GitHub OG Image</span>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-800/80 shadow bg-black/40">
                <img 
                  src={`https://opengraph.githubassets.com/1/${activeRepo.owner}/${activeRepo.name}`}
                  alt="Current GitHub OG" 
                  className="w-full h-full object-cover opacity-60"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 7. ADVANCED LAYOUT TUNING */}
      <div className={cardClass}>
        <div className={`flex items-center gap-2 ${borderClass}`}>
          <Move className="w-5 h-5 text-orange-400" />
          <h4 className={titleClass}>Advanced Fine Tuning (<span className="font-mono text-orange-400/80">X/Y</span>)</h4>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2">
            <p className="text-xs text-zinc-500 italic">Adjust position coordinates slightly to fix overlap edges</p>
            
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={config.showGuides || false}
                onChange={(e) => onChange({ showGuides: e.target.checked })}
                className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-orange-500 focus:ring-orange-500/30 focus:ring-offset-0"
              />
              <span className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">Show Rulers & Guides</span>
            </label>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Title / Tagline Block */}
            <div className="flex flex-col gap-2 p-3 bg-black/20 rounded-xl border border-zinc-500/20">
              <span className="text-[10px] font-semibold opacity-70 uppercase">Main Title Block</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-mono w-4">X</span>
                <input 
                  type="range" min="-400" max="400" step="1"
                  value={config.titleOffset?.x || 0}
                  onChange={(e) => onChange({ titleOffset: { ...config.titleOffset, x: Number(e.target.value) } as any })}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <span className="text-xs text-zinc-400 font-mono w-8 text-right">{config.titleOffset?.x || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-mono w-4">Y</span>
                <input 
                  type="range" min="-400" max="400" step="1"
                  value={config.titleOffset?.y || 0}
                  onChange={(e) => onChange({ titleOffset: { ...config.titleOffset, y: Number(e.target.value) } as any })}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <span className="text-xs text-zinc-400 font-mono w-8 text-right">{config.titleOffset?.y || 0}</span>
              </div>
            </div>

            {/* Logo / Header Block */}
            <div className="flex flex-col gap-2 p-3 bg-black/20 rounded-xl border border-zinc-500/20">
              <span className="text-[10px] font-semibold opacity-70 uppercase">Logo / Header</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-mono w-4">X</span>
                <input 
                  type="range" min="-400" max="400" step="1"
                  value={config.logoOffset?.x || 0}
                  onChange={(e) => onChange({ logoOffset: { ...config.logoOffset, x: Number(e.target.value) } as any })}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <span className="text-xs text-zinc-400 font-mono w-8 text-right">{config.logoOffset?.x || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-mono w-4">Y</span>
                <input 
                  type="range" min="-400" max="400" step="1"
                  value={config.logoOffset?.y || 0}
                  onChange={(e) => onChange({ logoOffset: { ...config.logoOffset, y: Number(e.target.value) } as any })}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <span className="text-xs text-zinc-400 font-mono w-8 text-right">{config.logoOffset?.y || 0}</span>
              </div>
            </div>

            {/* Code / Bullets Block */}
            <div className="flex flex-col gap-2 p-3 bg-black/20 rounded-xl border border-zinc-500/20">
              <span className="text-[10px] font-semibold opacity-70 uppercase">Right Side Elements</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-mono w-4">X</span>
                <input 
                  type="range" min="-400" max="400" step="1"
                  value={config.codeSnippetOffset?.x || 0}
                  onChange={(e) => onChange({ codeSnippetOffset: { ...config.codeSnippetOffset, x: Number(e.target.value) } as any })}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <span className="text-xs text-zinc-400 font-mono w-8 text-right">{config.codeSnippetOffset?.x || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-mono w-4">Y</span>
                <input 
                  type="range" min="-400" max="400" step="1"
                  value={config.codeSnippetOffset?.y || 0}
                  onChange={(e) => onChange({ codeSnippetOffset: { ...config.codeSnippetOffset, y: Number(e.target.value) } as any })}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <span className="text-xs text-zinc-400 font-mono w-8 text-right">{config.codeSnippetOffset?.y || 0}</span>
              </div>
            </div>

            {/* Stats Block */}
            <div className="flex flex-col gap-2 p-3 bg-black/20 rounded-xl border border-zinc-500/20">
              <span className="text-[10px] font-semibold opacity-70 uppercase">Footer / Stats</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-mono w-4">X</span>
                <input 
                  type="range" min="-400" max="400" step="1"
                  value={config.statsOffset?.x || 0}
                  onChange={(e) => onChange({ statsOffset: { ...config.statsOffset, x: Number(e.target.value) } as any })}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <span className="text-xs text-zinc-400 font-mono w-8 text-right">{config.statsOffset?.x || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-mono w-4">Y</span>
                <input 
                  type="range" min="-400" max="400" step="1"
                  value={config.statsOffset?.y || 0}
                  onChange={(e) => onChange({ statsOffset: { ...config.statsOffset, y: Number(e.target.value) } as any })}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <span className="text-xs text-zinc-400 font-mono w-8 text-right">{config.statsOffset?.y || 0}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <button 
              className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded transition-colors"
              onClick={() => onChange({ 
                titleOffset: {x:0, y:0}, 
                logoOffset: {x:0, y:0}, 
                codeSnippetOffset: {x:0, y:0}, 
                statsOffset: {x:0, y:0} 
              } as any)}
            >
              Reset All Offsets
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
