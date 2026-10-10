import React, { useState } from 'react';
import { ArrowLeft, Shield, Eye, Camera, Activity, Radio, ExternalLink } from 'lucide-react';
import { MagneticButton } from '../../utils/magnetic';
import { soundFx } from '../../utils/audio';
import { DemoBadge } from '../common/DemoBadge';
import { useCompanionRobot } from '../../companion/CompanionContext';

interface SpotPageProps {
  onBackToHome: () => void;
}

export const SpotPage: React.FC<SpotPageProps> = ({ onBackToHome }) => {
  const { setPose } = useCompanionRobot();
  const [activeGait, setActiveGait] = useState<'trot' | 'crawl' | 'stair'>('trot');
  const [thermalFeedActive, setThermalFeedActive] = useState(false);

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
              PRODUCT PLATFORM // SPOT INDUSTRIAL QUADRUPED
            </div>
            <DemoBadge label="Verified Field Specifications" verified={true} />
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--text-snow)', marginBottom: 16 }}>
            Spot Autonomous Quadruped
          </h1>

          <p style={{ maxWidth: '780px', fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>
            The benchmark mobile robot for industrial plant inspection, hazardous environments, and autonomous data capture. Spot navigates gravel, grating, stairs, and confined terrain where wheeled robots get stuck.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
            <div className="glass-panel" style={{ padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>MAX SPEED</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#00D5FF' }}>1.6 m/s (5.7 km/h)</div>
            </div>
            <div className="glass-panel" style={{ padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>INGRESS PROTECTION</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#00E699' }}>IP67 Sealed</div>
            </div>
            <div className="glass-panel" style={{ padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>PAYLOAD CAPACITY</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text-snow)' }}>14 kg Continuous</div>
            </div>
            <div className="glass-panel" style={{ padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>OPERATING TEMP</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text-snow)' }}>-20°C to +45°C</div>
            </div>
          </div>
        </div>

        {/* Interactive Gait Mode & Sensor Simulator */}
        <div className="glass-panel blueprint-box" style={{ padding: 32, marginBottom: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-snow)' }}>
                Autonomous Gait Mode & Sensor Feed Simulator
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                Switch dynamic terrain gait algorithms and toggle radiometric infrared thermal camera inspection overlay.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => { setActiveGait('trot'); soundFx.playServo(); }}
                style={{
                  padding: '8px 14px',
                  borderRadius: 4,
                  border: activeGait === 'trot' ? '1px solid #00D5FF' : '1px solid var(--border-subtle)',
                  backgroundColor: activeGait === 'trot' ? 'rgba(0, 213, 255, 0.15)' : 'rgba(11, 15, 20, 0.6)',
                  color: activeGait === 'trot' ? '#00D5FF' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                TROT GAIT (NORMAL)
              </button>
              <button
                onClick={() => { setActiveGait('crawl'); soundFx.playServo(); }}
                style={{
                  padding: '8px 14px',
                  borderRadius: 4,
                  border: activeGait === 'crawl' ? '1px solid #00D5FF' : '1px solid var(--border-subtle)',
                  backgroundColor: activeGait === 'crawl' ? 'rgba(0, 213, 255, 0.15)' : 'rgba(11, 15, 20, 0.6)',
                  color: activeGait === 'crawl' ? '#00D5FF' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                CRAWL GAIT (SLIPPERY)
              </button>
              <button
                onClick={() => { setActiveGait('stair'); soundFx.playServo(); }}
                style={{
                  padding: '8px 14px',
                  borderRadius: 4,
                  border: activeGait === 'stair' ? '1px solid #00D5FF' : '1px solid var(--border-subtle)',
                  backgroundColor: activeGait === 'stair' ? 'rgba(0, 213, 255, 0.15)' : 'rgba(11, 15, 20, 0.6)',
                  color: activeGait === 'stair' ? '#00D5FF' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                STAIR-CLIMB MODE
              </button>
            </div>
          </div>

          {/* Interactive Inspection Canvas */}
          <div
            style={{
              height: '260px',
              backgroundColor: '#0B0F14',
              borderRadius: 6,
              border: '1px solid rgba(0, 213, 255, 0.25)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Visual Screen */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: thermalFeedActive
                  ? 'radial-gradient(circle at 70% 40%, rgba(255, 59, 92, 0.4) 0%, rgba(255, 179, 0, 0.2) 30%, rgba(18, 27, 38, 0.9) 70%)'
                  : 'radial-gradient(circle at 50% 50%, rgba(0, 213, 255, 0.08) 0%, rgba(11, 15, 20, 0.95) 80%)',
                transition: 'background 0.4s ease',
              }}
            />

            <svg style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} viewBox="0 0 600 240">
              {/* Floor */}
              <line x1="0" y1="180" x2="600" y2="180" stroke="#8E9AA8" strokeWidth="2" />
              {/* Spot Body Illustration */}
              <g transform="translate(240, 110)">
                <rect x="0" y="20" width="110" height="40" rx="8" fill="#182332" stroke="#00D5FF" strokeWidth="2" />
                <rect x="15" y="26" width="80" height="8" fill="#FFB300" />
                {/* Legs animated via gait */}
                <line x1="20" y1="60" x2={activeGait === 'trot' ? 10 : 15} y2="90" stroke="#8E9AA8" strokeWidth="6" strokeLinecap="round" />
                <line x1="90" y1="60" x2={activeGait === 'trot' ? 100 : 95} y2="90" stroke="#8E9AA8" strokeWidth="6" strokeLinecap="round" />
                <circle cx="105" cy="35" r="5" fill="#00D5FF" />
              </g>

              {/* Substation Breaker Box Target */}
              <g transform="translate(420, 60)">
                <rect x="0" y="0" width="80" height="120" fill="#121B26" stroke="#00E699" strokeWidth="1.5" />
                <circle cx="40" cy="50" r="16" fill={thermalFeedActive ? '#FF3B5C' : '#00E699'} />
                <text x="40" y="105" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  {thermalFeedActive ? 'TEMP: 84.6°C [HOT]' : 'TEMP: 42.1°C [NORM]'}
                </text>
              </g>
            </svg>

            {/* Toggle Thermal Button */}
            <div style={{ position: 'absolute', top: 16, right: 16 }}>
              <button
                onClick={() => { setThermalFeedActive(!thermalFeedActive); soundFx.playClick(); }}
                className="btn-cyber"
                style={{ padding: '8px 14px', fontSize: '11px' }}
              >
                <Camera size={14} />
                <span>{thermalFeedActive ? 'RGB COLOR STREAM' : 'FLIR THERMAL RADIOMETRIC'}</span>
              </button>
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: 12,
                left: 16,
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: '#00D5FF',
              }}
            >
              ACTIVE GAIT: {activeGait.toUpperCase()} // GROUND REACTION SLIP PREVENTION: ACTIVE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
