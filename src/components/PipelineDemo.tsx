import React, { useState, useEffect } from 'react';

type JobStatus = 'queued' | 'converting' | 'completed' | 'failed';

interface Job {
  id: string;
  source: string;
  target: string;
  molecule: string;
  method: string;
  status: JobStatus;
  progress: number;
  time: string;
}

const INITIAL_JOBS: Job[] = [
  { id: 'JB-1024', source: 'Gaussian 16', target: 'ORCA 6.0', molecule: 'Benzene (C6H6)', method: 'DFT (B3LYP/6-31G*)', status: 'completed', progress: 100, time: '2m ago' },
  { id: 'JB-1023', source: 'Q-Chem 6', target: 'ORCA 6.0', molecule: 'Caffeine (C8H10N4O2)', method: 'MP2/cc-pVTZ', status: 'completed', progress: 100, time: '15m ago' },
  { id: 'JB-1022', source: 'PySCF 2.4', target: 'ORCA 6.0', molecule: 'Sildenafil (C22H30N6O4S)', method: 'CCSD(T)/aug-cc-pVDZ', status: 'failed', progress: 34, time: '1h ago' },
];

export default function PipelineDemo() {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [source, setSource] = useState('Gaussian 16');
  const [molecule, setMolecule] = useState('Ritonavir (C37H48N6O5S2)');
  const [method, setMethod] = useState('DFT (B3LYP/6-31G*)');
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeJobId) return;
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress = Math.min(currentProgress + Math.floor(Math.random() * 15) + 8, 100);
      setJobs((prev) =>
        prev.map((j) =>
          j.id === activeJobId
            ? { ...j, status: currentProgress >= 100 ? ('completed' as JobStatus) : ('converting' as JobStatus), progress: currentProgress }
            : j
        )
      );
      if (currentProgress >= 100) {
        clearInterval(interval);
        setActiveJobId(null);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [activeJobId]);

  const runBridge = () => {
    if (activeJobId) return;
    const id = `JB-${1000 + jobs.length + 1}`;
    const newJob: Job = {
      id,
      source,
      target: 'ORCA 6.0',
      molecule,
      method,
      status: 'queued',
      progress: 0,
      time: 'Just now',
    };
    setJobs((prev) => [newJob, ...prev]);
    setActiveJobId(id);
  };

  return (
    <section style={{ padding: '64px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Live Pipeline</h2>
      <p style={{ fontSize: '16px', color: '#475569', marginBottom: '32px' }}>Build a multi-software workflow and watch the bridge automate data migration.</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 340px', maxWidth: '420px', background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>New Bridge Job</h3>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="source" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Source Package</label>
            <select id="source" value={source} onChange={(e) => setSource(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', background: '#fff' }}>
              <option>Gaussian 16</option>
              <option>Q-Chem 6</option>
              <option>PySCF 2.4</option>
              <option>NWChem 7</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="target" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Target Package</label>
            <input id="target" readOnly value="ORCA 6.0" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', background: '#f1f5f9', color: '#0f172a' }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="molecule" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Molecule</label>
            <select id="molecule" value={molecule} onChange={(e) => setMolecule(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', background: '#fff' }}>
              <option>Benzene (C6H6)</option>
              <option>Caffeine (C8H10N4O2)</option>
              <option>Sildenafil (C22H30N6O4S)</option>
              <option>Ritonavir (C37H48N6O5S2)</option>
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="method" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Method / Basis Set</label>
            <select id="method" value={method} onChange={(e) => setMethod(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', background: '#fff' }}>
              <option>DFT (B3LYP/6-31G*)</option>
              <option>MP2/cc-pVTZ</option>
              <option>CCSD(T)/aug-cc-pVDZ</option>
              <option>Semi-empirical (AM1)</option>
            </select>
          </div>

          <button
            onClick={runBridge}
            disabled={!!activeJobId}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              background: activeJobId ? '#cbd5e1' : '#0d9488',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 600,
              cursor: activeJobId ? 'not-allowed' : 'pointer',
            }}
          >
            {activeJobId ? 'Running Bridge...' : 'Run Bridge'}
          </button>
        </div>

        <div style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {jobs.map((job) => (
            <div key={job.id} style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px' }}>{job.id}</span>
                  <span style={{ fontSize: '15px', fontWeight: 600 }}>{job.molecule}</span>
                </div>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>{job.time}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#475569', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span>{job.source}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#94a3b8' }}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{job.target}</span>
                <span style={{ marginLeft: '8px', padding: '2px 8px', borderRadius: '4px', background: '#eef2ff', color: '#4f46e5', fontSize: '12px', fontWeight: 600 }}>{job.method}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ flex: 1, height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${job.progress}%`, height: '100%', background: job.status === 'failed' ? '#ef4444' : '#0d9488', borderRadius: '4px', transition: 'width 0.3s ease' }} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: job.status === 'failed' ? '#ef4444' : job.status === 'completed' ? '#0d9488' : '#4f46e5', minWidth: '80px', textAlign: 'right' }}>
                  {job.status === 'converting' ? `${job.progress}%` : job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </span>
              </div>
              {job.status === 'failed' && (
                <p style={{ marginTop: '8px', fontSize: '13px', color: '#ef4444' }}>Error: Incompatible basis set mapping for {job.method}. Auto-remediation suggested.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
