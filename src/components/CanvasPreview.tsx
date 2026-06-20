/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { TemplateConfig } from '../types';
import { Download, Copy, Check, FileCode, BadgeHelp, ZoomIn, ZoomOut, Move } from 'lucide-react';

interface CanvasPreviewProps {
  config: TemplateConfig;
  onChange?: (config: Partial<TemplateConfig>) => void;
  stats: {
    stars: number;
    forks: number;
    openIssues: number;
    primaryLanguage: string;
    languageColor: string;
    repoName?: string;
    repoOwner?: string;
  };
  mode?: 'edit' | 'thumbnail';
  appLayout?: string;
}

export default function CanvasPreview({ config, onChange, stats, mode = 'edit', appLayout }: CanvasPreviewProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState<'1200x630' | '1600x900' | '1080x1080'>('1200x630');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeDragLayer, setActiveDragLayer] = useState<'title' | 'logo' | 'codeSnippet' | 'stats' | null>(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [startOffsets, setStartOffsets] = useState({ x: 0, y: 0 });

  const handleMouseDown = (layer: 'title' | 'logo' | 'codeSnippet' | 'stats', e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDragLayer(layer);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    
    const currentOffset = config[`${layer}Offset`] || { x: 0, y: 0 };
    setStartOffsets({ x: currentOffset.x, y: currentOffset.y });
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  const handleZoomReset = () => setZoomLevel(1);

  // If thumbnail mode, force 1200x630
  const width = mode === 'thumbnail' ? 1200 : selectedRatio === '1600x900' ? 1600 : selectedRatio === '1080x1080' ? 1080 : 1200;
  const height = mode === 'thumbnail' ? 630 : selectedRatio === '1600x900' ? 900 : selectedRatio === '1080x1080' ? 1080 : 630;
  const cx = width / 2;
  const cy = height / 2;

  useEffect(() => {
    if (!activeDragLayer || mode !== 'edit') return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!svgRef.current) return;
      
      const svgRect = svgRef.current.getBoundingClientRect();
      const scaleX = width / svgRect.width;
      const scaleY = height / svgRect.height;
      const internalScale = Math.min(width/1200, height/630);

      const dx = (e.clientX - dragStartPos.x) * scaleX / internalScale;
      const dy = (e.clientY - dragStartPos.y) * scaleY / internalScale;

      let rawX = startOffsets.x + dx;
      let rawY = startOffsets.y + dy;

      // Snap to 10px grid
      let newX = Math.round(rawX / 10) * 10;
      let newY = Math.round(rawY / 10) * 10;

      // Snap to 0 (default alignment/center-line) with a stronger gravity
      if (Math.abs(rawX) < 25) newX = 0;
      if (Math.abs(rawY) < 25) newY = 0;

      // Allow holding Shift to bypass snapping for pixel-perfect adjustments
      if (e.shiftKey) {
        newX = Math.round(rawX);
        newY = Math.round(rawY);
      }

      if (onChange) {
        onChange({
          [`${activeDragLayer}Offset`]: {
             x: newX,
             y: newY
          }
        });
      }
    };

    const handleMouseUp = () => {
      setActiveDragLayer(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeDragLayer, dragStartPos, startOffsets, config, onChange, mode, width, height]);

  // Keyboard shortcut listener for Cmd+E
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+E or Ctrl+E (only in edit mode)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault(); // Prevent default browser behavior
        if (mode === 'edit') {
          // Find the download button to trigger the export, or call handleDownloadPNG directly
          // Since handleDownloadPNG uses state variables inside the closure, we can trigger the button click
          const btn = document.getElementById('btn-download-png');
          if (btn) btn.click();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  const renderDragHandle = (layerName: 'title' | 'logo' | 'codeSnippet' | 'stats', xOffset: number, yOffset: number) => {
    if (mode !== 'edit') return null;
    return (
      <g 
        className="opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
        transform={`translate(${xOffset}, ${yOffset})`}
        onMouseDown={(e) => {
          e.stopPropagation();
          handleMouseDown(layerName, e);
        }}
      >
        <rect width="28" height="28" rx="6" fill="#f97316" className="drop-shadow-md" />
        <Move x="4" y="4" width="20" height="20" color="white" />
      </g>
    );
  };

  const {
    layout,
    title,
    tagline,
    ownerName,
    ownerAvatarUrl,
    primaryColor,
    secondaryColor,
    accentColor,
    backgroundColor,
    showStars,
    showForks,
    showIssues,
    showLanguage,
    customLogoText,
    customWatermark,
    showWatermark,
    customCodeSnippet,
    glowEffect,
    borderWidth,
  } = config;

  const [base64Avatar, setBase64Avatar] = useState<string>('');
  const [base64Bg, setBase64Bg] = useState<string>('');

  useEffect(() => {
    if (!ownerAvatarUrl) {
      setBase64Avatar('');
      return;
    }
    const fetchAvatar = async () => {
      try {
        const response = await fetch(ownerAvatarUrl);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => setBase64Avatar(reader.result as string);
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error('Failed to convert avatar', err);
        setBase64Avatar(ownerAvatarUrl);
      }
    };
    fetchAvatar();
  }, [ownerAvatarUrl]);

  useEffect(() => {
    if (!config.customBackgroundImageUrl) {
      setBase64Bg('');
      return;
    }
    const fetchBg = async () => {
      try {
        const response = await fetch(config.customBackgroundImageUrl!);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => setBase64Bg(reader.result as string);
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error('Failed to convert bg', err);
        setBase64Bg(config.customBackgroundImageUrl!);
      }
    };
    fetchBg();
  }, [config.customBackgroundImageUrl]);

  // Handles copying the direct SVG string
  const handleCopySvg = () => {
    if (!svgRef.current) return;
    try {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgRef.current);
      navigator.clipboard.writeText(svgString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy SVG string', err);
    }
  };

  // Triggers seamless client-side PNG download via Canvas
  const handleDownloadPNG = () => {
    if (!svgRef.current) return;
    setDownloading(true);

    try {
      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(svgRef.current);
      
      // Create a Blob from the SVG string
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const blobURL = window.URL.createObjectURL(svgBlob);
      
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        if (context) {
          context.fillStyle = 'rgba(0,0,0,0)';
          context.fillRect(0, 0, width, height);
          context.drawImage(image, 0, 0, width, height);
          
          const pngData = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.href = pngData;
          downloadLink.download = `${title.toLowerCase()}-og-image.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
        window.URL.revokeObjectURL(blobURL);
        setDownloading(false);
      };
      image.src = blobURL;
    } catch (error) {
      console.error('Error generating PNG download:', error);
      setDownloading(false);
    }
  };

  // Triggers direct SVG file download
  const handleDownloadSVG = () => {
    if (!svgRef.current) return;
    try {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgRef.current);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(svgBlob);
      downloadLink.download = `${title.toLowerCase()}-og-image.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('Error downloading SVG:', error);
    }
  };

  const svgContent = (
          <svg
          id="github-og-canvas"
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Svg Definitions for gradients and shadows */}
          <defs>
            {/* Soft backdrop glow effect for Cosmic and Elegant themes */}
            <radialGradient id="backgroundGlow" cx="50%" cy="50%" r="75%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity={glowEffect ? "0.22" : "0"} />
              <stop offset="60%" stopColor={secondaryColor} stopOpacity={glowEffect ? "0.08" : "0"} />
              <stop offset="100%" stopColor={backgroundColor} stopOpacity="1" />
            </radialGradient>

            <linearGradient id="cyberpunkGrid" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.03" />
              <stop offset="50%" stopColor={secondaryColor} stopOpacity="0.1" />
              <stop offset="100%" stopColor={backgroundColor} stopOpacity="1" />
            </linearGradient>

            <linearGradient id="titleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="50%" stopColor={secondaryColor} />
              <stop offset="100%" stopColor={accentColor} />
            </linearGradient>

            {/* Glowing borders filter */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="15" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* System UI Font Embed for beautiful cross-system consistency */}
            <style>
              {`
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@500;700&family=Playfair+Display:ital,wght@0,600;0,700;1,500&family=Outfit:wght@500;700;900&display=swap');
                
                /* Smooth morphing and fading for SVG property changes */
                #github-og-canvas * {
                  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .font-space { font-family: 'Space Grotesk', system-ui, -apple-system, sans-serif; }
                .font-mono-custom { font-family: 'JetBrains Mono', monospace; }
                .font-serif-custom { font-family: 'Playfair Display', Georgia, serif; }
                .font-outfit { font-family: 'Outfit', -apple-system, sans-serif; }
              `}
            </style>
          </defs>

          {/* BACKGROUND RENDERING */}
          <rect width={width} height={height} fill={backgroundColor} />

          {/* Custom Uploaded Background Override */}
          {config.customBackgroundImageUrl && (
            <image href={base64Bg || config.customBackgroundImageUrl} width={width} height={height} preserveAspectRatio="xMidYMid slice" opacity="1" />
          )}

          {/* Scale and Center Content Layer designed for 1200x630 */}
          <g transform={`translate(${(width - 1200 * Math.min(width/1200, height/630)) / 2}, ${(height - 630 * Math.min(width/1200, height/630)) / 2}) scale(${Math.min(width/1200, height/630)})`}>
          
          {/* Theme-specific background patterns */}
          {layout === 'cosmic' && (
            <>
              {/* Star fields and orbital trajectory */}
              <circle cx="600" cy="315" r="750" fill="url(#backgroundGlow)" />
              <circle cx="200" cy="150" r="1.5" fill="#ffffff" opacity="0.4" />
              <circle cx="950" cy="180" r="2" fill="#ffffff" opacity="0.65" />
              <circle cx="1100" cy="450" r="1" fill="#ffffff" opacity="0.3" />
              <circle cx="150" cy="480" r="2.5" fill="#ffffff" opacity="0.5" />
              <circle cx="750" cy="80" r="1.5" fill="#ffffff" opacity="0.45" />
              
              {/* Planetary abstract trajectory lines */}
              <path d="M -100,500 Q 400,200 1300,550" fill="none" stroke={primaryColor} strokeWidth="0.75" opacity="0.12" />
              <path d="M -50,550 Q 550,100 1250,450" fill="none" stroke={secondaryColor} strokeWidth="1.2" strokeDasharray="6,4" opacity="0.15" />
            </>
          )}

          {layout === 'cyberpunk' && (
            <>
              <circle cx="600" cy="315" r="500" fill="url(#backgroundGlow)" />
              {/* Vertical Tech grid lines */}
              <g stroke={secondaryColor} strokeWidth="0.5" opacity="0.08">
                <line x1="100" y1="0" x2="100" y2="630" />
                <line x1="200" y1="0" x2="200" y2="630" />
                <line x1="300" y1="0" x2="300" y2="630" />
                <line x1="400" y1="0" x2="400" y2="630" />
                <line x1="500" y1="0" x2="500" y2="630" />
                <line x1="600" y1="0" x2="600" y2="630" />
                <line x1="700" y1="0" x2="700" y2="630" />
                <line x1="800" y1="0" x2="800" y2="630" />
                <line x1="900" y1="0" x2="900" y2="630" />
                <line x1="1000" y1="0" x2="1000" y2="630" />
                <line x1="1100" y1="0" x2="1100" y2="630" />
                {/* Horizontal lines */}
                <line x1="0" y1="100" x2="1200" y2="100" />
                <line x1="0" y1="200" x2="1200" y2="200" />
                <line x1="0" y1="300" x2="1200" y2="300" />
                <line x1="0" y1="400" x2="1200" y2="400" />
                <line x1="0" y1="500" x2="1200" y2="500" />
                <line x1="0" y1="600" x2="1200" y2="600" />
              </g>
              {/* Dynamic Tech Accent shapes */}
              <polygon points="1200,0 1200,200 1000,0" fill={accentColor} opacity="0.15" />
              <polygon points="0,630 150,630 0,480" fill={primaryColor} opacity="0.1" />
            </>
          )}

          {layout === 'elegant' && (
            <>
              {/* Soft, beautiful, flowing blurred circles in corners */}
              <circle cx="1050" cy="120" r="320" fill={primaryColor} opacity="0.12" filter="url(#softGlow)" />
              <circle cx="120" cy="510" r="280" fill={secondaryColor} opacity="0.1" filter="url(#softGlow)" />
              <circle cx="600" cy="315" r="450" fill="url(#backgroundGlow)" />
            </>
          )}

          {layout === 'terminal' && (
            <>
              {/* Subtle background matrix-like console accents */}
              <g opacity="0.03" fill={primaryColor} className="font-mono-custom" fontSize="11">
                <text x="50" y="80">SYSTEM_CORE_INIT: OK</text>
                <text x="50" y="105">EDGE_LATENCY: 1.25MS</text>
                <text x="50" y="130">DECENTRALIZED: TRUE</text>
                <text x="50" y="155">SATORI_VIRTUAL_DOM: READY</text>
                <text x="50" y="180">LOAD_AVERAGE: 0.12</text>
                <text x="50" y="205">MEM_STABLE: 94.2%</text>
              </g>
              {/* Horizontal scanline effect */}
              <line x1="0" y1="3" x2="1200" y2="3" stroke={primaryColor} strokeWidth="1.5" opacity="0.05" strokeDasharray="3,3" />
            </>
          )}

          {layout === 'minimalist' && (
            <>
              {/* High precision tiny dot grid background */}
              <g fill="#71717a" opacity="0.15">
                {Array.from({ length: 12 }).map((_, colIndex) => 
                  Array.from({ length: 6 }).map((_, rowIndex) => (
                    <circle 
                      key={`dot-${colIndex}-${rowIndex}`} 
                      cx={(colIndex + 1) * 100} 
                      cy={(rowIndex + 1) * 105} 
                      r="1.5" 
                    />
                  ))
                )}
              </g>
            </>
          )}

          {/* DYNAMIC LAYOUT BORDERS */}
          {borderWidth > 0 && (
            <rect
              x={borderWidth}
              y={borderWidth}
              width={1200 - borderWidth * 2}
              height={630 - borderWidth * 2}
              fill="none"
              stroke={(layout === 'cyberpunk' || layout === 'cosmic') && glowEffect ? 'url(#titleGradient)' : primaryColor}
              strokeWidth={borderWidth}
              opacity={layout === 'minimalist' ? 0.35 : 0.8}
              strokeDasharray={layout === 'cyberpunk' ? '30 15 150 15 30 15' : 'none'}
              filter={glowEffect && borderWidth > 1 ? 'url(#softGlow)' : undefined}
            />
          )}

          {/* Cyberpunk corner embellishments */}
          {layout === 'cyberpunk' && (
            <g stroke={primaryColor} strokeWidth="2.5" fill="none">
              {/* Top Left corner bracket */}
              <path d="M 25,65 L 25,25 L 65,25" />
              {/* Top Right corner bracket */}
              <path d="M 1135,25 L 1175,25 L 1175,65" />
              {/* Bottom Left bracket */}
              <path d="M 25,565 L 25,605 L 65,605" />
              {/* Bottom Right bracket */}
              <path d="M 1135,605 L 1175,605 L 1175,565" />
            </g>
          )}

          {/* BRANDING HEADER (Top Bar) */}

          {/* Rulers and Guides Overlay */}
          {config.showGuides && mode === 'edit' && (
            <g className="opacity-50 pointer-events-none text-[8px] font-mono fill-zinc-500">
              {/* Grid 100x100 */}
              <pattern id="grid100" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="none" stroke="#f97316" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="4 4"/>
              </pattern>
              <rect width="1200" height="630" fill="url(#grid100)" />
              
              {/* Grid 20x20 minor */}
              <pattern id="grid20" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f97316" strokeOpacity="0.05" strokeWidth="0.5"/>
              </pattern>
              <rect width="1200" height="630" fill="url(#grid20)" />

              {/* X Rulers */}
              {Array.from({ length: 13 }).map((_, i) => (
                <g key={`x-${i}`} transform={`translate(${i * 100}, 0)`}>
                  <line x1="0" y1="0" x2="0" y2="15" stroke="#f97316" strokeOpacity="0.4" strokeWidth="1" />
                  <line x1="0" y1="615" x2="0" y2="630" stroke="#f97316" strokeOpacity="0.4" strokeWidth="1" />
                  {i > 0 && i < 12 && <text x="3" y="10" stroke="none">{i * 100}</text>}
                </g>
              ))}

              {/* Y Rulers */}
              {Array.from({ length: 7 }).map((_, i) => (
                <g key={`y-${i}`} transform={`translate(0, ${i * 100})`}>
                  <line x1="0" y1="0" x2="15" y2="0" stroke="#f97316" strokeOpacity="0.4" strokeWidth="1" />
                  <line x1="1185" y1="0" x2="1200" y2="0" stroke="#f97316" strokeOpacity="0.4" strokeWidth="1" />
                  {i > 0 && i < 6 && <text x="18" y="3" stroke="none">{i * 100}</text>}
                </g>
              ))}

              {/* Canvas Center Lines (Absolute Center) */}
              <line x1="600" y1="0" x2="600" y2="630" stroke="#f97316" strokeOpacity="0.4" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="0" y1="315" x2="1200" y2="315" stroke="#f97316" strokeOpacity="0.4" strokeDasharray="4 4" strokeWidth="1" />
            </g>
          )}

          {/* Snapping Guidelines */}
          {activeDragLayer && (
            <g stroke="#f97316" strokeWidth="1" strokeDasharray="5 5" opacity="0.6">
              {/* Canvas Center Lines (Absolute Center) */}
              <line x1="600" y1="0" x2="600" y2="630" strokeOpacity="0.3" strokeDasharray="2 4" />
              <line x1="0" y1="315" x2="1200" y2="315" strokeOpacity="0.3" strokeDasharray="2 4" />

              {/* X and Y reference points where the offsets are 0.
                  Since we visually snap offset to 0, these crosshairs help orient that it's aligned. */}
              {activeDragLayer === 'logo' && (
                <>
                  <line x1="80" y1="0" x2="80" y2="630" />
                  <line x1="0" y1="85" x2="1200" y2="85" />
                </>
              )}
              {activeDragLayer === 'title' && (
                <>
                  <line x1="80" y1="0" x2="80" y2="630" />
                  <line x1="0" y1="180" x2="1200" y2="180" />
                </>
              )}
              {activeDragLayer === 'codeSnippet' && (
                <>
                  <line x1={700 + (config.titleOffset?.x || 0)} y1="0" x2={700 + (config.titleOffset?.x || 0)} y2="630" />
                  <line x1="0" y1={130 + (config.titleOffset?.y || 0)} x2="1200" y2={130 + (config.titleOffset?.y || 0)} />
                </>
              )}
              {activeDragLayer === 'stats' && (
                <>
                  <line x1="80" y1="0" x2="80" y2="630" />
                  <line x1="0" y1="520" x2="1200" y2="520" />
                </>
              )}
            </g>
          )}

          <g 
            transform={`translate(${80 + (config.logoOffset?.x || 0)}, ${85 + (config.logoOffset?.y || 0)})`}
            onMouseDown={(e) => mode === 'edit' && handleMouseDown('logo', e)}
            className={`group ${mode === 'edit' ? 'cursor-move' : ''}`}
          >
            {renderDragHandle('logo', -40, -45)}
            {/* Owner Avatar / Github Node */}
            {ownerAvatarUrl && (
              <g transform="translate(0, -35)">
                <defs>
                  <clipPath id="avatarClip">
                    <circle cx="25" cy="25" r="25" />
                  </clipPath>
                </defs>
                {/* Glow behind avatar */}
                <circle cx="25" cy="25" r="29" fill={primaryColor} opacity={glowEffect ? "0.45" : "0.1"} filter="url(#softGlow)" />
                <image
                  href={base64Avatar || ownerAvatarUrl}
                  x="0"
                  y="0"
                  width="50"
                  height="50"
                  clipPath="url(#avatarClip)"
                  preserveAspectRatio="xMidYMid slice"
                  referrerPolicy="no-referrer"
                />
              </g>
            )}

            {/* Owner Logo/Text */}
            <text
              x={ownerAvatarUrl ? 70 : 0}
              y="-10"
              dominantBaseline="central"
              fill={layout === 'minimalist' ? '#18181b' : '#ffffff'}
              fontSize="24"
              fontWeight="bold"
              className={layout === 'minimalist' ? 'font-space' : 'font-outfit'}
              letterSpacing="2"
            >
              {customLogoText.toUpperCase()}
            </text>

            <rect x={ownerAvatarUrl ? 70 : 0} y="15" width="35" height="2" fill={accentColor} />
          </g>

          {/* MAIN CONTAINER CONTENT */}
          {/* We position things beautifully based on theme requirements */}
          <g 
            transform={`translate(${80 + (config.titleOffset?.x || 0)}, ${180 + (config.titleOffset?.y || 0)})`}
            onMouseDown={(e) => mode === 'edit' && handleMouseDown('title', e)}
            className={`group ${mode === 'edit' ? 'cursor-move' : ''}`}
          >
            {renderDragHandle('title', -40, -10)}
            
            {/* TECHNOLOGY TAG */}
            {showLanguage && (
              <g transform="translate(0, 0)">
                <rect 
                  x="0" 
                  y="0" 
                  width={stats.primaryLanguage.length * 11 + 40} 
                  height="34" 
                  rx="17" 
                  fill={layout === 'minimalist' ? '#f4f4f5' : '#1e293b'} 
                  stroke={stats.languageColor} 
                  strokeWidth="1.2"
                  opacity="0.9"
                />
                <circle cx="20" cy="17" r="5" fill={stats.languageColor} />
                <text
                  x="34"
                  y="18"
                  dominantBaseline="central"
                  fill={layout === 'minimalist' ? '#3f3f46' : '#94a3b8'}
                  className="font-mono-custom"
                  fontSize="13"
                  fontWeight="bold"
                >
                  {stats.primaryLanguage}
                </text>
              </g>
            )}

            {/* REPOSITORY TITLE */}
            <g transform={`translate(0, ${showLanguage ? 120 : 80})`}>
              {layout === 'elegant' ? (
                <text
                  x="0"
                  y="0"
                  fill="url(#titleGradient)"
                  className="font-serif-custom"
                  fontSize="64"
                  fontWeight="bold"
                  letterSpacing="-0.5"
                >
                  {title}
                </text>
              ) : layout === 'minimalist' ? (
                <text
                  x="0"
                  y="0"
                  fill="#09090b"
                  className="font-space"
                  fontSize="68"
                  fontWeight="bold"
                  letterSpacing="-1.5"
                >
                  {title}
                </text>
              ) : layout === 'terminal' ? (
                <g>
                  {/* Flashing terminal line with command code */}
                  <text
                    x="0"
                    y="0"
                    fill={primaryColor}
                    className="font-mono-custom"
                    fontSize="48"
                    fontWeight="bold"
                  >
                    {">_ "} {title.toLowerCase()}
                  </text>
                </g>
              ) : (
                <text
                  x="0"
                  y="0"
                  fill="url(#titleGradient)"
                  className="font-outfit"
                  fontSize="72"
                  fontWeight="900"
                  letterSpacing="-1"
                  filter={glowEffect ? 'url(#softGlow)' : undefined}
                >
                  {title}
                </text>
              )}
            </g>

            {/* PROJECT TAGLINE */}
            <g transform={`translate(0, ${showLanguage ? 180 : 140})`}>
              <text
                x="0"
                y="0"
                fill={layout === 'minimalist' ? '#52525b' : '#94a3b8'}
                fontSize="22"
                className={layout === 'minimalist' ? 'font-space' : layout === 'terminal' ? 'font-mono-custom' : 'font-outfit'}
                fontWeight="500"
                opacity="0.9"
              >
                {tagline.length > 75 ? `${tagline.slice(0, 75)}...` : tagline}
              </text>
            </g>

            {/* TERMINAL / CYBERPUNK CODE VIEWPORT PORTAL */}
            {(layout === 'terminal' || layout === 'cyberpunk') && customCodeSnippet && (
              <g 
                transform={`translate(${620 + (config.codeSnippetOffset?.x || 0)}, ${-50 + (config.codeSnippetOffset?.y || 0)})`}
                onMouseDown={(e) => mode === 'edit' && handleMouseDown('codeSnippet', e)}
                className={`group ${mode === 'edit' ? 'cursor-move' : ''}`}
              >
                {renderDragHandle('codeSnippet', -15, -15)}
                {/* Background Box for code */}
                <rect 
                  width="420" 
                  height="220" 
                  rx="8" 
                  fill="#020617" 
                  stroke={primaryColor} 
                  strokeWidth="1.2" 
                  opacity="0.85" 
                />
                {/* Visual Window Controls */}
                <circle cx="20" cy="20" r="5" fill="#ef4444" />
                <circle cx="36" cy="20" r="5" fill="#eab308" />
                <circle cx="52" cy="20" r="5" fill="#22c55e" />
                
                <text x="80" y="24" fill="#475569" className="font-mono-custom" fontSize="11">node_module / {title.toLowerCase()}</text>
                
                {/* Actual Custom Code Lines */}
                <g className="font-mono-custom" fontSize="12" fill="#94a3b8" transform="translate(20, 60)">
                  {customCodeSnippet.split('\n').slice(0, 7).map((line, idx) => (
                    <text key={`code-line-${idx}`} x="0" y={idx * 22} opacity={0.9}>
                      {/* Highlight keywords in colors dynamically */}
                      <tspan fill={accentColor}>{line.includes('import') || line.includes('const') ? '⚡ ' : '  '}</tspan>
                      <tspan fill={line.includes('const') || line.includes('let') || line.includes('import') ? secondaryColor : undefined}>
                        {line}
                      </tspan>
                    </text>
                  ))}
                </g>
              </g>
            )}

            {/* MINIMALIST & COSMIC UNIQUE SUB DESIGN ELEMENTS: BULLETS */}
            {(layout === 'cosmic' || layout === 'elegant') && (
              <g transform="translate(640, -10)" className="font-outfit" fontSize="15" fill="#cbd5e1" opacity="0.85">
                <rect width="400" height="150" rx="12" fill={backgroundColor} stroke={secondaryColor} strokeWidth="1" strokeDasharray="4,4" opacity="0.4" />
                
                {/* Feature Bullets parsed from data dynamically */}
                <circle cx="30" cy="35" r="4" fill={accentColor} />
                <text x="45" y="40">Autonomous state parsing pipeline</text>

                <circle cx="30" cy="75" r="4" fill={primaryColor} />
                <text x="45" y="80">Ultra-glowing Open Graph vector delivery</text>

                <circle cx="30" cy="115" r="4" fill={secondaryColor} />
                <text x="45" y="120">Fully synchronized via @jehadurre stack</text>
              </g>
            )}

          </g>

          {/* GITHUB SOCIAL ANALYTICS STATS BAR (Footer elements) */}
          <g 
            transform={`translate(${80 + (config.statsOffset?.x || 0)}, ${520 + (config.statsOffset?.y || 0)})`}
            onMouseDown={(e) => mode === 'edit' && handleMouseDown('stats', e)}
            className={`group ${mode === 'edit' ? 'cursor-move' : ''}`}
          >
            {renderDragHandle('stats', -40, -15)}
            {/* Stars Count */}
            {showStars && (
              <g transform="translate(0, 0)">
                {/* Star Icon Vector */}
                <path
                  d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z"
                  fill={layout === 'minimalist' ? '#f59e0b' : accentColor}
                  transform="translate(0, -6) scale(1)"
                />
                <text
                  x="32"
                  y="2"
                  dominantBaseline="central"
                  fill={layout === 'minimalist' ? '#18181b' : '#ffffff'}
                  className="font-mono-custom"
                  fontSize="20"
                  fontWeight="bold"
                >
                  {stats.stars.toLocaleString()}
                  <tspan fontSize="13" fill={layout === 'minimalist' ? '#71717a' : '#64748b'} fontWeight="normal" dx="5">stars</tspan>
                </text>
              </g>
            )}

            {/* Forks Count */}
            {showForks && (
              <g transform={`translate(${showStars ? 180 : 0}, 0)`}>
                {/* Fork Icon Vector */}
                <path
                  d="M18 8h-3V6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v2a6 6 0 0 0 6 6h4v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a6 6 0 0 0 6-6v-2a2 2 0 0 0-2-2z"
                  stroke={primaryColor}
                  fill="none"
                  strokeWidth="2.5"
                  transform="translate(0, -10) scale(0.85)"
                  opacity="0.8"
                />
                <circle cx="5" cy="-2" r="3" fill={primaryColor} />
                <circle cx="15" cy="-2" r="3" fill={primaryColor} />
                <circle cx="10" cy="14" r="3" fill={primaryColor} />
                
                <text
                  x="28"
                  y="2"
                  dominantBaseline="central"
                  fill={layout === 'minimalist' ? '#18181b' : '#ffffff'}
                  className="font-mono-custom"
                  fontSize="20"
                  fontWeight="bold"
                >
                  {stats.forks.toLocaleString()}
                  <tspan fontSize="13" fill={layout === 'minimalist' ? '#71717a' : '#64748b'} fontWeight="normal" dx="5">forks</tspan>
                </text>
              </g>
            )}

            {/* Issues Count */}
            {showIssues && (
              <g transform={`translate(${(showStars ? 180 : 0) + (showForks ? 180 : 0)}, 0)`}>
                {/* Info / Circle Warning Vector */}
                <circle cx="10" cy="5" r="9" fill="none" stroke={layout === 'minimalist' ? '#ef4444' : secondaryColor} strokeWidth="2" />
                <line x1="10" y1="2" x2="10" y2="6" stroke={layout === 'minimalist' ? '#ef4444' : secondaryColor} strokeWidth="2" />
                <circle cx="10" cy="9" r="1" fill={layout === 'minimalist' ? '#ef4444' : secondaryColor} />
                
                <text
                  x="28"
                  y="2"
                  dominantBaseline="central"
                  fill={layout === 'minimalist' ? '#18181b' : '#ffffff'}
                  className="font-mono-custom"
                  fontSize="20"
                  fontWeight="bold"
                >
                  {stats.openIssues}
                  <tspan fontSize="13" fill={layout === 'minimalist' ? '#71717a' : '#64748b'} fontWeight="normal" dx="5">issues</tspan>
                </text>
              </g>
            )}
          </g>

          {/* MANDATORY CREATOR WATERMARK BRANDING & SAFE-ZONE ATTRIBUTION */}
          {/* Aligned perfectly bottom right in 1200x630 canvas safe-zone */}
          {showWatermark && (
            <g transform={`translate(${1200 - 260}, ${630 - 104})`}>
              {/* Creator Tag Box with elegant pill look */}
              <rect
                x="0"
                y="-14"
                width="180"
                height="32"
                rx="8"
                fill={layout === 'minimalist' ? '#18181b' : '#312e81'}
                opacity={layout === 'minimalist' ? 0.05 : 0.5}
              />
              {/* Soft decorative visual dot for attribution aesthetic */}
              <circle cx="18" cy="2" r="3" fill={accentColor} />
              
              <text
                x="32"
                y="7"
                fill={layout === 'minimalist' ? '#18181b' : '#e0e7ff'}
                className="font-mono-custom"
                fontSize="12"
                fontWeight="700"
                letterSpacing="1"
              >
                {customWatermark}
              </text>
            </g>
          )}

          {/* QR Code Overlay */}
          {config.showQRCode && (
            <g transform={`translate(${1200 - (config.qrCodeSize || 80) * 2}, 80)`}>
              {/* White background block for QR code contrast */}
              <rect x="-10" y="-10" width={(config.qrCodeSize || 80) + 20} height={(config.qrCodeSize || 80) + 20} rx="12" fill="#ffffff" opacity={0.95} />
              <svg x="0" y="0" width={config.qrCodeSize || 80} height={config.qrCodeSize || 80}>
                <QRCode
                  value={`https://github.com/${stats.repoOwner || config.ownerName}/${stats.repoName || config.title}`}
                  size={config.qrCodeSize || 80}
                  level="Q"
                  bgColor="transparent"
                  fgColor={config.qrCodeColor || "#09090b"} // Custom foreground color
                />
              </svg>
            </g>
          )}

          </g> {/* END of Centered Content Layer */}

        </svg>
  );

  const isHacker = appLayout === 'hacker';

  const btnPngClass = isHacker
    ? "flex items-center justify-center gap-2 py-3 px-4 rounded-none font-bold bg-emerald-950/40 hover:bg-emerald-900 border border-emerald-500 text-emerald-400 transition-all font-mono uppercase tracking-widest active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-[inset_0_0_15px_rgba(16,185,129,0.15)] relative before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-emerald-500"
    : "flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-lg shadow-sky-950/20 active:scale-[0.98] disabled:opacity-50 cursor-pointer";

  const btnSvgClass = isHacker
    ? "flex items-center justify-center gap-2 py-3 px-4 rounded-none font-bold bg-[#0a0a0a] hover:bg-emerald-950/20 text-emerald-500 transition-all border border-emerald-900/40 hover:border-emerald-700 active:scale-[0.98] cursor-pointer font-mono uppercase tracking-widest"
    : "flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-all border border-zinc-700 active:scale-[0.98] cursor-pointer";

  const btnCopyClass = isHacker
    ? "flex items-center justify-center gap-2 py-3 px-4 rounded-none font-bold bg-[#050505] hover:bg-emerald-950/20 text-emerald-600 hover:text-emerald-500 transition-all border border-emerald-900/60 active:scale-[0.98] cursor-pointer font-mono uppercase tracking-[0.2em]"
    : "flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-all border border-zinc-800 active:scale-[0.98] cursor-pointer";

  if (mode === 'thumbnail') {
    return (
      <div 
        className="CanvasPreview w-full rounded shadow-md bg-zinc-950 border border-zinc-800/80 overflow-hidden relative"
        style={{ aspectRatio: `${width}/${height}` }}
      >
        {svgContent}
      </div>
    );
  }

  return (
    <div className="CanvasPreview flex flex-col gap-6" id="canvas-preview-container">
      {/* Aspect Ratio Switcher Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <h3 className="text-zinc-200 font-semibold text-sm flex items-center gap-2">
          Canvas Preview Area
        </h3>
        <div className="flex items-center gap-4">
          <button
            onClick={handleDownloadPNG}
            disabled={downloading}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded bg-sky-600 hover:bg-sky-500 text-white transition-colors disabled:opacity-50"
            title="Download high-resolution PNG"
          >
            <Download className="w-3.5 h-3.5" />
            {downloading ? 'Compiling...' : 'Export PNG'}
          </button>
          <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800/80">
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-zinc-400 hover:text-zinc-200 transition-colors rounded hover:bg-zinc-800 flex items-center justify-center"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomReset}
              className="px-2 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors rounded hover:bg-zinc-800 min-w-14 text-center select-none"
              title="Reset Zoom"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-zinc-400 hover:text-zinc-200 transition-colors rounded hover:bg-zinc-800 flex items-center justify-center"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
          <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800/80">
            <button
              onClick={() => setSelectedRatio('1200x630')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${selectedRatio === '1200x630' ? 'bg-zinc-800 text-zinc-100 shadow' : 'text-zinc-400 hover:text-zinc-300'}`}
              title="Facebook / LinkedIn (1.9:1)"
            >
              1200×630
            </button>
            <button
              onClick={() => setSelectedRatio('1600x900')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${selectedRatio === '1600x900' ? 'bg-zinc-800 text-zinc-100 shadow' : 'text-zinc-400 hover:text-zinc-300'}`}
              title="Twitter / High-Res (16:9)"
            >
              1600×900
            </button>
            <button
              onClick={() => setSelectedRatio('1080x1080')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${selectedRatio === '1080x1080' ? 'bg-zinc-800 text-zinc-100 shadow' : 'text-zinc-400 hover:text-zinc-300'}`}
              title="Instagram / Square (1:1)"
            >
              1080×1080
            </button>
          </div>
        </div>
      </div>

      {/* Visual Workspace with overflow handling */}
      <div className="relative w-full overflow-hidden rounded-xl bg-zinc-950/40 border border-zinc-800/80 p-2 sm:p-6 min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
        {/* Visual Frame wrapper */}
        <div 
          className="relative w-full rounded shadow-2xl bg-zinc-950 border border-zinc-800 transition-transform origin-center duration-300 overflow-hidden"
          style={{ maxWidth: `${width}px`, aspectRatio: `${width}/${height}`, transform: `scale(${zoomLevel})` }}
        >
          {svgContent}
        </div>
      </div>

      {/* RENDER EXPORT ACTIONS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          id="btn-download-png"
          disabled={downloading}
          onClick={handleDownloadPNG}
          className={btnPngClass}
        >
          <Download className="w-5 h-5" />
          {downloading ? 'Compiling PNG...' : 'Download lossy PNG'}
        </button>

        <button
          id="btn-download-svg"
          onClick={handleDownloadSVG}
          className={btnSvgClass}
        >
          <FileCode className={`w-5 h-5 ${isHacker ? '' : 'text-emerald-400'}`} />
          Download Vector SVG
        </button>

        <button
          id="btn-copy-raw-svg"
          onClick={handleCopySvg}
          className={btnCopyClass}
        >
          {copied ? (
            <>
              <Check className={`w-5 h-5 ${isHacker ? 'text-emerald-400' : 'text-green-400'}`} />
              Copied to Clipboard!
            </>
          ) : (
            <>
              <Copy className={`w-5 h-5 ${isHacker ? 'text-emerald-600' : 'text-zinc-400'}`} />
              Copy Raw SVG Text
            </>
          )}
        </button>
      </div>

      {/* SUBTLE INFO FOR PRODUCTION DEV DESIGN INTEGRATION */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800/40 text-xs text-zinc-400 select-none">
        <BadgeHelp className="w-4 h-4 text-sky-400 flex-shrink-0" />
        <span>This edge-compatible sandbox generates high fidelity vector source. Embed image with <strong>&lt;meta property="og:image"&gt;</strong> on GitHub.</span>
      </div>
    </div>
  );
}
