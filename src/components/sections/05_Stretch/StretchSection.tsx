import React, { useState, useEffect, useRef } from 'react';
import { SectionHeader } from '../../common/SectionHeader';
import { DemoBadge } from '../../common/DemoBadge';
import { soundFx } from '../../../utils/audio';
import { Box, ArrowRight, Play, Pause, RotateCcw } from 'lucide-react';

export const StretchSection: React.FC = () => {
  const [cycleProgress, setCycleProgress] = useState(0); // 0 to 100
  const [isPlaying, setIsPlaying] = useState(false);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    let lastTime = performance.now();
    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      setCycleProgress((prev) => {
        const next = prev + dt * 18; // ~5.5s full cycle
        if (next >= 100) return 0;
        return next;
      });

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying]);

  // Derived telemetry based on scrub progress
  let phaseName = '01 // INCOMING BOX REGISTRATION';
  let vacuumKPa = 0;
  let armExtensionM = 0.4;
  let armAngle = 0;
  let boxY = 220;
  let boxX = 180;
  let boxGripped = false;

  if (cycleProgress < 25) {
    phaseName = '01 // PERCEPTION SCAN & POSE ESTIMATION';
    vacuumKPa = 12;
    armExtensionM = 0.4 + (cycleProgress / 25) * 0.8;
    armAngle = (cycleProgress / 25) * 15;
    boxX = 180;
    boxY = 220;
    boxGripped = false;
  } else if (cycleProgress < 50) {
    phaseName = '02 // SMART VACUUM SUCTION ENGAGEMENT';
    const sub = (cycleProgress - 25) / 25;
    vacuumKPa = 12 + sub * 72; // up to 84 kPa
    armExtensionM = 1.2;
    armAngle = 15;
    boxX = 180;
    boxY = 220;
    boxGripped = true;
  } else if (cycleProgress < 75) {
    phaseName = '03 // 90° OMNIDIRECTIONAL PIVOT & RETRACTION';
    const sub = (cycleProgress - 50) / 25;
    vacuumKPa = 84;
    armExtensionM = 1.2 - sub * 0.5;
    armAngle = 15 + sub * 75; // pivot from 15 deg to 90 deg
    boxX = 180 + sub * 320;
    boxY = 220 - Math.sin(sub * Math.PI) * 70;
    boxGripped = true;
  } else {
    phaseName = '04 // PRECISION PALLET RE-DEPOSITION';
    const sub = (cycleProgress - 75) / 25;
    vacuumKPa = Math.max(0, 84 - sub * 84);
    armExtensionM = 0.7 - sub * 0.3;
    armAngle = 90;
    boxX = 500;
    boxY = 220;
    boxGripped = false;
  }

  return (
    <section
      id="stretch"
      style={{
        padding: 'var(--section-padding) 0',
        backgroundColor: 'var(--bg-graphite)',
        position: 'relative',
      }}
    >
      <div className="section-container">
        <SectionHeader
          number="SEC_05"
          category="Warehouse Logistics"
          title="Industrial Automation"
          subtitle="Motion-driven case unloading cycle: Stretch handles up to 800 cases per hour with intelligent suction gripping and real-time obstacle avoidance."
          badge={<DemoBadge label="Public Logistics Metrics" verified={true} />}
        />

        {/* Interactive Scrub Control Console */}
        <div
          className="glass-panel blueprint-box"
          style={{
            padding: 32,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <div>
              <div className="telemetry-badge">
                <span className="dot" />
                WORK CYCLE SCRUBBER // {Math.round(cycleProgress)}% COMPLETE
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  color: '#00D5FF',
                  marginTop: 8,
                  fontWeight: 600,
                }}
              >
                {phaseName}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => {
                  setIsPlaying(!isPlaying);
                  soundFx.playClick();
                }}
                className="btn-cyber"
                style={{ padding: '8px 16px', fontSize: '12px' }}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                <span>{isPlaying ? 'PAUSE CYCLE' : 'AUTO RUN CYCLE'}</span>
              </button>

              <button
                onClick={() => {
                  setCycleProgress(0);
                  soundFx.playClick();
                }}
                className="btn-cyber-outline"
                style={{ padding: '8px 14px', fontSize: '12px' }}
                title="Reset Cycle"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Interactive Scrub Slider */}
          <div style={{ marginBottom: 24 }}>
            <input
              type="range"
              min="0"
              max="100"
              step="0.5"
              value={cycleProgress}
              onChange={(e) => {
                setCycleProgress(parseFloat(e.target.value));
                setIsPlaying(false);
              }}
              style={{
                width: '100%',
                accentColor: '#00D5FF',
                cursor: 'pointer',
                height: 6,
              }}
              aria-label="Scrub work cycle progress"
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--text-secondary)',
                marginTop: 6,
              }}
            >
              <span>0% ARRIVAL</span>
              <span>25% VISION SCAN</span>
              <span>50% SUCTION ENGAGE</span>
              <span>75% OMNI PIVOT</span>
              <span>100% PALLET PLACEMENT</span>
            </div>
          </div>

          {/* Warehouse Work-Cell Vector Visualizer */}
          <div
            style={{
              height: '320px',
              backgroundColor: '#0B0F14',
              borderRadius: 6,
              border: '1px solid rgba(0, 213, 255, 0.25)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <svg
              style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
              viewBox="0 0 800 320"
            >
              {/* Warehouse Floor Guides */}
              <line x1="0" y1="260" x2="800" y2="260" stroke="#182332" strokeWidth="4" />
              <line x1="120" y1="260" x2="240" y2="260" stroke="#00D5FF" strokeWidth="3" />
              <line x1="480" y1="260" x2="620" y2="260" stroke="#00E699" strokeWidth="3" />

              {/* Inbound Truck Conveyor */}
              <rect x="80" y="220" width="160" height="40" fill="#121B26" stroke="#8E9AA8" strokeWidth="1.5" />
              <text x="160" y="245" fill="#8E9AA8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                INBOUND CONVEYOR
              </text>

              {/* Destination Outbound Pallet */}
              <rect x="460" y="220" width="160" height="40" fill="#121B26" stroke="#00E699" strokeWidth="1.5" />
              <text x="540" y="245" fill="#00E699" fontSize="10" fontFamily="monospace" textAnchor="middle">
                OUTBOUND PALLET
              </text>

              {/* Stretch Base Rig (Center-Left) */}
              <g transform="translate(320, 160)">
                {/* Mobile base */}
                <rect x="-30" y="70" width="60" height="30" rx="4" fill="#182332" stroke="#00D5FF" strokeWidth="2" />
                {/* Wheels */}
                <circle cx="-20" cy="100" r="8" fill="#0B0F14" stroke="#8E9AA8" strokeWidth="2" />
                <circle cx="20" cy="100" r="8" fill="#0B0F14" stroke="#8E9AA8" strokeWidth="2" />
                {/* Vertical Mast */}
                <rect x="-6" y="-30" width="12" height="100" fill="#222c3a" stroke="#8E9AA8" strokeWidth="1.5" />
                {/* Perception Turret atop mast */}
                <circle cx="0" cy="-35" r="10" fill="#0B0F14" stroke="#00D5FF" strokeWidth="2" />
                {/* Arm Carriage */}
                <rect x="-10" y="10" width="20" height="25" rx="3" fill="#00D5FF" />
                {/* Extending Robotic Arm Link */}
                <line
                  x1="0"
                  y1="22"
                  x2={Math.cos((armAngle * Math.PI) / 180) * (armExtensionM * 140)}
                  y2={22 - Math.sin((armAngle * Math.PI) / 180) * 30}
                  stroke="#E9F1F8"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Smart Suction Gripper Array */}
                <circle
                  cx={Math.cos((armAngle * Math.PI) / 180) * (armExtensionM * 140)}
                  cy={22 - Math.sin((armAngle * Math.PI) / 180) * 30}
                  r="12"
                  fill="#121B26"
                  stroke="#00D5FF"
                  strokeWidth="3"
                />
              </g>

              {/* Dynamic Moving Package Box */}
              <g transform={`translate(${boxX - 25}, ${boxY - 25})`}>
                <rect
                  x="0"
                  y="0"
                  width="50"
                  height="45"
                  rx="3"
                  fill={boxGripped ? 'rgba(0, 213, 255, 0.3)' : '#182332'}
                  stroke={boxGripped ? '#00D5FF' : '#8E9AA8'}
                  strokeWidth="2"
                />
                <text x="25" y="26" fill="#E9F1F8" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  SKU-892
                </text>
              </g>
            </svg>

            {/* In-canvas telemetry badge */}
            <div
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                backgroundColor: 'rgba(11, 15, 20, 0.85)',
                padding: '10px 14px',
                borderRadius: 4,
                border: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <div>VACUUM PRESSURE: <span style={{ color: vacuumKPa > 50 ? '#00E699' : '#8E9AA8' }}>{vacuumKPa.toFixed(1)} kPa</span></div>
              <div>ARM REACH: <span style={{ color: '#00D5FF' }}>{armExtensionM.toFixed(2)} m</span></div>
              <div>BOX MASS: <span style={{ color: '#E9F1F8' }}>14.2 kg [VERIFIED]</span></div>
            </div>
          </div>

          {/* Key Production Throughput Specifications */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
              marginTop: 24,
            }}
          >
            <div className="glass-panel" style={{ padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>
                UNLOAD THROUGHPUT
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#00D5FF' }}>
                Up to 800 Cases / Hr
              </div>
            </div>

            <div className="glass-panel" style={{ padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>
                MAX PAYLOAD CAPABILITY
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text-snow)' }}>
                23 kg (50 lbs)
              </div>
            </div>

            <div className="glass-panel" style={{ padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>
                CONTINUOUS RUNTIME
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#00E699' }}>
                Up to 16 Hours (LFP)
              </div>
            </div>

            <div className="glass-panel" style={{ padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>
                AUTONOMY FOOTPRINT
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text-snow)' }}>
                Single Pallet Width
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
