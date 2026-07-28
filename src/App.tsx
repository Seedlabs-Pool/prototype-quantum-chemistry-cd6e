import React, { useState, useMemo, useEffect } from 'react';

const palette = {
  bg: '#0b1120',
  panel: '#131c31',
  panel2: '#1b2740',
  border: '#2a3category'.length ? '#2a3855' : '#2a3855',
  text: '#eef2ff',
  sub: '#b7c0d8',
  accent: '#38bdf8',
  accent2: '#a78bfa',
  green: '#34d399',
  amber: '#fbbf24',
};

type Pkg = {
  id: string;
  name: string;
  strength: string;
  color: string;
};

const PACKAGES: Pkg[] = [
  { id: 'gaussian', name: 'Gaussian 16', strength: 'Broad method coverage', color: '#38bdf8' },
  { id: 'psi4', name: 'Psi4', strength: 'Open-source screening', color: '#34d399' },
  { id: 'nwchem', name: 'NWChem', strength: 'Massively parallel DFT', color: '#a78bfa' },
  { id: 'qchem', name: 'Q-Chem', strength: 'Excited-state methods', color: '#fbbf24' },
  { id: 'molpro', name: 'Molpro', strength: 'High-precision coupled cluster', color: '#f472b6' },
];

type Field = { key: string; label: string; value: string; kept: boolean };

const MODEL_FIELDS: Field[] = [
  { key: 'geom', label: 'Molecular geometry (XYZ)', value: '48 atoms · Å', kept: true },
  { key: 'charge', label: 'Charge & multiplicity', value: '0 / singlet', kept: true },
  { key: 'basis', label: 'Basis set', value: 'def2-TZVP', kept: true },
  { key: 'method', label: 'Method / functional', value: 'B3LYP-D3', kept: true },
  { key: 'mo', label: 'Molecular orbitals', value: '412 MOs', kept: true },
  { key: 'density', label: 'Electron density matrix', value: '1.2 GB', kept: true },
  { key: 'grad', label: 'Energy gradients', value: 'analytic', kept: true },
  { key: 'solv', label: 'Implicit solvation (CPCM)', value: 'water ε=78.4', kept: true },
];

