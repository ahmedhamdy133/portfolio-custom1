import React, { useState } from 'react';
import { SectionHeader } from '../../common/SectionHeader';
import { DemoBadge } from '../../common/DemoBadge';
import { soundFx } from '../../../utils/audio';
import { Shield, Battery, Radio, AlertCircle, CheckCircle, RefreshCw, Cpu, MapPin } from 'lucide-react';

interface FleetRobot {
  id: string;
  name: string;
  model: 'Spot' | 'Stretch' | 'Atlas';
  status: 'active' | 'charging' | 'idle' | 'alert';
  battery: number;
  location: string;
  currentTask: string;
  coordinates: { x: number; y: number };
}

const INITIAL_ROBOTS: FleetRobot[] = [
  { id: 'R-01', name: 'SPOT-ALPHA', model: 'Spot', status: 'active', battery: 84, location: 'Sector 4: Substation Yard', currentTask: 'Thermal Inspection Patrol Waypoint #18', coordinates: { x: 35, y: 42 } },
  { id: 'R-02', name: 'SPOT-BRAVO', model: 'Spot', status: 'charging', battery: 98, location: 'Charging Dock #02', currentTask: 'Fast DC Top-Off / Standby Readiness', coordinates: { x: 18, y: 78 } },
  { id: 'R-03', name: 'STRETCH-01', model: 'Stretch', status: 'active', battery: 67, location: 'Pier 12: Inbound Freight', currentTask: 'Trailer Container Unload SKU-4001', coordinates: { x: 72, y: 30 } },
  { id: 'R-04', name: 'STRETCH-02', model: 'Stretch', status: 'charging', battery: 42, location: 'Charging Dock #05', currentTask: 'Scheduled Maintenance Battery Balancing', coordinates: { x: 22, y: 85 } },
  { id: 'R-05', name: 'ATLAS-UNIT-09', model: 'Atlas', status: 'idle', battery: 88, location: 'Dynamics Lab: R&D Cell 3', currentTask: 'Awaiting Whole-Body Kinematic Job Dispatch', coordinates: { x: 55, y: 65 } },
  { id: 'R-06', name: 'SPOT-ECHO', model: 'Spot', status: 'alert', battery: 12, location: 'Sector 9: Perimeter Trench', currentTask: 'Low Battery Auto-Return Routing Interrupted', coordinates: { x: 88, y: 72 } },
];

const LOG_EVENTS = [
  { time: '10:44:12', robot: 'SPOT-ALPHA', message: 'Waypoint #18 Thermal Image recorded. No anomaly detected.', level: 'info' },
  { time: '10:43:55', robot: 'STRETCH-01', message: 'Carton batch #42 completed. Throughput: 782 cartons/hr.', level: 'success' },
  { time: '10:41:02', robot: 'SPOT-ECHO', message: 'Voltage threshold warning (<15%). Engaging Safe Return path.', level: 'alert' },
  { time: '10:38:19', robot: 'SPOT-BRAVO', message: 'Docked successfully at Supercharger Station #02.', level: 'info' },
];

