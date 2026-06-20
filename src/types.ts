/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LayoutTheme = 'minimalist' | 'cyberpunk' | 'elegant' | 'terminal' | 'cosmic';

export interface Repository {
  id: string;
  name: string;
  owner: string;
  description: string;
  stars: number;
  forks: number;
  openIssues: number;
  primaryLanguage: string;
  languageColor: string;
  tagline?: string;
  features?: string[];
  suggestedPalette?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

export interface TemplateConfig {
  layout: LayoutTheme;
  title: string;
  tagline: string;
  ownerName: string;
  ownerAvatarUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  showStars: boolean;
  showForks: boolean;
  showIssues: boolean;
  showLanguage: boolean;
  customLogoText: string;
  customWatermark: string;
  showWatermark: boolean;
  customCodeSnippet?: string;
  glowEffect: boolean;
  borderWidth: number;
  customBackgroundImageUrl?: string; // New property for custom file upload
  showQRCode?: boolean;
  qrCodeColor?: string;
  qrCodeSize?: number;
  titleOffset?: { x: number; y: number };
  statsOffset?: { x: number; y: number };
  codeSnippetOffset?: { x: number; y: number };
  logoOffset?: { x: number; y: number };
  showGuides?: boolean;
}