function Logo() {
  return (
    <svg width="38" height="38" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="6" fill="#38bdf8" />
      <g stroke="#a78bfa" strokeWidth="2" fill="none">
        <ellipse cx="24" cy="24" rx="20" ry="8" />
        <ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(60 24 24)" />
        <ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(120 24 24)" />
      </g>
      <circle cx="44" cy="24" r="3" fill="#34d399" />
      <circle cx="14" cy="41" r="3" fill="#fbbf24" />
      <circle cx="14" cy="7" r="3" fill="#f472b6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h14M13 6l6 6-6 6" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ color = '#34d399' }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WarnIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l9 16H3L12 3z" stroke="#fbbf24" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 10v4M12 17h.01" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function OrcaCore() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" fill="#0b1120" />
      <circle cx="12" cy="12" r="8" stroke="#0b1120" strokeWidth="1.6" />
      <path d="M12 4v-2M12 22v-2M4 12H2M22 12h-2" stroke="#0b1120" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function App() {
  const [source, setSource] = useState<string>('psi4');
  const [dest, setDest] = useState<string>('molpro');
  const [fields, setFields] = useState<Field[]>(MODEL_FIELDS);
  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [logLines, setLogLines] = useState<string[]>([]);

  const srcPkg = PACKAGES.find((p) => p.id === source)!;
  const destPkg = PACKAGES.find((p) => p.id === dest)!;
  const keptCount = fields.filter((f) => f.kept).length;

  const toggleField = (key: string) => {
    setFields((prev) => prev.map((f) => (f.key === key ? { ...f, kept: !f.kept } : f)));
  };

  const runMigration = () => {
    if (source === dest) return;
    setStatus('running');
    setProgress(0);
    const active = fields.filter((f) => f.kept);
    const steps = [
      `Reading model from ${srcPkg.name} native format…`,
      'Opening ORCA 6.0 interoperability interface',
      ...active.map((f) => `Mapping ${f.label} → ORCA schema`),
      `Serializing to ${destPkg.name} input deck`,
      'Verifying checksums · 0 data-loss events',
      'Migration complete.',
    ];
    setLogLines([]);
    let i = 0;
    const iv = setInterval(() => {
      setLogLines((prev) => [...prev, steps[i]]);
      setProgress(Math.round(((i + 1) / steps.length) * 100));
      i++;
      if (i >= steps.length) {
        clearInterval(iv);
        setStatus('done');
      }
    }, 420);
  };

  useEffect(() => {
    setStatus('idle');
    setProgress(0);
    setLogLines([]);
  }, [source, dest]);

  const savedHours = useMemo(() => (keptCount * 0.75).toFixed(1), [keptCount]);

  return (
    <div
      style={{
        background: `radial-gradient(1200px 600px at 80% -10%, #1a2c52 0%, ${palette.bg} 55%)`,
        minHeight: '100vh',
        color: palette.text,
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        fontSize: 16,
        lineHeight: 1.5,
      }}
    >
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 16px' }}>
        {/* Header */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '20px 4px',
            flexWrap: 'wrap',
          }}
        >
          <Logo />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: 0.3 }}>OrcaBridge</span>
            <span style={{ fontSize: 13, color: palette.sub }}>
              Quantum chemistry interoperability, automated
            </span>
          </div>
          <nav style={{ marginLeft: 'auto', display: 'flex', gap: 18, fontSize: 14 }}>
            <a href="#demo" style={{ color: palette.sub, textDecoration: 'none' }}>Live demo</a>
            <a href="#how" style={{ color: palette.sub, textDecoration: 'none' }}>How it works</a>
          </nav>
        </header>

        {/* Hero */}
        <section style={{ padding: '48px 4px 40px', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: palette.panel2,
              border: `1px solid ${palette.border}`,
              borderRadius: 999,
              padding: '6px 14px',
              fontSize: 13,
              color: palette.accent,
              marginBottom: 22,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: 4, background: palette.green }} />
            Powered by ORCA 6.0 interface capabilities
          </div>
          <h1
            style={{
              fontSize: 'clamp(30px, 6vw, 52px)',
              lineHeight: 1.08,
              margin: '0 auto 18px',
              maxWidth: 780,
              fontWeight: 800,
            }}
          >
            Move molecular models between packages{' '}
            <span style={{ color: palette.accent }}>without manual errors</span>
          </h1>
          <p
            style={{
              fontSize: 18,
              color: palette.sub,
              maxWidth: 620,
              margin: '0 auto 32px',
            }}
          >
            OrcaBridge pipes geometries, orbitals, and results directly between
            your quantum chemistry tools — so you can screen in one package and
            refine in another with zero re-formatting.
          </p>
          <a
            href="#demo"
            data-cta="start-migration"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: `linear-gradient(90deg, ${palette.accent}, ${palette.accent2})`,
              color: '#08111f',
              fontWeight: 700,
              fontSize: 17,
              padding: '15px 30px',
              borderRadius: 12,
              textDecoration: 'none',
              boxShadow: '0 8px 30px rgba(56,189,248,0.35)',
            }}
          >
            Try a live migration
            <ArrowIcon />
          </a>
          <div style={{ marginTop: 20, fontSize: 13, color: palette.sub }}>
            No install · Simulated bridge · 5 packages supported
          </div>
        </section>

        {/* Stat strip */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 14,
            marginBottom: 48,
          }}
        >
          {[
            { n: '0', l: 'data-loss events per transfer' },
            { n: '5×', l: 'faster than manual conversion' },
            { n: '5', l: 'supported QC packages' },
            { n: '100%', l: 'schema-verified fields' },
          ].map((s) => (
            <div
              key={s.l}
              style={{
                background: palette.panel,
                border: `1px solid ${palette.border}`,
                borderRadius: 14,
                padding: '18px 16px',
              }}
            >
              <div style={{ fontSize: 26, fontWeight: 800, color: palette.accent }}>{s.n}</div>
              <div style={{ fontSize: 13, color: palette.sub }}>{s.l}</div>
            </div>
          ))}
        </section>

        {/* Demo */}
        <section id="demo" style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, marginBottom: 6 }}>Build your migration pipeline</h2>
          <p style={{ color: palette.sub, marginTop: 0, marginBottom: 24 }}>
            Pick a source and destination package. OrcaBridge routes the model
            through ORCA 6.0 and preserves every field you keep.
          </p>

          {/* Pipeline visual */}
          <div
            style={{
              display: 'flex',
              alignItems: 'stretch',
              gap: 12,
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginBottom: 28,
            }}
          >
            <PkgPicker
              label="Source"
              value={source}
              onChange={setSource}
              disabledId={dest}
            />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ArrowIcon />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 130,
                background: `linear-gradient(160deg, ${palette.accent}, ${palette.accent2})`,
                borderRadius: 14,
                padding: '16px 12px',
                color: '#08111f',
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 999,
                  background: '#eef6ff',
                  display: 'grid',
                  placeItems: 'center',
                  marginBottom: 6,
                }}
              >
                <OrcaCore />
              </div>
              <strong style={{ fontSize: 15 }}>ORCA 6.0</strong>
              <span style={{ fontSize: 12 }}>Interop core</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ArrowIcon />
            </div>
            <PkgPicker
              label="Destination"
              value={dest}
              onChange={setDest}
              disabledId={source}
            />
          </div>

          {source === dest && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(251,191,36,0.12)',
                border: '1px solid rgba(251,191,36,0.4)',
                borderRadius: 10,
                padding: '10px 14px',
                color: palette.amber,
                marginBottom: 20,
                fontSize: 14,
              }}
            >
              <WarnIcon /> Source and destination must be different packages.
            </div>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
            }}
          >
            {/* Field mapping */}
            <div
              style={{
                background: palette.panel,
                border: `1px solid ${palette.border}`,
                borderRadius: 16,
                padding: 20,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: 14,
                }}
              >
                <h3 style={{ margin: 0, fontSize: 17 }}>Model fields</h3>
                <span style={{ fontSize: 13, color: palette.sub }}>
                  {keptCount}/{fields.length} kept
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {fields.map((f) => (
                  <label
                    key={f.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      background: palette.panel2,
                      borderRadius: 10,
                      padding: '10px 12px',
                      cursor: 'pointer',
                      opacity: f.kept ? 1 : 0.5,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={f.kept}
                      onChange={() => toggleField(f.key)}
                      style={{ width: 16, height: 16, accentColor: palette.accent }}
                    />
                    <span style={{ flex: 1, fontSize: 14 }}>{f.label}</span>
                    <span
                      style={{
                        fontSize: 12,
                        color: palette.accent,
                        fontFamily: 'monospace',
                      }}
                    >
                      {f.value}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Run panel */}
            <div
              style={{
                background: palette.panel,
                border: `1px solid ${palette.border}`,
                borderRadius: 16,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <h3 style={{ margin: '0 0 6px', fontSize: 17 }}>Transfer console</h3>
              <p style={{ margin: '0 0 16px', fontSize: 13, color: palette.sub }}>
                {srcPkg.name} → ORCA 6.0 → {destPkg.name}
              </p>

              <button
                onClick={runMigration}
                disabled={source === dest || status === 'running'}
                style={{
                  background:
                    source === dest || status === 'running'
                      ? palette.panel2
                      : `linear-gradient(90deg, ${palette.accent}, ${palette.accent2})`,
                  color: source === dest || status === 'running' ? palette.sub : '#08111f',
                  border: 'none',
                  borderRadius: 10,
                  padding: '12px 18px',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: source === dest || status === 'running' ? 'not-allowed' : 'pointer',
                  marginBottom: 16,
                }}
              >
                {status === 'running' ? 'Migrating…' : status === 'done' ? 'Run again' : 'Run migration'}
              </button>

              {/* progress */}
              <div
                style={{
                  height: 8,
                  borderRadius: 4,
                  background: palette.panel2,
                  overflow: 'hidden',
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${palette.accent}, ${palette.green})`,
                    transition: 'width 0.3s',
                  }}
                />
              </div>

              <div
                style={{
                  flex: 1,
                  minHeight: 150,
                  background: '#080e1c',
                  borderRadius: 10,
                  padding: 12,
                  fontFamily: 'monospace',
                  fontSize: 12.5,
                  color: palette.green,
                  overflowY: 'auto',
                }}
              >
                {logLines.length === 0 && (
                  <span style={{ color: palette.sub }}>$ awaiting migration…</span>
                )}
                {logLines.map((l, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 3 }}>
                    <span style={{ color: palette.accent }}>›</span>
                    <span style={{ color: l.includes('complete') ? palette.green : '#c9d4ea' }}>
                      {l}
                    </span>
                  </div>
                ))}
              </div>

              {status === 'done' && (
                <div
                  style={{
                    marginTop: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'rgba(52,211,153,0.12)',
                    border: '1px solid rgba(52,211,153,0.4)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    fontSize: 14,
                    color: palette.green,
                  }}
                >
                  <CheckIcon /> {keptCount} fields transferred · est. {savedHours}h of manual work saved
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, marginBottom: 24 }}>Why teams switch to OrcaBridge</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 18,
            }}
          >
            {[
              {
                t: 'Best method for each stage',
                d: 'Screen with a fast open-source package, then refine with high-precision coupled cluster — one molecular system, no re-entry.',
              },
              {
                t: 'Schema-verified transfers',
                d: 'Every field is mapped through ORCA 6.0’s interoperability layer and checksummed. No silent unit or basis-set drift.',
              },
              {
                t: 'Pipeline as an API',
                d: 'Wire OrcaBridge into high-throughput workflows with a standardized REST/CLI so results flow automatically overnight.',
              },
            ].map((c) => (
              <div
                key={c.t}
                style={{
                  background: palette.panel,
                  border: `1px solid ${palette.border}`,
                  borderRadius: 16,
                  padding: 22,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background: palette.panel2,
                    display: 'grid',
                    placeItems: 'center',
                    marginBottom: 14,
                  }}
                >
                  <CheckIcon color={palette.accent} />
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: 17 }}>{c.t}</h3>
                <p style={{ margin: 0, fontSize: 14.5, color: palette.sub }}>{c.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA footer */}
        <section
          style={{
            background: `linear-gradient(120deg, ${palette.panel2}, ${palette.panel})`,
            border: `1px solid ${palette.border}`,
            borderRadius: 20,
            padding: '40px 28px',
            textAlign: 'center',
            marginBottom: 40,
          }}
        >
          <h2 style={{ fontSize: 26, margin: '0 0 12px' }}>Stop babysitting file conversions</h2>
          <p style={{ color: palette.sub, maxWidth: 520, margin: '0 auto 24px' }}>
            Give your computational chemistry lab a lossless bridge between every
            package in your stack.
          </p>
          <a
            href="#demo"
            data-cta="start-migration-footer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: `linear-gradient(90deg, ${palette.accent}, ${palette.accent2})`,
              color: '#08111f',
              fontWeight: 700,
              fontSize: 16,
              padding: '14px 28px',
              borderRadius: 12,
              textDecoration: 'none',
            }}
          >
            Try the live migration
            <ArrowIcon />
          </a>
        </section>

        <footer
          style={{
            borderTop: `1px solid ${palette.border}`,
            padding: '22px 4px 40px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
            fontSize: 13,
            color: palette.sub,
          }}
        >
          <Logo />
          <span>OrcaBridge — interactive prototype. Simulated data for demonstration.</span>
        </footer>
      </div>
    </div>
  );
}

function PkgPicker({
  label,
  value,
  onChange,
  disabledId,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabledId: string;
}) {
  const pkg = PACKAGES.find((p) => p.id === value)!;
  return (
    <div
      style={{
        background: palette.panel,
        border: `1px solid ${palette.border}`,
        borderRadius: 14,
        padding: 16,
        minWidth: 200,
        flex: '1 1 200px',
        maxWidth: 260,
      }}
    >
      <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: palette.sub, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ width: 12, height: 12, borderRadius: 3, background: pkg.color }} />
        <strong style={{ fontSize: 16 }}>{pkg.name}</strong>
      </div>
      <div style={{ fontSize: 12.5, color: palette.sub, marginBottom: 12 }}>{pkg.strength}</div>
      <label style={{ fontSize: 12, color: palette.sub }}>
        Change package
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            marginTop: 6,
            background: palette.panel2,
            color: palette.text,
            border: `1px solid ${palette.border}`,
            borderRadius: 8,
            padding: '9px 10px',
            fontSize: 14,
          }}
        >
          {PACKAGES.map((p) => (
            <option key={p.id} value={p.id} disabled={p.id === disabledId}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
