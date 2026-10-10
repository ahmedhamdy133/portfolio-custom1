import React, { useState } from 'react';
import { SectionHeader } from '../../common/SectionHeader';
import { DemoBadge } from '../../common/DemoBadge';
import { soundFx } from '../../../utils/audio';
import { Calendar, ChevronRight, ExternalLink } from 'lucide-react';

interface Milestone {
  year: string;
  name: string;
  category: string;
  description: string;
  significance: string;
  sourceUrl: string;
  sourceName: string;
}

const MILESTONES: Milestone[] = [
  {
    year: '2005',
    name: 'BigDog',
    category: 'Quadruped Pioneer',
    description: 'Developed for DARPA to walk, run, climb muddy trails, and carry heavy loads across terrain impassable by wheeled vehicles.',
    significance: 'First demonstration of dynamic stabilization under external shock (ice slips, kicks).',
    sourceUrl: 'https://en.wikipedia.org/wiki/BigDog',
    sourceName: 'DARPA / Boston Dynamics Historical Archive',
  },
  {
    year: '2009',
    name: 'PETMAN',
    category: 'Bipedal Balance',
    description: 'Anthropomorphic robot designed for the US Department of Defense to test chemical and biological protective suits in realistic stress simulations.',
    significance: 'Precursor to Atlas humanoid kinematics, establishing heel-to-toe human walking gait.',
    sourceUrl: 'https://spectrum.ieee.org/petman-robot-walks-on-treadmill',
    sourceName: 'IEEE Spectrum Archive',
  },
  {
    year: '2012',
    name: 'LS3 (Legged Squad Support System)',
    category: 'Heavy Payload Agility',
    description: 'Semi-autonomous rough-terrain quadruped capable of carrying 400 lbs of gear across 20 miles on a single fuel load.',
    significance: 'Demonstrated voice-command perception and visual leader-following navigation.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Legged_Squad_Support_System',
    sourceName: 'DARPA Operational Tests',
  },
  {
    year: '2013',
    name: 'Atlas Generation 1',
    category: 'DARPA Robotics Challenge',
    description: 'High-power hydraulic humanoid robot designed for disaster response operations like turning valves, operating power tools, and climbing ladders.',
    significance: 'Pioneered whole-body control theory across 28 hydraulic actuators.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Atlas_(robot)',
    sourceName: 'DARPA DRC Technical Documentation',
  },
  {
    year: '2020',
    name: 'Spot Commercial Launch',
    category: 'Industrial Quadruped',
    description: 'Transitioned from R&D prototype into a mass-manufactured enterprise product with API integrations, Orbit fleet management, and automated docking.',
    significance: 'Over 1,000+ units deployed worldwide in hazardous electrical substations and nuclear plants.',
    sourceUrl: 'https://bostondynamics.com/products/spot/',
    sourceName: 'Commercial Enterprise Release',
  },
  {
    year: '2022',
    name: 'Stretch',
    category: 'Logistics Automation',
    description: 'Purpose-built mobile case handling robot featuring a smart suction gripper and compact omnidirectional base designed for unloading truck trailers.',
    significance: 'Automated the most physically grueling manual task in supply chains (unloading 800+ cartons/hr).',
    sourceUrl: 'https://bostondynamics.com/products/stretch/',
    sourceName: 'DHL Supply Chain Deployment Study',
  },
  {
    year: '2024',
    name: 'All-Electric Atlas',
    category: 'Next-Gen Commercial Humanoid',
    description: 'Complete redesign from hydraulics to high-power cycloidal electric actuation, featuring continuous 360-degree joint rotation and AI-driven autonomous manipulation.',
    significance: 'Surpasses biological human joint limits for continuous manufacturing line operations.',
    sourceUrl: 'https://spectrum.ieee.org/boston-dynamics-new-atlas',
    sourceName: 'IEEE Spectrum: The All-Electric Atlas (2024)',
  },
];

export const TimelineSection: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(MILESTONES.length - 1);
  const activeMilestone = MILESTONES[activeIdx];

  return (
    <section
      id="timeline"
      style={{
        padding: 'var(--section-padding) 0',
        backgroundColor: 'var(--bg-graphite)',
        position: 'relative',
      }}
    >
      <div className="section-container">
        <SectionHeader
          number="SEC_09"
          category="Evolutionary Chronology"
          title="Evolution Timeline"
          subtitle="Two decades of breakthroughs in dynamic balance, bio-inspired kinematics, and industrial field autonomy."
          badge={<DemoBadge label="Verified Chronological Milestones" verified={true} />}
        />

        {/* Milestone Quick Jump Selector Bar */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 16,
            marginBottom: 32,
          }}
        >
          {MILESTONES.map((m, idx) => {
            const isSelected = activeIdx === idx;
            return (
              <button
                key={m.year}
                onClick={() => {
                  setActiveIdx(idx);
                  soundFx.playClick();
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '10px 18px',
                  borderRadius: 4,
                  border: isSelected ? '1px solid #00D5FF' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'rgba(0, 213, 255, 0.15)' : 'rgba(18, 27, 38, 0.6)',
                  color: isSelected ? '#00D5FF' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  minWidth: '100px',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700 }}>
                  {m.year}
                </span>
                <span style={{ fontFamily: 'var(--font-tech)', fontSize: '12px', whiteSpace: 'nowrap' }}>
                  {m.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Milestone Spotlight Card */}
        <div
          className="glass-panel blueprint-box"
          style={{
            padding: 36,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div className="telemetry-badge">
              <span className="dot" />
              MILESTONE ARCHIVE // {activeMilestone.year}
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: '#00D5FF',
              }}
            >
              {activeMilestone.category.toUpperCase()}
            </span>
          </div>

          <h3
            style={{
              fontSize: '2rem',
              color: 'var(--text-snow)',
              marginBottom: 16,
            }}
          >
            {activeMilestone.name}
          </h3>

          <p
            style={{
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: 'var(--text-snow)',
              marginBottom: 20,
              maxWidth: '820px',
            }}
          >
            {activeMilestone.description}
          </p>

          <div
            style={{
              backgroundColor: 'rgba(0, 213, 255, 0.06)',
              border: '1px solid rgba(0, 213, 255, 0.25)',
              borderRadius: 4,
              padding: '16px 20px',
              marginBottom: 24,
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00D5FF', marginBottom: 4 }}>
              TECHNICAL SIGNIFICANCE:
            </div>
            <div style={{ color: 'var(--text-snow)', fontSize: '0.95rem' }}>
              {activeMilestone.significance}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 16,
              borderTop: '1px solid rgba(142, 154, 168, 0.15)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-secondary)',
              }}
            >
              Source: {activeMilestone.sourceName}
            </span>
            <a
              href={activeMilestone.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: '#00D5FF',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                textDecoration: 'underline',
              }}
            >
              <span>Verified Citation</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
