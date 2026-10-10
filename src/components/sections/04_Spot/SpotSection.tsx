import React, { useState } from 'react';
import { SectionHeader } from '../../common/SectionHeader';
import { DemoBadge } from '../../common/DemoBadge';
import { soundFx } from '../../../utils/audio';
import { Shield, Eye, Camera, Wrench, Radio, AlertTriangle } from 'lucide-react';

interface SpotPayload {
  id: string;
  name: string;
  category: string;
  weight: string;
  runtime: string;
  features: string[];
  useCaseScenario: string;
  sourceUrl: string;
}

const SPOT_PAYLOADS: SpotPayload[] = [
  {
    id: 'spot-arm',
    name: 'Spot Arm Manipulator',
    category: 'Mobile Manipulation',
    weight: '8.0 kg',
    runtime: '90 minutes',
    features: ['6-Degrees of Freedom', '4K In-Hand Camera + LED Flash', 'Grasp Up To 11 kg', 'Autonomous Door Opening & Valve Turning'],
    useCaseScenario: 'Performs manual interventions such as flipping circuit breakers, opening industrial hatches, and sampling chemical containers without human entry into danger zones.',
    sourceUrl: 'https://bostondynamics.com/products/spot/arm/',
  },
  {
    id: 'flir-thermal',
    name: 'Radiometric Thermal PTZ (FLIR)',
    category: 'Thermal Diagnostics',
    weight: '3.5 kg',
    runtime: '120 minutes',
    features: ['30x Optical Zoom', 'Radiometric Temperature Calibration (±2°C)', 'Preset Waypoint Telemetry', 'Substation Transformer Hotspot Detection'],
    useCaseScenario: 'Autonomously patrols high-voltage electrical transformers to identify localized thermal hotspots before transformer failures cause grid blackouts.',
    sourceUrl: 'https://bostondynamics.com/products/spot/payloads/',
  },
  {
    id: 'lidar-bim',
    name: 'Leica BLK360 3D LiDAR Scanner',
    category: 'Reality Capture & BIM',
    weight: '1.2 kg',
    runtime: '150 minutes',
    features: ['420,000 Points Per Second', 'HDR Spherical Imagery', 'Sub-Millimeter Scan Alignment', 'Automated Construction Progress Tracking'],
    useCaseScenario: 'Executes overnight laser scans of active construction jobsites, matching daily point clouds directly against Autodesk Revit BIM designs to flag installation errors.',
    sourceUrl: 'https://bostondynamics.com/products/spot/',
  },
  {
    id: 'acoustic-sensor',
    name: 'Fluke SV600 Acoustic Imager',
    category: 'Ultrasonic Sound Analysis',
    weight: '2.1 kg',
    runtime: '110 minutes',
    features: ['64 Digital MEMS Microphones', 'Compressed Air Leak Acoustic Array', 'Partial Discharge Ultrasound Detection', 'Frequency Range 2 kHz - 52 kHz'],
    useCaseScenario: 'Listens for inaudible high-frequency air leaks and electrical corona discharge along extensive pipeline runs, saving manufacturing facilities thousands in wasted power.',
    sourceUrl: 'https://bostondynamics.com/products/spot/payloads/',
  },
];

