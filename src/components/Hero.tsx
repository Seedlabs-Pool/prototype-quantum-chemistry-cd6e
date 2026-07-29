import React from 'react';

interface HeroProps {
  onLaunch: () => void;
}

export default function Hero({ onLaunch }: HeroProps) {
  return (
    <section style={{ background: '#0f172a', color: '#fff', padding: '80px 24px 96px', textAlign: 'center' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.5px' }}>
          Eliminate Manual File Conversion in Drug Discovery
        </h1>
        <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#cbd5e1', marginTop: '20px', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }}>
          Seamlessly migrate chemical models and results between quantum chemistry packages using ORCA 6.0's native interfaces—zero data loss, zero reformatting.
        </p>
        <button
          data-cta="launch-bridge"
          onClick={onLaunch}
          style={{
            marginTop: '36px',
            background: '#4f46e5',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '16px 32px',
            fontSize: '17px',
            fontWeight: 600,
            boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.4)',
            transition: 'transform 0.2s, background 0.2s',
          }}
          onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = '#4338ca'; }}
          onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = '#4f46e5'; }}
        >
          Launch Bridge Demo
        </button>
      </div>
    </section>
  );
}
