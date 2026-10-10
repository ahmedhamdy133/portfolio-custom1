import React, { useState } from 'react';
import { Volume2, VolumeX, Cpu, Activity, Zap, Compass } from 'lucide-react';
import { soundFx } from '../../utils/audio';
import { useCompanionRobot } from '../../companion/CompanionContext';
import { MagneticButton } from '../../utils/magnetic';

export type ViewRoute = 'home' | 'atlas' | 'spot' | 'stretch' | 'orbit' | 'mission-control' | 'lab';

interface HeaderProps {
  currentView: ViewRoute;
  onNavigate: (view: ViewRoute, sectionId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const [muted, setMuted] = useState(() => soundFx.isMuted());
  const { enabled, toggleEnabled, lowPowerMode, toggleLowPowerMode } = useCompanionRobot();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMuteToggle = () => {
    const isMuted = soundFx.toggleMute();
    setMuted(isMuted);
  };

  const navItems: { label: string; view: ViewRoute; targetSec?: string }[] = [
    { label: 'Overview', view: 'home', targetSec: '#hero' },
    { label: 'Atlas', view: 'atlas', targetSec: '#atlas' },
    { label: 'Spot', view: 'spot', targetSec: '#spot' },
    { label: 'Stretch', view: 'stretch', targetSec: '#stretch' },
    { label: 'Orbit Fleet', view: 'orbit', targetSec: '#connected' },
    { label: 'Mission Ops', view: 'mission-control', targetSec: '#mission' },
    { label: 'Innovation Lab', view: 'lab', targetSec: '#lab' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--header-height)',
        backgroundColor: 'rgba(11, 15, 20, 0.82)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(142, 154, 168, 0.15)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        className="section-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        {/* Brand Mark */}
        <button
          onClick={() => onNavigate('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textAlign: 'left',
          }}
          aria-label="Signature Robotics Experience Home"
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: 'linear-gradient(135deg, rgba(0, 213, 255, 0.25) 0%, rgba(18, 27, 38, 0.9) 100%)',
              border: '1px solid #00D5FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 14px rgba(0, 213, 255, 0.2)',
            }}
          >
            <Zap size={18} color="#00D5FF" />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '14px',
                letterSpacing: '0.12em',
                color: 'var(--text-snow)',
              }}
            >
              SIGNATURE <span style={{ color: '#00D5FF' }}>ROBOTICS</span>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                letterSpacing: '0.15em',
                color: 'var(--text-secondary)',
              }}
            >
              AUTONOMOUS DYNAMICS LAB
            </div>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          className="desktop-nav"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <MagneticButton key={item.label} strength={0.15}>
                <button
                  onClick={() => onNavigate(item.view, item.targetSec)}
                  style={{
                    padding: '8px 14px',
                    fontFamily: 'var(--font-tech)',
                    fontSize: '13px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: isActive ? '#00D5FF' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'rgba(0, 213, 255, 0.08)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(0, 213, 255, 0.4)' : 'transparent'}`,
                    borderRadius: 4,
                    transition: 'all var(--transition-fast)',
                    cursor: 'pointer',
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </button>
              </MagneticButton>
            );
          })}
        </nav>

        {/* Global Controls HUD (Audio & UNIT-01 Robot Switch) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Audio Synthesizer Toggle */}
          <MagneticButton strength={0.2}>
            <button
              onClick={handleMuteToggle}
              style={{
                width: 38,
                height: 38,
                borderRadius: 4,
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'rgba(18, 27, 38, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: muted ? 'var(--text-muted)' : '#00D5FF',
              }}
              title={muted ? 'Unmute Audio Feedback' : 'Mute Audio Feedback'}
              aria-label={muted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </MagneticButton>

          {/* UNIT-01 Companion Switch */}
          <MagneticButton strength={0.2}>
            <button
              onClick={toggleEnabled}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                borderRadius: 4,
                border: `1px solid ${enabled ? 'rgba(0, 213, 255, 0.5)' : 'var(--border-subtle)'}`,
                backgroundColor: enabled ? 'rgba(0, 213, 255, 0.1)' : 'rgba(18, 27, 38, 0.5)',
                color: enabled ? '#00D5FF' : 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.06em',
              }}
              title={enabled ? 'Deactivate UNIT-01 Co-Pilot' : 'Activate UNIT-01 Co-Pilot'}
              aria-label="Toggle Companion Robot"
            >
              <Cpu size={14} color={enabled ? '#00D5FF' : '#576574'} />
              <span>UNIT-01: {enabled ? 'ON' : 'OFF'}</span>
            </button>
          </MagneticButton>

          {/* Low-Power 2D/3D Mode Switch */}
          {enabled && (
            <button
              onClick={toggleLowPowerMode}
              style={{
                padding: '4px 8px',
                borderRadius: 4,
                border: '1px solid rgba(142, 154, 168, 0.25)',
                backgroundColor: lowPowerMode ? 'rgba(255, 179, 0, 0.12)' : 'transparent',
                color: lowPowerMode ? 'var(--accent-amber)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
              }}
              title="Toggle WebGL 3D vs Lightweight 2D Mode"
            >
              {lowPowerMode ? '2D ECO' : '3D GL'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
