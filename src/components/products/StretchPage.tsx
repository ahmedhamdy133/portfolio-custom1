import React, { useState } from 'react';
import { ArrowLeft, Box, CheckCircle, Zap, Shield, RotateCw, ExternalLink } from 'lucide-react';
import { MagneticButton } from '../../utils/magnetic';
import { soundFx } from '../../utils/audio';
import { DemoBadge } from '../common/DemoBadge';

interface StretchPageProps {
  onBackToHome: () => void;
}

const STEPS = [
  { step: '01', title: 'Perception Box Pose Estimation', desc: 'Custom vision system scans carton stack top and estimates 3D orientation in 50ms, handling irregular box skews and taping seams.' },
  { step: '02', title: 'Smart Suction Array Gripping', desc: 'High-flow vacuum cup array activates individual zones to securely latch onto carton surface without puncturing or tearing cardboard.' },
  { step: '03', title: 'Omnidirectional Pivot Retraction', desc: 'Compact mobile base stays firmly grounded using dynamic counterweight mass while the 7-axis arm pivots 90 degrees smoothly.' },
  { step: '04', title: 'Conveyor Pallet Transfer', desc: 'Deposits carton gently onto take-away telescoping conveyor at an uninterrupted rate of up to 800 cartons per hour.' },
];

export const StretchPage: React.FC<StretchPageProps> = ({ onBackToHome }) => {
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  return (
    <div style={{ paddingTop: 'calc(var(--header-height) + 32px)', paddingBottom: '80px', minHeight: '100vh' }}>
      <div className="section-container">
        {/* Back Button */}
        <div style={{ marginBottom: 24 }}>
          <MagneticButton strength={0.2}>
            <button
              onClick={() => { onBackToHome(); soundFx.playClick(); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 4,
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'rgba(18, 27, 38, 0.6)',
                color: '#00D5FF',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={16} />
              <span>RETURN TO MAIN OVERVIEW</span>
            </button>
          </MagneticButton>
        </div>

        {/* Hero Banner */}
        <div
          className="glass-panel blueprint-box"
          style={{
            padding: '48px 36px',
            marginBottom: 36,
            background: 'linear-gradient(135deg, rgba(18, 27, 38, 0.9) 0%, rgba(11, 15, 20, 0.95) 100%)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            <div className="telemetry-badge">
              <span className="dot" />
              PRODUCT PLATFORM // STRETCH WAREHOUSE LOGISTICS
            </div>
            <DemoBadge label="Verified Commercial Logistics Specs" verified={true} />
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--text-snow)', marginBottom: 16 }}>
            Stretch Mobile Box Handler
          </h1>

          <p style={{ maxWidth: '780px', fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>
            Engineered exclusively to automate box handling in warehouse receiving docks. Stretch drives directly into trailers and shipping containers to unpack floor-loaded merchandise without costly facility modifications.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
            <div className="glass-panel" style={{ padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>CASE THROUGHPUT</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#00D5FF' }}>Up to 800 Cases / Hr</div>
            </div>
            <div className="glass-panel" style={{ padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>MAX PAYLOAD</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text-snow)' }}>23 kg (50 lbs)</div>
            </div>
            <div className="glass-panel" style={{ padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>ARM EXTENSION REACH</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#00E699' }}>Over 3 Meters Reach</div>
            </div>
            <div className="glass-panel" style={{ padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>BATTERY ENDURANCE</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text-snow)' }}>Up to 16 Hours (LFP)</div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Interactive Work Sequence Flow */}
        <div className="glass-panel blueprint-box" style={{ padding: 32 }}>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-snow)', marginBottom: 8 }}>
            Autonomous Case Unloading Sequence Flow
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: 24 }}>
            Click each step in the autonomous work cycle to understand how Stretch perceives, grips, and moves cartons without human intervention.
          </p>

          {/* Step buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 28 }}>
            {STEPS.map((s, idx) => {
              const active = activeStepIdx === idx;
              return (
                <button
                  key={s.step}
                  onClick={() => { setActiveStepIdx(idx); soundFx.playClick(); }}
                  style={{
                    padding: 16,
                    borderRadius: 4,
                    textAlign: 'left',
                    border: active ? '1px solid #00D5FF' : '1px solid var(--border-subtle)',
                    backgroundColor: active ? 'rgba(0, 213, 255, 0.12)' : 'rgba(11, 15, 20, 0.6)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  aria-pressed={active}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: active ? '#00D5FF' : 'var(--text-secondary)', marginBottom: 4 }}>
                    PHASE {s.step}
                  </div>
                  <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.1rem', color: 'var(--text-snow)', fontWeight: 600 }}>
                    {s.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Step Explainer Card */}
          <div
            style={{
              padding: 24,
              backgroundColor: 'rgba(11, 15, 20, 0.7)',
              border: '1px solid rgba(0, 213, 255, 0.3)',
              borderRadius: 6,
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00D5FF', marginBottom: 6 }}>
              ACTIVE WORK CYCLE DETAILS // PHASE {STEPS[activeStepIdx].step}
            </div>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-snow)', lineHeight: 1.7 }}>
              {STEPS[activeStepIdx].desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
