import React, { useState } from 'react';
import { ArrowLeft, Globe, Radio, Battery, Shield, Cpu, RefreshCw, CheckCircle, Play } from 'lucide-react';
import { MagneticButton } from '../../utils/magnetic';
import { soundFx } from '../../utils/audio';
import { DemoBadge } from '../common/DemoBadge';

interface OrbitPageProps {
  onBackToHome: () => void;
}

export const OrbitPage: React.FC<OrbitPageProps> = ({ onBackToHome }) => {
  const [missionDispatched, setMissionDispatched] = useState(false);
  const [geofenceLocked, setGeofenceLocked] = useState(true);

  const handleDispatch = () => {
    soundFx.playTargetLock();
    setMissionDispatched(true);
    setTimeout(() => setMissionDispatched(false), 3500);
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
              SOFTWARE PLATFORM // ORBIT FLEET OPERATIONS
            </div>
            <DemoBadge label="Commercial Fleet Software UI" verified={true} />
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--text-snow)', marginBottom: 16 }}>
            Orbit Fleet Management Suite
          </h1>

          <p style={{ maxWidth: '780px', fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>
            Centralized operations software that transforms individual robots into a coordinated autonomous workforce. Schedule multi-robot inspection routines, manage geofenced safety boundaries, and stream thermal data directly into SCADA and enterprise ERP systems.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
            <div className="glass-panel" style={{ padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>FLEET ORCHESTRATION</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#00D5FF' }}>Multi-Agent Autonomy</div>
            </div>
            <div className="glass-panel" style={{ padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>INTEGRATION PROTOCOLS</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text-snow)' }}>REST, gRPC, MQTT</div>
            </div>
            <div className="glass-panel" style={{ padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>DIGITAL TWIN SYNC</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#00E699' }}>Sub-Second Telemetry</div>
            </div>
            <div className="glass-panel" style={{ padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>CYBERSECURITY</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text-snow)' }}>SOC 2 Type II // TLS 1.3</div>
            </div>
          </div>
        </div>

        {/* Simulated Web Management Console */}
        <div className="glass-panel blueprint-box" style={{ padding: 32, marginBottom: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-snow)' }}>
                Simulated Orbit Operator Web Console
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                Experience remote dispatching, automated docking triggers, and geofence boundary enforcement.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => { setGeofenceLocked(!geofenceLocked); soundFx.playClick(); }}
                className="btn-cyber-outline"
                style={{ padding: '8px 14px', fontSize: '11px' }}
              >
                GEOFENCE: {geofenceLocked ? 'LOCKED [STRICT]' : 'OVERRIDE [WARN]'}
              </button>
              <button
                onClick={handleDispatch}
                disabled={missionDispatched}
                className="btn-cyber"
                style={{ padding: '8px 16px', fontSize: '11px' }}
              >
                <Play size={14} />
                <span>{missionDispatched ? 'DISPATCH IN PROGRESS...' : 'DISPATCH ROUTINE ALPHA'}</span>
              </button>
            </div>
          </div>

          {/* Console Display */}
          <div
            style={{
              backgroundColor: '#0B0F14',
              borderRadius: 6,
              border: '1px solid rgba(0, 213, 255, 0.25)',
              padding: 24,
            }}
          >
            {missionDispatched && (
              <div
                style={{
                  backgroundColor: 'rgba(0, 230, 153, 0.12)',
                  border: '1px solid #00E699',
                  padding: '12px 16px',
                  borderRadius: 4,
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  color: '#00E699',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                }}
              >
                <CheckCircle size={16} />
                <span>MISSION TRANSMISSION CONFIRMED: Spot-Alpha & Stretch-01 dispatched to Substation Zone 4.</span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              <div style={{ backgroundColor: 'rgba(18, 27, 38, 0.6)', padding: 16, borderRadius: 4, border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00D5FF', marginBottom: 6 }}>
                  SCHEDULED AUTONOMOUS MISSIONS
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-snow)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div>● 11:00 AM — Substation Switchgear Thermal Sweep</div>
                  <div>● 01:30 PM — Container Freight Unloading Pier 12</div>
                  <div>● 04:00 PM — Perimeter Fence Radiation & Gas Scout</div>
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(18, 27, 38, 0.6)', padding: 16, borderRadius: 4, border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00D5FF', marginBottom: 6 }}>
                  TELEMETRY INTEGRATION ENDPOINTS
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div>POST /api/v2/missions/dispatch</div>
                  <div>GET  /api/v2/robots/telemetry/stream</div>
                  <div>WS   wss://orbit.enterprise.mesh/events</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
