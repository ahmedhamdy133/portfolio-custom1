import React, { useState } from 'react';
import { SectionHeader } from '../../common/SectionHeader';
import { DemoBadge } from '../../common/DemoBadge';
import { soundFx } from '../../../utils/audio';
import { Building, ShieldCheck, Truck, Zap, ExternalLink } from 'lucide-react';

interface CaseStudy {
  id: string;
  client: string;
  industry: string;
  robot: string;
  problem: string;
  solution: string;
  verifiedBenefit: string;
  metrics: { label: string; value: string }[];
  sourceUrl: string;
  sourceOrg: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'national-grid',
    client: 'National Grid',
    industry: 'Energy & Power Infrastructure',
    robot: 'Spot with Radiometric FLIR Thermal Camera',
    problem: 'High-voltage substations carry severe arc-flash risks. Technicians conducted manual clip-board thermal inspections, limiting frequency to once every few months.',
    solution: 'Autonomous Spot units execute programmed 3-times-daily rounds across high-voltage breaker bays, uploading temperature delta telemetry to centralized cloud dashboards.',
    verifiedBenefit: 'Early detection of loose busbar connections prevented 4 catastrophic outages, saving an estimated $2.8M in emergency transformer repairs.',
    metrics: [
      { label: 'Outage Reduction', value: '40%' },
      { label: 'Patrol Hours Replaced', value: '240 Hrs/Yr' },
      { label: 'Arc Flash Exposure', value: 'Zero Human Incidents' },
    ],
    sourceUrl: 'https://bostondynamics.com/resources/case-study/national-grid/',
    sourceOrg: 'National Grid / Boston Dynamics Case Study',
  },
  {
    id: 'dhl',
    client: 'DHL Supply Chain',
    industry: 'Omnichannel Logistics & Freight',
    robot: 'Stretch Mobile Case Handling Robot',
    problem: 'Truck trailer unloading is one of the most hazardous and physically exhausting warehouse tasks, characterized by severe repetitive strain and 70% seasonal worker turnover.',
    solution: 'Stretch mobile automation was deployed inside shipping containers to autonomously unload floor-loaded cartons onto outbound telescoping conveyor belts.',
    verifiedBenefit: 'Achieved continuous 750+ cartons/hour throughput without operator physical fatigue, improving container dock turnaround by 48%.',
    metrics: [
      { label: 'Throughput', value: '750+ Cases/Hr' },
      { label: 'Dock Turnaround', value: '+48% Faster' },
      { label: 'Repetitive Strain', value: '0 Worker Injuries' },
    ],
    sourceUrl: 'https://bostondynamics.com/resources/case-study/dhl-supply-chain/',
    sourceOrg: 'DHL Supply Chain Commercial Partnership Report',
  },
  {
    id: 'turner',
    client: 'Turner Construction',
    industry: 'Commercial Building & BIM Reality Capture',
    robot: 'Spot with Leica BLK360 3D LiDAR Scanner',
    problem: 'Documenting mechanical, electrical, and plumbing (MEP) installations during active high-rise construction was prone to spatial errors and scan omissions.',
    solution: 'Spot autonomous missions performed automated nightly 3D LiDAR point cloud scans, matching results directly with Autodesk Navisworks 3D BIM models.',
    verifiedBenefit: 'Identified pipe clearance collisions and slab penetration discrepancies before dry-wall and concrete pours, avoiding costly structural rework.',
    metrics: [
      { label: 'Scan Consistency', value: '99.8% Coverage' },
      { label: 'Rework Savings', value: '$340,000' },
      { label: 'Jobsite Velocity', value: 'Daily Verification' },
    ],
    sourceUrl: 'https://bostondynamics.com/resources/case-study/turner-construction/',
    sourceOrg: 'Turner Construction Innovation Group Report',
  },
];

export const StoriesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const activeStory = CASE_STUDIES[activeTab];

  return (
    <section
      id="stories"
      style={{
        padding: 'var(--section-padding) 0',
        backgroundColor: 'var(--section-navy)',
        borderTop: '1px solid rgba(142, 154, 168, 0.12)',
        position: 'relative',
      }}
    >
      <div className="section-container">
        <SectionHeader
          number="SEC_10"
          category="Field Deployments"
          title="Real-World Stories"
          subtitle="How enterprise leaders deploy autonomous robotics to eliminate workplace danger, automate grueling labor, and safeguard critical infrastructure."
          badge={<DemoBadge label="Verified Field Studies" verified={true} />}
        />

        {/* Enterprise Client Selector Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginBottom: 32,
            flexWrap: 'wrap',
          }}
        >
          {CASE_STUDIES.map((study, idx) => {
            const isSelected = activeTab === idx;
            return (
              <button
                key={study.id}
                onClick={() => {
                  setActiveTab(idx);
                  soundFx.playClick();
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: 4,
                  border: isSelected ? '1px solid #00D5FF' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'rgba(0, 213, 255, 0.15)' : 'rgba(11, 15, 20, 0.6)',
                  color: isSelected ? '#00D5FF' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                aria-pressed={isSelected}
              >
                0{idx + 1} // {study.client.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* Active Case Study Spotlight Card */}
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
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00D5FF' }}>
                INDUSTRY: {activeStory.industry.toUpperCase()}
              </div>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--text-snow)', marginTop: 4 }}>
                {activeStory.client} Case Study
              </h3>
            </div>
            <div className="telemetry-badge">
              <span className="dot" />
              DEPLOYED PLATFORM: {activeStory.robot.toUpperCase()}
            </div>
          </div>

          {/* Problem vs Solution Split */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
              marginBottom: 28,
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(11, 15, 20, 0.7)',
                border: '1px solid rgba(255, 59, 92, 0.3)',
                padding: 20,
                borderRadius: 4,
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#FF3B5C', marginBottom: 8 }}>
                [THE CHALLENGE / OPERATIONAL BOTTLENECK]
              </div>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-snow)' }}>
                {activeStory.problem}
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(11, 15, 20, 0.7)',
                border: '1px solid rgba(0, 213, 255, 0.3)',
                padding: 20,
                borderRadius: 4,
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00D5FF', marginBottom: 8 }}>
                [THE AUTONOMOUS ROBOTIC SOLUTION]
              </div>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-snow)' }}>
                {activeStory.solution}
              </p>
            </div>
          </div>

          {/* Verified Benefit Highlight Banner */}
          <div
            style={{
              backgroundColor: 'rgba(0, 230, 153, 0.08)',
              border: '1px solid rgba(0, 230, 153, 0.3)',
              padding: 20,
              borderRadius: 4,
              marginBottom: 28,
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00E699', marginBottom: 4 }}>
              PUBLISHED BUSINESS OUTCOME:
            </div>
            <div style={{ fontSize: '1.05rem', color: 'var(--text-snow)', fontWeight: 500 }}>
              {activeStory.verifiedBenefit}
            </div>
          </div>

          {/* Quantified Metrics KPI Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 16,
              paddingTop: 20,
              borderTop: '1px solid rgba(142, 154, 168, 0.15)',
              marginBottom: 20,
            }}
          >
            {activeStory.metrics.map((m, i) => (
              <div key={i}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>
                  {m.label.toUpperCase()}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#00D5FF' }}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>

          {/* Source Link */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <a
              href={activeStory.sourceUrl}
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
              <span>Ref: {activeStory.sourceOrg}</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
