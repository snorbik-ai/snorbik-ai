import React, { useMemo } from 'react';
import { ProjectsViewer } from './sdk/ProjectsViewer';
import './App.css';

export const App: React.FC = () => {
  const initialUrl = useMemo(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('p') || params.get('page');
      if (page === 'cv') return 'https://tayier.snorbik.com/cv';
      if (page === 'projects') return 'https://tayier.snorbik.com/projects';
      if (page === 'about') return 'https://tayier.snorbik.com/about';
      if (page === 'b2b') return 'https://snorbik.com';
      const custom = params.get('url');
      if (custom && custom.startsWith('https://')) return custom;
    } catch {
      // fallback to main site
    }
    return 'https://tayier.snorbik.com';
  }, []);

  return (
    <div className="spa-app-root">
      <ProjectsViewer
        sourceUrl={initialUrl}
        title="Tayier Nimait — Applied AI Portfolio & Showroom"
      />
    </div>
  );
};
