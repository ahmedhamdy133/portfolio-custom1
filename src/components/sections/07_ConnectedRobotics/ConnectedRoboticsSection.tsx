import React, { useState, useEffect, useRef } from 'react';
import { SectionHeader } from '../../common/SectionHeader';
import { DemoBadge } from '../../common/DemoBadge';
import { soundFx } from '../../../utils/audio';
import { Globe, Radio, Server, Cpu, Shield, Smartphone } from 'lucide-react';

interface NetworkNode {
  id: string;
  name: string;
  role: string;
  category: string;
  protocol: string;
  latencyMs: number;
  bandwidthMbps: number;
  x: number; // %
  y: number; // %
  connections: string[];
}

const NETWORK_NODES: NetworkNode[] = [
  { id: 'cloud', name: 'Orbit Cloud Telemetry', role: 'Global fleet orchestration, autonomous mission scheduler, digital twin cloud sync', category: 'Cloud Infrastructure', protocol: 'gRPC / TLS 1.3 / Protobuf', latencyMs: 24, bandwidthMbps: 450, x: 50, y: 18, connections: ['edge-hub', 'operator-hud'] },
  { id: 'edge-hub', name: 'Facility Edge Gateway', role: 'Localized low-latency inference, real-time safety interlocks, voxel map merging', category: 'Edge Computing', protocol: 'MQTT / DDS Fast-RTPS', latencyMs: 1.8, bandwidthMbps: 1200, x: 50, y: 52, connections: ['spot-mesh', 'stretch-cell', 'atlas-cell'] },
  { id: 'spot-mesh', name: 'Spot Quadruped Mesh', role: 'Multi-agent ad-hoc P2P relay for subterranean & non-WiFi hazardous terrain', category: 'Field Robotics', protocol: '802.11s Mesh / Wi-Fi 6', latencyMs: 3.2, bandwidthMbps: 150, x: 22, y: 78, connections: ['edge-hub'] },
  { id: 'stretch-cell', name: 'Stretch Warehouse Cell', role: 'Conveyor synchronization bus, pallet state streaming, vision bar-code decoding', category: 'Logistics Cells', protocol: 'OPC-UA / Ethernet-IP', latencyMs: 0.8, bandwidthMbps: 850, x: 50, y: 84, connections: ['edge-hub'] },
  { id: 'atlas-cell', name: 'Atlas Dynamics Cell', role: 'High-frequency whole-body MPC state streaming and ground reaction force telemetry', category: 'Humanoid R&D', protocol: 'EtherCAT / Custom UDP 500Hz', latencyMs: 0.4, bandwidthMbps: 300, x: 78, y: 78, connections: ['edge-hub'] },
  { id: 'operator-hud', name: 'Field Operator Tablet', role: 'Manual remote teleoperation, real-time FPV camera feed, certified emergency stop', category: 'Human-Machine Interface', protocol: 'WebRTC / Encrypted STUN', latencyMs: 8.5, bandwidthMbps: 45, x: 78, y: 26, connections: ['cloud', 'edge-hub'] },
];

