import React from 'react';
import { X, Layers } from 'lucide-react';
import CanvasPreview from './CanvasPreview';
import { TemplateConfig, LayoutTheme, Repository } from '../types';

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: TemplateConfig;
  activeRepo: Repository;
  onSelectTemplate: (updates: Partial<TemplateConfig>) => void;
  themes: { id: LayoutTheme; label: string; emoji: string; palette: [string, string, string, string] }[];
}

export default function TemplateGalleryModal({
  isOpen,
  onClose,
  config,
  activeRepo,
  onSelectTemplate,
  themes,
}: TemplateGalleryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-6xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/10 rounded-xl text-sky-450 border border-sky-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-100 font-sans tracking-tight">Template Gallery</h2>
              <p className="text-sm text-zinc-400">Select a pre-configured design for your OpenGraph layout</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 md:p-8 overflow-y-auto scrollbar-thin">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {themes.map((theme) => {
              const PreviewConfig = {
                ...config,
                layout: theme.id,
                primaryColor: theme.palette[0],
                secondaryColor: theme.palette[1],
                accentColor: theme.palette[2],
                backgroundColor: theme.palette[3],
              };

              const PreviewStats = {
                stars: activeRepo.stars,
                forks: activeRepo.forks,
                openIssues: activeRepo.openIssues,
                primaryLanguage: activeRepo.primaryLanguage,
                languageColor: activeRepo.languageColor || '#3178c6',
                repoName: activeRepo.name,
                repoOwner: activeRepo.owner,
              };

              const isActive = config.layout === theme.id;

              return (
                <div 
                  key={theme.id}
                  className={`group flex flex-col gap-4 p-4 rounded-2xl transition-all cursor-pointer border ${
                    isActive 
                      ? 'bg-zinc-900 border-sky-500 shadow-xl shadow-sky-900/20' 
                      : 'bg-zinc-900/30 border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700'
                  }`}
                  onClick={() => {
                    onSelectTemplate({
                      layout: theme.id,
                      primaryColor: theme.palette[0],
                      secondaryColor: theme.palette[1],
                      accentColor: theme.palette[2],
                      backgroundColor: theme.palette[3],
                    });
                    onClose();
                  }}
                >
                  <div className="flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{theme.emoji}</span>
                      <h3 className="font-semibold text-zinc-100">{theme.label}</h3>
                    </div>
                    {isActive && (
                      <span className="text-[10px] font-bold tracking-wider uppercase text-sky-400 bg-sky-500/10 px-2 py-1 rounded-full border border-sky-500/20">
                        Active
                      </span>
                    )}
                  </div>
                  
                  {/* Miniature SVG Preview */}
                  <div className="rounded-xl overflow-hidden shadow-inner border border-white/5 pointer-events-none group-hover:scale-[1.02] transition-transform duration-300">
                    <CanvasPreview 
                      mode="thumbnail"
                      config={PreviewConfig}
                      stats={PreviewStats}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
      </div>
    </div>
  );
}
