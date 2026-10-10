import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Play, ShieldCheck, Activity, Eye } from 'lucide-react';
import { SplitTextReveal } from '../../../utils/splitText';
import { MagneticButton } from '../../../utils/magnetic';
import { useCompanionRobot } from '../../../companion/CompanionContext';
import { CompanionPose } from '../../../companion/unit01.types';
import { soundFx } from '../../../utils/audio';

interface HeroSectionProps {
  onExploreProducts: () => void;
  onDiscoverTech: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreProducts,
  onDiscoverTech,
}) => {
  const { currentPose, setPose } = useCompanionRobot();
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const poses: { id: CompanionPose; label: string }[] = [
    { id: 'idle', label: '01 IDLE' },
    { id: 'scanning', label: '02 RADAR SCAN' },
    { id: 'lifting', label: '03 PAYLOAD LIFT' },
    { id: 'console-typing', label: '04 TELEMETRY OPS' },
    { id: 'alert', label: '05 HIGH ALERT' },
  ];

  return (
    <section
      ref={containerRef}
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: 'calc(var(--header-height) + 40px)',
        paddingBottom: '80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Mouse-reactive Dynamic Spotlight Glow */}
      <div
        style={{
          position: 'absolute',
          top: `${mousePos.y * 100}%`,
          left: `${mousePos.x * 100}%`,
          width: '600px',
          height: '600px',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(0, 213, 255, 0.12) 0%, rgba(0, 213, 255, 0.02) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'top 0.2s ease-out, left 0.2s ease-out',
        }}
      />

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Top Blueprint Badge */}
        <div style={{ marginBottom: 20 }}>
          <div className="telemetry-badge">
            <span className="dot" />
            AUTONOMOUS KINEMATICS FRAMEWORK // STAGE 01
          </div>
        </div>

        {/* Main Headline */}
        <div style={{ maxWidth: '960px', marginBottom: 24 }}>
          <SplitTextReveal
            tag="h1"
            stagger={0.03}
            delay={0.2}
            scrollTriggered={false}
            className="hero-headline"
          >
            Engineering Beyond Limits
          </SplitTextReveal>
        </div>

        {/* Cinematic Subtitle */}
        <p
          style={{
            maxWidth: '640px',
            fontSize: '1.2rem',
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            marginBottom: '40px',
          }}
        >
          Architecting the next generation of dynamic mobility, whole-body balance, and intelligent industrial manipulation. Powered by real-time reactive inverse kinematics.
        </p>

        {/* Interactive Action CTAs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center',
            marginBottom: '64px',
          }}
        >
          <MagneticButton strength={0.25}>
            <button
              onClick={onExploreProducts}
              className="btn-cyber"
              aria-label="Explore Robotic Platforms"
            >
              <span>Explore Products</span>
              <ArrowRight size={18} />
            </button>
          </MagneticButton>

          <MagneticButton strength={0.25}>
            <button
              onClick={onDiscoverTech}
              className="btn-cyber-outline"
              aria-label="Discover Core Technology"
            >
              <Activity size={18} />
              <span>Discover Technology</span>
            </button>
          </MagneticButton>
        </div>

        {/* UNIT-01 Pose Control Panel (Interactive Demo Component) */}
        <div
          className="glass-panel blueprint-box"
          style={{
            padding: '20px 24px',
            maxWidth: '760px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Eye size={16} color="#00D5FF" />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  color: 'var(--text-snow)',
                  fontWeight: 600,
                }}
              >
                LIVE COMPANION RIG // UNIT-01 POSE DIRECTORY
              </span>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: '#00D5FF',
              }}
            >
              STATUS: ONLINE
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {poses.map((p) => {
              const active = currentPose === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setPose(p.id);
                    soundFx.playServo();
                  }}
                  style={{
                    padding: '8px 14px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    borderRadius: 4,
                    border: active ? '1px solid #00D5FF' : '1px solid var(--border-subtle)',
                    backgroundColor: active ? 'rgba(0, 213, 255, 0.15)' : 'rgba(11, 15, 20, 0.6)',
                    color: active ? '#00D5FF' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  aria-pressed={active}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Hardware Telemetry Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 20,
            marginTop: 48,
            paddingTop: 24,
            borderTop: '1px solid rgba(142, 154, 168, 0.15)',
          }}
        >
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>CONTROL FREQUENCY</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#00D5FF' }}>500 Hz</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>IK RESPONSE TIME</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-snow)' }}>&lt; 0.4 ms</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>DEGREES OF FREEDOM</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-snow)' }}>28+ DOF</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>INGRESS PROTECTION</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#00E699' }}>IP67 SEALED</div>
          </div>
        </div>
      </div>
    </section>
  );
};
