/**
 * SNORBIK Projects Viewer SDK — Moteur de Politique & Validation Fail-Closed
 */

import { ValidationResult, DEFAULT_ALLOWED_ORIGINS } from './contracts';

export class ViewerPolicyEngine {
  public static extractOrigin(url: string): { isHttps: boolean; origin: string; error?: string } {
    try {
      const parsed = new URL(url);
      const isHttps = parsed.protocol.toLowerCase() === 'https:';
      const origin = `${parsed.protocol.toLowerCase()}//${parsed.host.toLowerCase()}`;
      return { isHttps, origin };
    } catch (err) {
      return { isHttps: false, origin: '', error: String(err) };
    }
  }

  public static validate(url: string, allowedOrigins: string[] = DEFAULT_ALLOWED_ORIGINS): ValidationResult {
    const reasons: string[] = [];
    const { isHttps, origin, error } = this.extractOrigin(url);

    if (error) {
      reasons.push(`URL invalide : ${error}`);
    }
    if (!isHttps) {
      reasons.push('Protocole HTTPS obligatoire (Fail-Closed).');
    }

    const normalizedOrigins = allowedOrigins.map(o => o.trim().replace(/\/+$/, '').toLowerCase());
    const allowed = normalizedOrigins.includes(origin);

    if (!allowed && origin) {
      reasons.push(`Origine non autorisée : '${origin}' n'est pas dans la liste blanche.`);
    }

    const isValid = isHttps && allowed && !error;

    return {
      isValid,
      normalizedUrl: url.trim(),
      origin,
      allowed,
      reasons
    };
  }
}
