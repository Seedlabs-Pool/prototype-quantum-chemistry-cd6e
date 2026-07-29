import React from 'react';

const platforms = [
  { name: 'ORCA 6.0', role: 'Target & Hub', features: ['Native JSON interface', 'External optimizer API', 'Multi-package I/O'] },
  { name: 'Gaussian 16', role: 'Source', features: ['Checkpoint migration', 'Basis set harmonization', 'Archive extraction'] },
  { name: 'Q-Chem 6', role: 'Source', features: ['ESPD data piping', 'MO coefficient transfer', 'Solvent model mapping'] },
  { name: 'PySCF 2.4', role: 'Source / Scripting', features: ['Pythonic pipeline hooks', 'Custom functional bridge', 'Active space streaming'] },
];

export default function SupportedPlatforms() {
  return (
    <section style={{ padding: '0 24px 80px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Supported Interfaces</h2>
      <p style={{ fontSize: '16px', color: '#475569', marginBottom: '32px' }}>Native integrations powered by ORCA 6.0's new interoperability layer.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {platforms.map((p) => (
          <div key={p.name} style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{p.name}</h3>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#0d9488', background: '#ccfbf1', padding: '4px 10px', borderRadius: '999px' }}>{p.role}</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {p.features.map((f) => (
                <li key={f} style={{ fontSize: '15px', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