export const MissionControlSection: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'charging' | 'idle' | 'alert'>('all');
  const [selectedRobot, setSelectedRobot] = useState<FleetRobot>(INITIAL_ROBOTS[0]);

  const filteredRobots = INITIAL_ROBOTS.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const getStatusColor = (status: FleetRobot['status']) => {
    switch (status) {
      case 'active': return '#00D5FF';
      case 'charging': return '#00E699';
      case 'idle': return '#8E9AA8';
      case 'alert': return '#FF3B5C';
    }
  };

  return (
    <section
      id="mission"
      style={{
        padding: 'var(--section-padding) 0',
        backgroundColor: 'var(--section-navy)',
        borderTop: '1px solid rgba(142, 154, 168, 0.12)',
        position: 'relative',
      }}
    >
      <div className="section-container">
        <SectionHeader
          number="SEC_06"
          category="Fleet Telemetry"
          title="Mission Control Center"
          subtitle="Real-time centralized orchestration console: monitor autonomous unit state, dispatch inspection missions, and resolve perimeter alerts across complex facilities."
          badge={<DemoBadge label="Demo Fleet Simulation Data" verified={false} />}
        />

        {/* Global Fleet Status KPI Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            marginBottom: 28,
          }}
        >
          <div className="glass-panel" style={{ padding: 20 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>ACTIVE FLEET SIZE</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#00D5FF' }}>6 Units</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#00E699' }}>● 100% ORBIT MESH SYNC</div>
          </div>

          <div className="glass-panel" style={{ padding: 20 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>FLEET ENERGY CONSUMPTION</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text-snow)' }}>14.8 kW</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>2 Units Fast-Charging</div>
          </div>

          <div className="glass-panel" style={{ padding: 20 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>MISSION COMPLETION RATE</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#00E699' }}>99.4%</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>128 Autonomous Waypoints Cleared</div>
          </div>

          <div className="glass-panel" style={{ padding: 20 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>INCIDENT / ANOMALY ALERTS</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#FF3B5C' }}>1 Alert</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#FF3B5C' }}>Spot-Echo Low Voltage</div>
          </div>
        </div>

        {/* Filters Bar */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            marginBottom: 20,
            flexWrap: 'wrap',
          }}
        >
          {(['all', 'active', 'charging', 'idle', 'alert'] as const).map((st) => (
            <button
              key={st}
              onClick={() => { setFilter(st); soundFx.playClick(); }}
              style={{
                padding: '6px 14px',
                borderRadius: 4,
                border: filter === st ? '1px solid #00D5FF' : '1px solid var(--border-subtle)',
                backgroundColor: filter === st ? 'rgba(0, 213, 255, 0.15)' : 'rgba(18, 27, 38, 0.7)',
                color: filter === st ? '#00D5FF' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              {st} ({st === 'all' ? INITIAL_ROBOTS.length : INITIAL_ROBOTS.filter(r => r.status === st).length})
            </button>
          ))}
        </div>

        {/* Main Dashboard Layout: Map & Robot List & Selected Panel */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1.4fr) minmax(280px, 1fr)',
            gap: 24,
            marginBottom: 24,
          }}
        >
          {/* Facility Map View */}
          <div
            className="glass-panel blueprint-box"
            style={{
              padding: 24,
              minHeight: '420px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <div className="telemetry-badge">
                <span className="dot" />
                FACILITY MAP // SECTOR ALPHA BLUEPRINT
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>
                COORDINATE MESH: REALTIME
              </span>
            </div>

            {/* Map Canvas Background */}
            <div
              style={{
                height: '340px',
                backgroundColor: '#0B0F14',
                borderRadius: 6,
                border: '1px solid rgba(0, 213, 255, 0.2)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Facility blueprint lines */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                {/* Rooms */}
                <rect x="20" y="20" width="220" height="140" fill="none" stroke="rgba(142, 154, 168, 0.2)" strokeWidth="1.5" />
                <text x="30" y="40" fill="#576574" fontSize="10" fontFamily="monospace">SUBSTATION 04</text>

                <rect x="280" y="20" width="280" height="140" fill="none" stroke="rgba(142, 154, 168, 0.2)" strokeWidth="1.5" />
                <text x="290" y="40" fill="#576574" fontSize="10" fontFamily="monospace">INBOUND FREIGHT BAY</text>

                <rect x="20" y="190" width="220" height="130" fill="none" stroke="rgba(142, 154, 168, 0.2)" strokeWidth="1.5" />
                <text x="30" y="210" fill="#576574" fontSize="10" fontFamily="monospace">CHARGING DOCKS</text>

                <rect x="280" y="190" width="280" height="130" fill="none" stroke="rgba(142, 154, 168, 0.2)" strokeWidth="1.5" />
                <text x="290" y="210" fill="#576574" fontSize="10" fontFamily="monospace">DYNAMICS LAB R&D</text>

                {/* Connection transit corridors */}
                <line x1="240" y1="90" x2="280" y2="90" stroke="#00D5FF" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="240" y1="250" x2="280" y2="250" stroke="#00D5FF" strokeWidth="2" strokeDasharray="3 3" />
              </svg>

              {/* Robot Position Pins */}
              {filteredRobots.map((robot) => {
                const isSelected = selectedRobot.id === robot.id;
                const color = getStatusColor(robot.status);
                return (
                  <button
                    key={robot.id}
                    onClick={() => { setSelectedRobot(robot); soundFx.playTargetLock(); }}
                    style={{
                      position: 'absolute',
                      left: `${robot.coordinates.x}%`,
                      top: `${robot.coordinates.y}%`,
                      transform: 'translate(-50%, -50%)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      backgroundColor: 'rgba(11, 15, 20, 0.9)',
                      border: `1.5px solid ${isSelected ? '#FFFFFF' : color}`,
                      borderRadius: 16,
                      padding: '4px 8px',
                      cursor: 'pointer',
                      boxShadow: isSelected ? `0 0 16px ${color}` : `0 0 6px ${color}`,
                      transition: 'all 0.2s',
                      zIndex: isSelected ? 30 : 10,
                    }}
                    aria-label={`Select ${robot.name}`}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: color,
                        boxShadow: `0 0 6px ${color}`,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: isSelected ? '#FFFFFF' : 'var(--text-snow)',
                      }}
                    >
                      {robot.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Robot Telemetry Drawer */}
          <div
            className="glass-panel blueprint-box"
            style={{
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: getStatusColor(selectedRobot.status),
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                  }}
                >
                  UNIT #{selectedRobot.id} // {selectedRobot.status}
                </span>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: selectedRobot.battery > 20 ? '#00E699' : '#FF3B5C',
                  }}
                >
                  <Battery size={14} />
                  <span>{selectedRobot.battery}%</span>
                </div>
              </div>

              <h3 style={{ fontSize: '1.4rem', color: 'var(--text-snow)', marginBottom: 8 }}>
                {selectedRobot.name}
              </h3>

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  marginBottom: 16,
                }}
              >
                PLATFORM: {selectedRobot.model.toUpperCase()} DYNAMICS
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(11, 15, 20, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 4,
                  padding: 14,
                  marginBottom: 16,
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)', marginBottom: 4 }}>
                  ASSIGNED LOCATION:
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-snow)' }}>
                  {selectedRobot.location}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(11, 15, 20, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 4,
                  padding: 14,
                  marginBottom: 16,
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#00D5FF', marginBottom: 4 }}>
                  ACTIVE MISSION TASK:
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-snow)' }}>
                  {selectedRobot.currentTask}
                </div>
              </div>
            </div>

            {/* Quick Command Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => soundFx.playClick()}
                className="btn-cyber"
                style={{ flex: 1, padding: '10px', fontSize: '11px' }}
              >
                DISPATCH MISSION
              </button>
              <button
                onClick={() => soundFx.playClick()}
                className="btn-cyber-outline"
                style={{ flex: 1, padding: '10px', fontSize: '11px' }}
              >
                RETURN TO DOCK
              </button>
            </div>
          </div>
        </div>

        {/* Live Mission Event Log Stream */}
        <div
          className="glass-panel"
          style={{
            padding: 20,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: '#00D5FF',
              marginBottom: 12,
              letterSpacing: '0.08em',
            }}
          >
            LIVE TELEMETRY LOG STREAM [ORBIT MESH]
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {LOG_EVENTS.map((ev, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  padding: '6px 12px',
                  backgroundColor: 'rgba(11, 15, 20, 0.6)',
                  borderRadius: 4,
                  borderLeft: `3px solid ${ev.level === 'alert' ? '#FF3B5C' : ev.level === 'success' ? '#00E699' : '#00D5FF'}`,
                }}
              >
                <span style={{ color: 'var(--text-secondary)' }}>[{ev.time}]</span>
                <span style={{ color: '#E9F1F8', fontWeight: 600 }}>{ev.robot}</span>
                <span style={{ color: 'var(--text-secondary)' }}>— {ev.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
