import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import PipelineDemo from './components/PipelineDemo';
import SupportedPlatforms from './components/SupportedPlatforms';

export default function App() {
  const scrollToDemo = () => {
    const el = document.getElementById('pipeline-demo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', color: '#0f172a', lineHeight: 1.6, minHeight: '100vh', background: '#f8fafc' }}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        h1, h2, h3, p { margin: 0; }
        button { cursor: pointer; }
      `}</style>
      <Header />
      <main>
        <Hero onLaunch={scrollToDemo} />
        <div id="pipeline-demo">
          <PipelineDemo />
        </div>
        <SupportedPlatforms />
      </main>
      <footer style={{ padding: '40px 24px', textAlign: 'center', color: '#64748b', fontSize: '15px', borderTop: '1px solid #e2e8f0' }}>
        © 2025 Quantum Bridge Labs. Built for ORCA 6.0 interoperability.
      </footer>
    </div>
  );
}