export const SpotSection: React.FC = () => {
  const [activePayload, setActivePayload] = useState<SpotPayload>(SPOT_PAYLOADS[0]);
  const [activeTab, setActiveTab] = useState<'offshore' | 'substation' | 'mining'>('substation');

  return (
    <section
      id="spot"
      style={{
        padding: 'var(--section-padding) 0',
        backgroundColor: 'var(--section-navy)',
        borderTop: '1px solid rgba(142, 154, 168, 0.12)',
        position: 'relative',
      }}
    >
      <div className="section-container">
        <SectionHeader
          number="SEC_04"
          category="Autonomous Quadruped"
          title="Spot in Action"
          subtitle="All-terrain agility engineered for industrial plant inspection, hazardous environments, and remote facility monitoring."
          badge={<DemoBadge label="Verified Field Payloads" verified={true} />}
        />

        {/* Industrial Scene Environment Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginBottom: 32,
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => { setActiveTab('substation'); soundFx.playClick(); }}
            style={{
              padding: '10px 18px',
              borderRadius: 4,
              border: activeTab === 'substation' ? '1px solid #00D5FF' : '1px solid var(--border-subtle)',
              backgroundColor: activeTab === 'substation' ? 'rgba(0, 213, 255, 0.15)' : 'rgba(11, 15, 20, 0.6)',
              color: activeTab === 'substation' ? '#00D5FF' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            01 // HIGH-VOLTAGE SUBSTATION PATROL
          </button>
          <button
            onClick={() => { setActiveTab('offshore'); soundFx.playClick(); }}
            style={{
              padding: '10px 18px',
              borderRadius: 4,
              border: activeTab === 'offshore' ? '1px solid #00D5FF' : '1px solid var(--border-subtle)',
              backgroundColor: activeTab === 'offshore' ? 'rgba(0, 213, 255, 0.15)' : 'rgba(11, 15, 20, 0.6)',
              color: activeTab === 'offshore' ? '#00D5FF' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            02 // OFFSHORE DRILLING RIG GAUGES
          </button>
          <button
            onClick={() => { setActiveTab('mining'); soundFx.playClick(); }}
            style={{
              padding: '10px 18px',
              borderRadius: 4,
              border: activeTab === 'mining' ? '1px solid #00D5FF' : '1px solid var(--border-subtle)',
              backgroundColor: activeTab === 'mining' ? 'rgba(0, 213, 255, 0.15)' : 'rgba(11, 15, 20, 0.6)',
              color: activeTab === 'mining' ? '#00D5FF' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            03 // CONFINED TUNNEL INSPECTION
          </button>
        </div>

        {/* Spot Inspection Simulation Canvas / Interactive Graphic */}
        <div
          className="glass-panel blueprint-box"
          style={{
            padding: 32,
            marginBottom: 32,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <div className="telemetry-badge">
              <span className="dot" />
              DYNAMIC MISSION ACTIVE // {activeTab.toUpperCase()} SCENARIO
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00E699' }}>
              GAIT STABILITY: 99.8% // AUTO-NAV SLAM: LOCK
            </div>
          </div>

          {/* Interactive Industrial Schematic Graphic */}
          <div
            style={{
              height: '320px',
              borderRadius: '6px',
              backgroundColor: '#0B0F14',
              border: '1px solid rgba(0, 213, 255, 0.25)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* Background Grid Pattern */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(rgba(0, 213, 255, 0.1) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Industrial Environment Vector Representation */}
            <svg
              style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
              viewBox="0 0 800 320"
            >
              {/* Floor grid line */}
              <line x1="0" y1="240" x2="800" y2="240" stroke="rgba(142, 154, 168, 0.3)" strokeWidth="2" />
              
              {/* Plant infrastructure */}
              <rect x="80" y="80" width="120" height="160" fill="#121B26" stroke="#00D5FF" strokeWidth="1.5" />
              <line x1="140" y1="80" x2="140" y2="40" stroke="#00D5FF" strokeWidth="3" />
              <circle cx="140" cy="35" r="10" fill="none" stroke="#00D5FF" strokeWidth="2" />
              
              {/* Transformer pipes */}
              <path d="M 200,120 L 280,120 L 280,240" fill="none" stroke="#8E9AA8" strokeWidth="6" />
              
              {/* Spot Quadruped Silhouette */}
              <g transform="translate(380, 160)">
                {/* Body */}
                <rect x="0" y="20" width="100" height="35" rx="6" fill="#182332" stroke="#00D5FF" strokeWidth="2" />
                {/* Yellow chassis stripe */}
                <rect x="15" y="25" width="70" height="8" fill="#FFB300" />
                {/* Legs */}
                <line x1="15" y1="55" x2="5" y2="80" stroke="#8E9AA8" strokeWidth="5" strokeLinecap="round" />
                <line x1="85" y1="55" x2="95" y2="80" stroke="#8E9AA8" strokeWidth="5" strokeLinecap="round" />
                {/* Front Sensor Eyes */}
                <circle cx="95" cy="30" r="4" fill="#00D5FF" />
                {/* Attached Payload Outline */}
                <rect x="35" y="0" width="30" height="20" rx="3" fill="#0B0F14" stroke="#00D5FF" strokeWidth="1.5" />
                {/* Sensor Scanning Cone */}
                <polygon points="65 10, 260 -30, 260 70" fill="rgba(0, 213, 255, 0.12)" stroke="rgba(0, 213, 255, 0.4)" strokeDasharray="4 4" />
              </g>

              {/* Target Gauge Hotspot */}
              <g transform="translate(620, 130)">
                <circle cx="20" cy="20" r="18" fill="#121B26" stroke="#00E699" strokeWidth="2" />
                <line x1="20" y1="20" x2="30" y2="12" stroke="#00E699" strokeWidth="2" strokeLinecap="round" />
                <text x="20" y="55" fill="#00E699" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  VALVE 4B: 94.2 PSI
                </text>
              </g>
            </svg>

            <div
              style={{
                position: 'absolute',
                bottom: 16,
                right: 20,
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-secondary)',
                backgroundColor: 'rgba(11, 15, 20, 0.85)',
                padding: '6px 12px',
                borderRadius: 4,
                border: '1px solid var(--border-subtle)',
              }}
            >
              AUTONOMOUS WAYPOINT 14/28 // NO ANOMALIES
            </div>
          </div>
        </div>

        {/* Interchangeable Payloads Selector Grid */}
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: 16, color: 'var(--text-snow)' }}>
            INTERCHANGEABLE HARDWARE PAYLOADS
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 16,
            }}
          >
            {SPOT_PAYLOADS.map((payload) => {
              const isSelected = activePayload.id === payload.id;
              return (
                <button
                  key={payload.id}
                  onClick={() => {
                    setActivePayload(payload);
                    soundFx.playClick();
                  }}
                  className="glass-panel"
                  style={{
                    padding: 20,
                    textAlign: 'left',
                    borderRadius: 6,
                    border: isSelected ? '1px solid #00D5FF' : '1px solid var(--border-subtle)',
                    backgroundColor: isSelected ? 'rgba(0, 213, 255, 0.1)' : 'var(--surface-card)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  aria-pressed={isSelected}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: isSelected ? '#00D5FF' : 'var(--text-secondary)',
                      marginBottom: 6,
                    }}
                  >
                    {payload.category}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.1rem',
                      color: 'var(--text-snow)',
                      marginBottom: 10,
                    }}
                  >
                    {payload.name}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: 12,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: '#8E9AA8',
                    }}
                  >
                    <span>MASS: {payload.weight}</span>
                    <span>BATTERY: {payload.runtime}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Payload Detail Box */}
        <div
          className="glass-panel blueprint-box"
          style={{
            padding: '24px 28px',
            marginTop: 20,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00D5FF', marginBottom: 4 }}>
                FIELD CAPABILITIES // {activePayload.name}
              </div>
              <p style={{ color: 'var(--text-snow)', maxWidth: '780px', fontSize: '0.95rem' }}>
                {activePayload.useCaseScenario}
              </p>
            </div>
            <a
              href={activePayload.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: '#00D5FF',
                textDecoration: 'underline',
              }}
            >
              Public Specs Reference ↗
            </a>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              marginTop: 16,
              paddingTop: 16,
              borderTop: '1px solid rgba(142, 154, 168, 0.15)',
            }}
          >
            {activePayload.features.map((feat, i) => (
              <span
                key={i}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  backgroundColor: 'rgba(18, 27, 38, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  padding: '4px 10px',
                  borderRadius: 4,
                  color: 'var(--text-snow)',
                }}
              >
                ✓ {feat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
