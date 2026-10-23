/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Defines the structure for a theme object.
 * The `colors` array corresponds to CSS variables:
 * [bg, surface, accent, text, document-bg]
 */
export type Theme = {
  name: string;
  colors: [string, string, string, string, string];
  gradient?: string;
  isHighContrast?: boolean;
};

/**
 * An array of available themes for the application.
 * Polished with fluid graphics gradients and senior-friendly contrast.
 */
export const themes: Theme[] = [
  {
    name: 'Artyverse Aurora (Dark)',
    colors: ['#0B0F19', '#151D2F', '#EC4899', '#F1F5F9', '#0F172A'],
    gradient: 'linear-gradient(135deg, #0B0F19 0%, #171E38 50%, #1F1535 100%)',
  },
  {
    name: 'Sakura Glow (Cute Pastel)',
    colors: ['#FFF5F7', '#FFFFFF', '#F43F5E', '#1E293B', '#FFFFFF'],
    gradient: 'linear-gradient(135deg, #FFF1F2 0%, #FDF2F8 50%, #F5F3FF 100%)',
  },
  {
    name: 'WCAG AAA High Contrast (Senior)',
    colors: ['#000000', '#121212', '#38BDF8', '#FFFFFF', '#0A0A0A'],
    gradient: 'linear-gradient(180deg, #000000 0%, #0A0A0A 100%)',
    isHighContrast: true,
  },
  {
    name: 'Cyber Cyan (Modern)',
    colors: ['#090D16', '#111827', '#06B6D4', '#F8FAFC', '#0B1120'],
    gradient: 'linear-gradient(135deg, #040814 0%, #091E33 50%, #0F172A 100%)',
  },
  {
    name: 'Lavender Dreams',
    colors: ['#FAF5FF', '#FFFFFF', '#8B5CF6', '#1E1B4B', '#FFFFFF'],
    gradient: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 50%, #EDE9FE 100%)',
  },
];
