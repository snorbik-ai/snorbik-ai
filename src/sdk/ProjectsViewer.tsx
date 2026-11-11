import React, { useState, useEffect, useRef } from 'react';
import { ViewerConfig, ViewerState, DEFAULT_ALLOWED_ORIGINS } from './contracts';
import { ViewerPolicyEngine } from './policyEngine';
import { 
  ShieldCheck, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  AlertTriangle, 
  Lock,
  Globe
} from 'lucide-react';
import './ProjectsViewer.css';

export interface ProjectsViewerProps extends Partial<ViewerConfig> {
  sourceUrl: string;
  onStateChange?: (state: ViewerState) => void;
  className?: string;
}

export const ProjectsViewer: React.FC<ProjectsViewerProps> = ({
  sourceUrl,
  allowedOrigins = DEFAULT_ALLOWED_ORIGINS,
  title = 'SNORBIK Projects Viewer',
  fallbackUrl,
  minHeight = 780,
  sandboxPolicy = 'allow-scripts allow-same-origin allow-popups allow-forms allow-downloads',
  className = '',
  onStateChange
}) => {
  const [state, setState] = useState<ViewerState>('validating');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setState('validating');
    onStateChange?.('validating');

    const validation = ViewerPolicyEngine.validate(sourceUrl, allowedOrigins);
    if (!validation.isValid) {
      setState('error');
      setErrorMessage(validation.reasons.join(' '));
      onStateChange?.('error');
      return;
    }

    setState('loading');
    onStateChange?.('loading');
  }, [sourceUrl, allowedOrigins, iframeKey]);

  const handleIframeLoad = () => {
    setState('loaded');
    onStateChange?.('loaded');
  };

  const handleIframeError = () => {
    setState('blocked_or_unavailable');
    onStateChange?.('blocked_or_unavailable');
  };

  const reloadIframe = () => {
    setIframeKey(k => k + 1);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const targetUrl = fallbackUrl || sourceUrl;

  return (
    <div
      ref={containerRef}
      className={`spv-root ${isFullscreen ? 'is-fullscreen' : ''} ${className}`}
      style={{ minHeight: isFullscreen ? '100vh' : `${minHeight}px` }}
    >
      {/* 1. Fenêtre Navigateur Simulée (Chrome Frame) */}
      <div className="spv-chrome-bar">
        {/* Pastilles macOS */}
        <div className="spv-chrome-dots">
          <span className="spv-dot spv-dot-red" title="Fermer" />
          <span className="spv-dot spv-dot-yellow" title="Réduire" />
          <span className="spv-dot spv-dot-green" title="Agrandir" />
        </div>

        {/* Barre d'adresse URL sécurisée */}
        <div className="spv-address-pill">
          <Lock size={12} className="spv-lock-icon" />
          <span className="spv-url-protocol">https://</span>
          <span className="spv-url-body">{sourceUrl.replace(/^https?:\/\//, '')}</span>
          <span className="spv-source-badge">Live Hostinger VPS</span>
        </div>

        {/* Contrôles d'actions rapides */}
        <div className="spv-chrome-actions">
          <button 
            type="button" 
            onClick={reloadIframe} 
            className="spv-btn-icon" 
            title="Recharger le conteneur"
            aria-label="Recharger"
          >
            <RefreshCw size={14} className={state === 'loading' ? 'is-spinning' : ''} />
          </button>
          <button 
            type="button" 
            onClick={toggleFullscreen} 
            className="spv-btn-icon" 
            title={isFullscreen ? 'Quitter le plein écran' : 'Passer en plein écran'}
            aria-label="Plein écran"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <a 
            href={targetUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="spv-btn-primary"
            title="Ouvrir dans un nouvel onglet"
          >
            <span>Ouvrir sur le site</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* 2. Zone de Contenu : Iframe et Overlays d'États */}
      <div className="spv-viewport">
        {/* Loader de transition */}
        {state === 'loading' && (
          <div className="spv-overlay spv-loading-overlay">
            <div className="spv-spinner" />
            <div className="spv-loading-title">Chargement sécurisé du Showroom SNORBIK...</div>
            <div className="spv-loading-subtitle">
              Connexion en direct à l'infrastructure VPS Hostinger
            </div>
            <div className="spv-loading-badge">
              <ShieldCheck size={13} />
              <span>Origine HTTPS Certifiée Fail-Closed</span>
            </div>
          </div>
        )}

        {/* Écran d'erreur de sécurité */}
        {state === 'error' && (
          <div className="spv-overlay spv-error-overlay">
            <AlertTriangle size={36} color="#ef4444" />
            <div className="spv-error-title">Validation de sécurité échouée</div>
            <p className="spv-error-desc">{errorMessage}</p>
            <a href={targetUrl} target="_blank" rel="noopener noreferrer" className="spv-btn-primary">
              <span>Ouvrir directement la source</span>
              <ExternalLink size={14} />
            </a>
          </div>
        )}

        {/* Écran de repli (blocked / unavailable) */}
        {state === 'blocked_or_unavailable' && (
          <div className="spv-overlay spv-fallback-overlay">
            <Globe size={36} color="#38bdf8" />
            <div className="spv-fallback-title">L'intégration en conteneur n'a pas pu aboutir</div>
            <p className="spv-fallback-desc">
              La politique de sécurité du navigateur ou du pare-feu requiert une ouverture directe.
            </p>
            <a href={targetUrl} target="_blank" rel="noopener noreferrer" className="spv-btn-primary">
              <span>Consulter le portfolio sur Hostinger</span>
              <ExternalLink size={14} />
            </a>
          </div>
        )}

        {/* Iframe vivante */}
        <iframe
          key={iframeKey}
          src={sourceUrl}
          title={title}
          sandbox={sandboxPolicy}
          loading="eager"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          className="spv-iframe"
          aria-label={title}
        />
      </div>
    </div>
  );
};