export const ConnectedRoboticsSection: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<NetworkNode>(NETWORK_NODES[0]);
  const [packetOffset, setPacketOffset] = useState(0);

  useEffect(() => {
    let animId: number;
    const animate = () => {
      setPacketOffset((prev) => (prev + 0.008) % 1);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section
      id="connected"
      style={{
        padding: 'var(--section-padding) 0',
        backgroundColor: 'var(--bg-graphite)',
        position: 'relative',
      }}
    >
      <div className="section-container">
        <SectionHeader
          number="SEC_07"
          category="Mesh Architecture"
          title="Connected Robotics"
          subtitle="Distributed edge computing and mesh communications enable fleets to coordinate securely without relying on continuous internet connectivity."
          badge={<DemoBadge label="Illustrative Topology // Not a live feed" verified={false} />}
        />

        {/* Network Stage Canvas & Detail Panel */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1.4fr) minmax(280px, 1fr)',
            gap: 28,
            alignItems: 'start',
          }}
        >
          {/* Animated Topological Network Graph */}
          <div
            className="glass-panel blueprint-box"
            style={{
              height: '460px',
              backgroundColor: '#0B0F14',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 6,
            }}
          >
            {/* SVG Connecting Wire Lines & Animated Packets */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="cyanLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00D5FF" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#00E699" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Connecting Lines */}
              {NETWORK_NODES.map((node) =>
                node.connections.map((targetId) => {
                  const targetNode = NETWORK_NODES.find((n) => n.id === targetId);
                  if (!targetNode) return null;

                  const isConnectedToSelected =
                    selectedNode.id === node.id || selectedNode.id === targetNode.id;

                  return (
                    <g key={`${node.id}-${targetId}`}>
                      <line
                        x1={`${node.x}%`}
                        y1={`${node.y}%`}
                        x2={`${targetNode.x}%`}
                        y2={`${targetNode.y}%`}
                        stroke={isConnectedToSelected ? '#00D5FF' : 'rgba(142, 154, 168, 0.25)'}
                        strokeWidth={isConnectedToSelected ? 2.5 : 1}
                        strokeDasharray={isConnectedToSelected ? 'none' : '4 4'}
                      />
                      {/* Animated traversing packet dot */}
                      <circle
                        cx={`${node.x + (targetNode.x - node.x) * packetOffset}%`}
                        cy={`${node.y + (targetNode.y - node.y) * packetOffset}%`}
                        r={isConnectedToSelected ? 3.5 : 2}
                        fill="#00D5FF"
                        filter="drop-shadow(0 0 6px #00D5FF)"
                      />
                    </g>
                  );
                })
              )}
            </svg>

            {/* Interactive Nodes */}
            {NETWORK_NODES.map((node) => {
              const isSelected = selectedNode.id === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => {
                    setSelectedNode(node);
                    soundFx.playTargetLock();
                  }}
                  style={{
                    position: 'absolute',
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    zIndex: 20,
                  }}
                  aria-label={`Inspect ${node.name}`}
                >
                  <div
                    style={{
                      width: isSelected ? 48 : 38,
                      height: isSelected ? 48 : 38,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(11, 15, 20, 0.95)',
                      border: `2px solid ${isSelected ? '#00D5FF' : 'rgba(142, 154, 168, 0.4)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isSelected ? '0 0 20px #00D5FF' : '0 0 8px rgba(0, 0, 0, 0.6)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {node.id === 'cloud' && <Globe size={isSelected ? 22 : 18} color="#00D5FF" />}
                    {node.id === 'edge-hub' && <Server size={isSelected ? 22 : 18} color="#00D5FF" />}
                    {node.id === 'spot-mesh' && <Radio size={isSelected ? 22 : 18} color="#00E699" />}
                    {node.id === 'stretch-cell' && <Cpu size={isSelected ? 22 : 18} color="#FFA000" />}
                    {node.id === 'atlas-cell' && <Shield size={isSelected ? 22 : 18} color="#00D5FF" />}
                    {node.id === 'operator-hud' && <Smartphone size={isSelected ? 22 : 18} color="#E9F1F8" />}
                  </div>

                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: isSelected ? '#00D5FF' : 'var(--text-secondary)',
                      backgroundColor: 'rgba(11, 15, 20, 0.85)',
                      padding: '2px 6px',
                      borderRadius: 3,
                      border: '1px solid var(--border-subtle)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {node.name}
                  </span>
                </button>
              );
            })}

            {/* Bottom hint */}
            <div
              style={{
                position: 'absolute',
                bottom: 12,
                left: 16,
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--text-secondary)',
              }}
            >
              CLICK ANY TOPOLOGY NODE TO INSPECT PROTOCOL
            </div>
          </div>

          {/* Node Diagnostics Panel */}
          <div
            className="glass-panel blueprint-box"
            style={{
              padding: 28,
              minHeight: '460px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00D5FF' }}>
                  NODE // {selectedNode.category.toUpperCase()}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00E699' }}>
                  STATE: SYNCHRONIZED
                </span>
              </div>

              <h3 style={{ fontSize: '1.4rem', color: 'var(--text-snow)', marginBottom: 12 }}>
                {selectedNode.name}
              </h3>

              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: 24 }}>
                {selectedNode.role}
              </p>

              {/* Protocol Specs Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: 20 }}>
                <div style={{ backgroundColor: 'rgba(11, 15, 20, 0.7)', border: '1px solid var(--border-subtle)', padding: 12, borderRadius: 4 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>TRANSPORT PROTOCOL</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#00D5FF', fontWeight: 600 }}>{selectedNode.protocol}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ backgroundColor: 'rgba(11, 15, 20, 0.7)', border: '1px solid var(--border-subtle)', padding: 12, borderRadius: 4 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>ROUNDTRIP LATENCY</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: '#00E699', fontWeight: 600 }}>{selectedNode.latencyMs} ms</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(11, 15, 20, 0.7)', border: '1px solid var(--border-subtle)', padding: 12, borderRadius: 4 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>BUS BANDWIDTH</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--text-snow)', fontWeight: 600 }}>{selectedNode.bandwidthMbps} Mbps</div>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                paddingTop: 16,
                borderTop: '1px solid rgba(142, 154, 168, 0.15)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-secondary)',
              }}
            >
              ENCRYPTION: AES-256-GCM HARDWARE ACCELERATED
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
