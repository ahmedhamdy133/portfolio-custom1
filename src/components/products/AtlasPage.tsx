import React, { useState } from 'react';
import { ArrowLeft, Zap, Shield, Cpu, Activity, RotateCw, CheckCircle, ExternalLink } from 'lucide-react';
import { MagneticButton } from '../../utils/magnetic';
import { soundFx } from '../../utils/audio';
import { DemoBadge } from '../common/DemoBadge';
import { useCompanionRobot } from '../../companion/CompanionContext';

interface AtlasPageProps {
  onBackToHome: () => void;
}

export const AtlasPage: React.FC<AtlasPageProps> = ({ onBackToHome }) => {
  const { setPose } = useCompanionRobot();
  const [balanceTestActive, setBalanceTestActive] = useState(false);
  const [simAngle, setSimAngle] = useState(0);

  const handleTestBalance = () => {
    soundFx.playServo();
    setPose('lifting');
    setBalanceTestActive(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setSimAngle(Math.sin(step * 0.4) * 12);
      if (step > 20) {
        clearInterval(interval);
        setBalanceTestActive(false);
        setSimAngle(0);
        setPose('idle');
      }
    }, 100);
  };

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
              PRODUCT PLATFORM // ATLAS ELECTRIC HUMANOID
            </div>
            <DemoBadge label="Verified Specifications (2024)" verified={true} />
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--text-snow)', marginBottom: 16 }}>
            Atlas Humanoid Platform
          </h1>

          <p style={{ maxWidth: '780px', fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>
            Engineered from the ground up for commercial manufacturing applications. The all-new Atlas combines high-strength electric actuation with a broader range of motion than any biological human worker.
          </p>

          {/* Quick Hardware Metric Counters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
            <div className="glass-panel" style={{ padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>ACTUATION ARCHITECTURE</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#00D5FF' }}>Electric Cycloidal</div>
            </div>
            <div className="glass-panel" style={{ padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>RANGE OF MOTION</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text-snow)' }}>360° Infinite Joint Yaw</div>
            </div>
            <div className="glass-panel" style={{ padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>CONTROL FREQUENCY</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#00E699' }}>500 Hz Feedback MPC</div>
            </div>
            <div className="glass-panel" style={{ padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>PAYLOAD CAPACITY</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text-snow)' }}>Up to 50 kg Dynamic</div>
            </div>
          </div>
        </div>

        {/* Dynamic Balance Test Interactive Rig */}
        <div
          className="glass-panel blueprint-box"
          style={{
            padding: 32,
            marginBottom: 36,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-snow)' }}>
                Dynamic Momentum & Balance Stress Visualizer
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                Simulate sudden external lateral impact forces and observe whole-body inverse-dynamics self-correction.
              </p>
            </div>

            <button
              onClick={handleTestBalance}
              disabled={balanceTestActive}
              className="btn-cyber"
              style={{ padding: '10px 20px', fontSize: '12px' }}
            >
              <RotateCw size={16} />
              <span>{balanceTestActive ? 'STABILIZING...' : 'INJECT LATERAL FORCE'}</span>
            </button>
          </div>

          {/* Interactive Simulation SVG */}
          <div
            style={{
              height: '240px',
              backgroundColor: '#0B0F14',
              borderRadius: 6,
              border: '1px solid rgba(0, 213, 255, 0.25)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 600 240">
              {/* Floor */}
              <line x1="100" y1="200" x2="500" y2="200" stroke="#8E9AA8" strokeWidth="2" />
              
              {/* Robot Inverted Pendulum Rig */}
              <g
                transform={`translate(300, 200) rotate(${simAngle})`}
                style={{ transition: 'transform 0.08s ease-out' }}
              >
                {/* Contact feet */}
                <rect x="-30" y="-10" width="60" height="10" fill="#00D5FF" />
                {/* Legs */}
                <line x1="-15" y1="-10" x2="-10" y2="-90" stroke="#8E9AA8" strokeWidth="8" strokeLinecap="round" />
                <line x1="15" y1="-10" x2="10" y2="-90" stroke="#8E9AA8" strokeWidth="8" strokeLinecap="round" />
                {/* Pelvis & Torso */}
                <rect x="-25" y="-150" width="50" height="60" rx="6" fill="#182332" stroke="#00D5FF" strokeWidth="2" />
                {/* Head ring */}
                <circle cx="0" cy="-170" r="14" fill="#0B0F14" stroke="#00D5FF" strokeWidth="2" />
                <circle cx="0" cy="-170" r="6" fill="#00D5FF" />
                {/* Arms */}
                <line x1="-25" y1="-140" x2="-45" y2="-90" stroke="#8E9AA8" strokeWidth="6" strokeLinecap="round" />
                <line x1="25" y1="-140" x2="45" y2="-90" stroke="#8E9AA8" strokeWidth="6" strokeLinecap="round" />
              </g>

              {/* Reaction Force Vector Arrows */}
              {balanceTestActive && (
                <g>
                  <line x1="300" y1="90" x2={300 - simAngle * 8} y2="90" stroke="#FF3B5C" strokeWidth="3" />
                  <polygon
                    points={`${300 - simAngle * 8},85 ${300 - simAngle * 8 - 10},90 ${300 - simAngle * 8},95`}
                    fill="#FF3B5C"
                  />
                  <text x="300" y="75" fill="#FF3B5C" fontSize="11" fontFamily="monospace" textAnchor="middle">
                    RECOVERY MOMENTUM: {(simAngle * 14).toFixed(0)} N·m
                  </text>
                </g>
              )}
            </svg>

            <div
              style={{
                position: 'absolute',
                bottom: 12,
                left: 16,
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: balanceTestActive ? '#FF3B5C' : '#00E699',
              }}
            >
              STATE: {balanceTestActive ? 'REACTIVE RECOVERY IN PROGRESS' : 'HOMEOSTATIC BALANCE [LOCKED]'}
            </div>
          </div>
        </div>

        {/* Detailed Specifications Table */}
        <div className="glass-panel" style={{ padding: 32 }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-snow)', marginBottom: 20 }}>
            DOCUMENTED TECHNICAL ARCHITECTURE
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00D5FF', marginBottom: 6 }}>
                VISION & PERCEPTION
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-snow)', lineHeight: 1.6 }}>
                Head turret features dual 4K stereoscopic cameras with dynamic exposure adjustment and solid-state LiDAR, generating real-time point clouds for spatial grasping.
              </p>
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00D5FF', marginBottom: 6 }}>
                UNRESTRICTED MANIPULATION
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-snow)', lineHeight: 1.6 }}>
                Every joint is capable of 360-degree rotation without cable winding limitations, allowing Atlas to turn around its torso and walk in reverse without turning its hips.
              </p>
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00D5FF', marginBottom: 6 }}>
                INDUSTRIAL SAFETY RATING
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-snow)', lineHeight: 1.6 }}>
                Certified to ISO 10218-1 and ISO/TS 15066 collaborative robot standards. Includes hardware contact force sensing and dual emergency stop stop-circuit loops.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
