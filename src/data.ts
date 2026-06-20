/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Repository, TemplateConfig } from './types';

export const INITIAL_REPOSITORIES: Repository[] = [
  {
    id: 'repo-1',
    name: 'IntentDetector',
    owner: 'jehadurre',
    description: 'An ultra-low latency prompt analysis engine designed for agentic routing on edge networks.',
    stars: 1248,
    forks: 184,
    openIssues: 12,
    primaryLanguage: 'TypeScript',
    languageColor: '#3178c6',
    tagline: 'Decentralized Agent Routing & Fast Intent Identification.',
    features: [
      'Token-level prediction speeds (sub-5ms)',
      'Zero dependencies standalone WASM binary',
      'Optimized for Cloudflare Workers & Satori'
    ],
    suggestedPalette: {
      primary: '#22c55e',
      secondary: '#16a34a',
      accent: '#4ade80',
      background: '#022c22'
    }
  },
  {
    id: 'repo-2',
    name: 'bijoy2unicode',
    owner: 'jehadurre',
    description: 'A modern, performant, lossless converter for Bijoy layout encoding to UTF-8 Unicode standards.',
    stars: 843,
    forks: 112,
    openIssues: 4,
    primaryLanguage: 'JavaScript',
    languageColor: '#f1e05a',
    tagline: 'Lossless Bijoy to standard Unicode encoding parser.',
    features: [
      'High-throughput parsing stream support',
      'Perfect preservation of ligatures',
      'Fully cross-compatible in Node & Browser'
    ],
    suggestedPalette: {
      primary: '#f59e0b',
      secondary: '#10b981',
      accent: '#ec4899',
      background: '#111827'
    }
  },
  {
    id: 'repo-3',
    name: 'antigravity-agent',
    owner: 'jehadurre',
    description: 'Autonomous multi-agent orchestration layer featuring deep recursive reasoning and full-tool execution.',
    stars: 3140,
    forks: 429,
    openIssues: 28,
    primaryLanguage: 'Go',
    languageColor: '#00add8',
    tagline: 'Orchestrate agents across infinite cloud environments.',
    features: [
      'Sovereign sandboxed CLI executor',
      'Self-healing code compiler state',
      'Built-in memory compression storage'
    ],
    suggestedPalette: {
      primary: '#10b981',
      secondary: '#06b6d4',
      accent: '#f43f5e',
      background: '#090d16'
    }
  }
];

export const DEFAULT_TEMPLATE: TemplateConfig = {
  layout: 'terminal',
  title: 'IntentDetector',
  tagline: 'Decentralized Agent Routing & Fast Intent Identification.',
  ownerName: 'jehadurre',
  ownerAvatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop&q=80',
  primaryColor: '#22c55e',
  secondaryColor: '#16a34a',
  accentColor: '#4ade80',
  backgroundColor: '#022c22',
  showStars: true,
  showForks: true,
  showIssues: true,
  showLanguage: true,
  customLogoText: 'jehadurre',
  customWatermark: 'via @jehadurre',
  showWatermark: true,
  customCodeSnippet: 'import { IntentDetector } from "@jehadurre/detector";\n\nconst agent = new IntentDetector();\nconst intent = await agent.parse(prompt);',
  glowEffect: true,
  borderWidth: 2,
  customBackgroundImageUrl: undefined,
  showQRCode: false,
  qrCodeColor: '#09090b',
  qrCodeSize: 80,
  titleOffset: { x: 0, y: 0 },
  statsOffset: { x: 0, y: 0 },
  codeSnippetOffset: { x: 0, y: 0 },
  logoOffset: { x: 0, y: 0 }
};
