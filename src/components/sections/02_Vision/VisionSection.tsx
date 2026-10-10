import React from 'react';
import { SectionHeader } from '../../common/SectionHeader';
import { DemoBadge } from '../../common/DemoBadge';
import { Cpu, Shield, Zap, Globe, Layers, Eye } from 'lucide-react';

interface VisionPillar {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  specs: string;
  sourceUrl?: string;
  sourceName?: string;
}

const VISION_PILLARS: VisionPillar[] = [
  {
    id: 'whole-body',
    title: 'Whole-Body Dynamic Manipulation',
    description: 'Autonomous coordination of torso, arms, and legs to handle heavy payload transport across variable unstructured terrain without pre-programmed paths.',
    icon: <Cpu size={24} color="#00D5FF" />,
    specs: '500Hz MPC Loop // Dynamic Momentum Allocation',
    sourceUrl: 'https://en.wikipedia.org/wiki/Atlas_(robot)',
    sourceName: 'IEEE Spectrum / Boston Dynamics Research Papers',
  },
  {
    id: 'perception',
    title: 'Multi-Modal Stereo & LiDAR Fusion',
    description: 'Dense depth cameras combined with high-frequency inertial measurement units (IMU) generate 3D occupancy voxel grids in real-time under extreme low-light environments.',
    icon: <Eye size={24} color="#00D5FF" />,
    specs: '360° Field of View // Sub-Centimeter SLAM Precision',
    sourceUrl: 'https://bostondynamics.com/products/spot/',
    sourceName: 'Public Product Specifications',
  },
  {
    id: 'electrification',
    title: 'High-Power Electric Actuation',
    description: 'Transitioning from legacy hydraulic manifolds to compact custom electric cycloidal drives that offer infinite 360-degree joint rotations and zero fluid maintenance.',
    icon: <Zap size={24} color="#00D5FF" />,
    specs: 'Custom Cycloidal Drives // 360° Continuous Yaw/Roll',
    sourceUrl: 'https://spectrum.ieee.org/boston-dynamics-new-atlas',
    sourceName: 'IEEE Spectrum: The All-Electric Atlas',
  },
  {
    id: 'fleet-autonomy',
    title: 'Deterministic Fleet Orchestration',
    description: 'Centralized telemetry mesh enabling dozens of autonomous agents to collaborate, schedule self-charging, and route missions across millions of square feet.',
    icon: <Globe size={24} color="#00D5FF" />,
    specs: 'Orbit Telemetry Protocol // 99.98% Operational Uptime',
    sourceUrl: 'https://bostondynamics.com/products/orbit/',
    sourceName: 'Orbit Fleet Software Documentation',
  },
];

export const VisionSection: React.FC = () => {
  return (
    <section
      id="vision"
      style={{
        padding: 'var(--section-padding) 0',
        backgroundColor: 'var(--section-navy)',
        borderTop: '1px solid rgba(142, 154, 168, 0.12)',
        borderBottom: '1px solid rgba(142, 154, 168, 0.12)',
        position: 'relative',
        transition: 'background-color 0.5s ease',
      }}
    >
      <div className="section-container">
        <SectionHeader
          number="SEC_02"
          category="Technological Horizon"
          title="The Future of Robotics"
          subtitle="Our engineering foundation bridges biological adaptability with industrial precision. Every platform is designed to operate safely alongside human teams in dynamic environments."
          badge={<DemoBadge label="Verified Research Citations" verified={true} />}
        />

        {/* Blueprint Connecting Line SVG */}
        <div style={{ position: 'relative', marginTop: '32px' }}>
          <svg
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              width: '100%',
              height: '100px',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              opacity: 0.25,
            }}
          >
            <path
              d="M 50,50 L 300,50 L 350,20 L 700,20 L 750,50 L 1200,50"
              fill="none"
              stroke="#00D5FF"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
          </svg>

          {/* 4 Pillars Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {VISION_PILLARS.map((pillar, idx) => (
              <div
                key={pillar.id}
                className="glass-panel blueprint-box"
                style={{
                  padding: '32px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '20px',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 6,
                        backgroundColor: 'rgba(0, 213, 255, 0.08)',
                        border: '1px solid rgba(0, 213, 255, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {pillar.icon}
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      0{idx + 1} // 04
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '1.25rem',
                      marginBottom: '12px',
                      color: 'var(--text-snow)',
                    }}
                  >
                    {pillar.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {pillar.description}
                  </p>
                </div>

                <div
                  style={{
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(142, 154, 168, 0.15)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: '#00D5FF',
                      marginBottom: '6px',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {pillar.specs}
                  </div>
                  {pillar.sourceUrl && (
                    <a
                      href={pillar.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: 'var(--text-secondary)',
                        textDecoration: 'underline',
                      }}
                      aria-label={`Source for ${pillar.title}`}
                    >
                      Ref: {pillar.sourceName}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
