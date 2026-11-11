import React, { useState } from 'react';
import { ProjectsViewer } from './sdk/ProjectsViewer';
import { 
  Sparkles, 
  Terminal, 
  ExternalLink, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  Github, 
  Cpu 
} from 'lucide-react';
import './App.css';

interface TargetView {
  id: string;
  label: string;
  url: string;
  badge: string;
}

const TARGET_VIEWS: TargetView[] = [
  {
    id: 'projects',
    label: 'Showroom Réalisations (70+)',
    url: 'https://tayier.snorbik.com/projects',
    badge: 'Catalogue Projets'
  },
  {
    id: 'home',
    label: 'Portfolio Ingénieur IA',
    url: 'https://tayier.snorbik.com',
    badge: 'Page d\'Accueil'
  },
  {
    id: 'cv',
    label: 'CV & Profil Interactif',
    url: 'https://tayier.snorbik.com/cv',
    badge: 'Compétences 2026'
  },
  {
    id: 'b2b',
    label: 'Studio B2B SNORBIK',
    url: 'https://snorbik.com',
    badge: 'Offres Entreprises'
  }
];

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('projects');
  const activeView = TARGET_VIEWS.find(v => v.id === activeTab) || TARGET_VIEWS[0];

  return (
    <div className="spa-app-root">
      {/* 1. Header Global de la Maman (GitHub Host Container) */}
      <header className="spa-header">
        <div className="spa-header-inner">
          <div className="spa-brand">
            <div className="spa-logo-circle">
              <span className="spa-logo-letter">S</span>
            </div>
            <div>
              <div className="spa-brand-title">
                SNORBIK <span className="spa-cyan-text">AI</span>
                <span className="spa-sdk-tag">Projects Viewer SDK</span>
              </div>
              <div className="spa-brand-sub">
                Application Porteuse GitHub Pages · Vitrine de Production Hostinger
              </div>
            </div>
          </div>

          <div className="spa-header-badges">
            <div className="spa-badge spa-badge-green">
              <CheckCircle2 size={12} />
              <span>Hostinger VPS : Opérationnel (HTTP 200)</span>
            </div>
            <a
              href="https://github.com/snorbik-ai/snorbik-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="spa-github-link"
              title="Voir le dépôt GitHub"
            >
              <Github size={14} />
              <span>Dépôt GitHub snorbik-ai</span>
            </a>
          </div>
        </div>

        {/* 2. Onglets de Navigation entre les Vues Officielles */}
        <div className="spa-tabs-bar">
          <div className="spa-tabs-list">
            {TARGET_VIEWS.map(v => (
              <button
                key={v.id}
                type="button"
                onClick={() => setActiveTab(v.id)}
                className={`spa-tab-btn ${activeTab === v.id ? 'is-active' : ''}`}
              >
                <span>{v.label}</span>
                <span className="spa-tab-pill">{v.badge}</span>
              </button>
            ))}
          </div>

          <a 
            href={activeView.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="spa-direct-open-btn"
          >
            <span>Ouvrir en direct</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </header>

      {/* 3. Conteneur Central du Bébé (SDK ProjectsViewer) */}
      <main className="spa-main-container">
        <div className="spa-intro-bar">
          <div className="spa-intro-left">
            <Sparkles size={16} className="spa-sparkle-icon" />
            <div>
              <strong>Conteneur Live Réactif :</strong> Ce composant React SDK vérifie la politique de sécurité HTTPS (*fail-closed*) et affiche la plateforme hébergée sur votre serveur VPS en flux direct.
            </div>
          </div>
          <div className="spa-intro-right">
            <ShieldCheck size={14} color="#10b981" />
            <span>Sandboxée · Zéro Secret Transmis · 100% Souverain</span>
          </div>
        </div>

        {/* Le composant SDK vivant */}
        <ProjectsViewer
          sourceUrl={activeView.url}
          title={`Showroom SNORBIK — ${activeView.label}`}
          minHeight={820}
        />
      </main>

      {/* 4. Footer d'Observabilité & Signature */}
      <footer className="spa-footer">
        <div className="spa-footer-inner">
          <div>
            <strong>SNORBIK AI Projects Viewer SDK (v1.0.0)</strong> — Architecture Multi-Distribution & FastMCP.
          </div>
          <div className="spa-footer-links">
            <a href="https://tayier.snorbik.com" target="_blank" rel="noopener noreferrer">tayier.snorbik.com</a>
            <span>•</span>
            <a href="https://snorbik.com" target="_blank" rel="noopener noreferrer">snorbik.com</a>
            <span>•</span>
            <a href="https://github.com/snorbik-ai" target="_blank" rel="noopener noreferrer">github.com/snorbik-ai</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
