/**
 * SNORBIK Projects Viewer SDK — Contrats Canoniques
 * Version 1.0.0
 */

export interface ViewerConfig {
  sourceUrl: string;
  allowedOrigins: string[];
  title?: string;
  fallbackUrl?: string;
  minHeight?: number;
  sandboxPolicy?: string;
}

export type ViewerState =
  | 'idle'
  | 'validating'
  | 'loading'
  | 'loaded'
  | 'blocked_or_unavailable'
  | 'error';

export interface ValidationResult {
  isValid: boolean;
  normalizedUrl: string;
  origin: string;
  allowed: boolean;
  reasons: string[];
}

export const DEFAULT_ALLOWED_ORIGINS = [
  'https://tayier.snorbik.com',
  'https://snorbik.com',
  'https://cv.snorbik.com'
];
