import React from 'react';

export default function Header() {
  return (
    <header style={{ background: '#0f172a', color: '#fff', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #1e293b' }}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#4f46e5" />
        <path d="M16 8L24 13V19L16 24L8 19V13L16 8Z" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="16" cy="16" r="3" fill="#fff" />
      </svg>
      <div>
        <div style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.25px' }}>Quantum Bridge</div>
        <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>ORCA 6.0 Interoperability Platform</div>
      </div>
    </header>
  );
}
