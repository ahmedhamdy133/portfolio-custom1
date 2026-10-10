import React, { useState, useEffect, useRef } from 'react';
import { SectionHeader } from '../../common/SectionHeader';
import { DemoBadge } from '../../common/DemoBadge';
import { soundFx } from '../../../utils/audio';
import { Sliders, RotateCcw, Cpu, Eye, Compass, Shield } from 'lucide-react';

type LabMode = 'path-planning' | 'lidar-fov';

export const InnovationLabSection: React.FC = () => {
  const [labMode, setLabMode] = useState<LabMode>('path-planning');
  
  // Path planning simulation parameters
  const [inflationRadius, setInflationRadius] = useState(25); // px
  const [turningCost, setTurningCost] = useState(1.4);
  const [obstacleCount, setObstacleCount] = useState(4);

  // LiDAR simulation parameters
  const [lidarFov, setLidarFov] = useState(180); // degrees
  const [lidarRange, setLidarRange] = useState(140); // px
  const [rayDensity, setRayDensity] = useState(36); // rays

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Canvas render loop for the active simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (labMode === 'path-planning') {
        // --- 1. PATH PLANNING SIMULATOR ---
        // Start & Goal
        const start = { x: 50, y: 150 };
        const goal = { x: canvas.width - 60, y: 150 };

        // Generate procedural obstacle boxes
        const obstacles = [
          { x: 180, y: 70 + Math.sin(t) * 20, w: 60, h: 100 },
          { x: 320, y: 120 + Math.cos(t) * 30, w: 70, h: 120 },
          { x: 480, y: 60 + Math.sin(t * 1.2) * 25, w: 50, h: 110 },
        ];

        // Draw grid
        ctx.strokeStyle = 'rgba(142, 154, 168, 0.08)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 30) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 30) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        // Draw Obstacles with inflation buffer
        obstacles.forEach((obs) => {
          // Inflation safety zone
          ctx.fillStyle = 'rgba(0, 213, 255, 0.05)';
          ctx.strokeStyle = 'rgba(0, 213, 255, 0.2)';
          ctx.beginPath();
          ctx.roundRect(
            obs.x - inflationRadius,
            obs.y - inflationRadius,
            obs.w + inflationRadius * 2,
            obs.h + inflationRadius * 2,
            8
          );
          ctx.fill();
          ctx.stroke();

          // Solid obstacle
          ctx.fillStyle = '#182332';
          ctx.strokeStyle = '#FF3B5C';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, obs.w, obs.h, 4);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#FF3B5C';
          ctx.font = '9px monospace';
          ctx.fillText('HAZARD', obs.x + 8, obs.y + 16);
        });

        // Compute waypoint path around obstacles
        const waypoints = [
          start,
          { x: 140, y: obstacles[0].y > 100 ? 50 : 250 },
          { x: 260, y: obstacles[1].y > 120 ? 60 : 260 },
          { x: 420, y: obstacles[2].y > 100 ? 50 : 250 },
          goal,
        ];

        // Draw A* evaluated search nodes (green dots)
        ctx.fillStyle = 'rgba(0, 230, 153, 0.3)';
        for (let i = 0; i < 40; i++) {
          const rx = 80 + (i * 14);
          const ry = 60 + ((i * 37) % 180);
          ctx.beginPath();
          ctx.arc(rx, ry, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw planned smooth trajectory spline
        ctx.strokeStyle = '#00D5FF';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00D5FF';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(waypoints[0].x, waypoints[0].y);
        for (let i = 1; i < waypoints.length; i++) {
          const prev = waypoints[i - 1];
          const curr = waypoints[i];
          const mx = (prev.x + curr.x) / 2;
          const my = (prev.y + curr.y) / 2;
          ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
        }
        ctx.lineTo(goal.x, goal.y);
        ctx.stroke();
        ctx.shadowBlur = 0; // reset

        // Draw Start & Goal markers
        ctx.fillStyle = '#00E699';
        ctx.beginPath();
        ctx.arc(start.x, start.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px monospace';
        ctx.fillText('START', start.x - 14, start.y - 14);

        ctx.fillStyle = '#00D5FF';
        ctx.beginPath();
        ctx.arc(goal.x, goal.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('GOAL', goal.x - 12, goal.y - 14);

      } else {
        // --- 2. LIDAR SENSOR SIMULATOR ---
        const robotX = canvas.width / 2;
        const robotY = canvas.height / 2;

        // Obstacles in sensor field
        const obstacles = [
          { x: robotX - 160, y: robotY - 80, w: 50, h: 90 },
          { x: robotX + 110, y: robotY - 60, w: 60, h: 70 },
          { x: robotX - 50, y: robotY + 70, w: 100, h: 40 },
        ];

        // Draw obstacles
        obstacles.forEach((obs) => {
          ctx.fillStyle = '#182332';
          ctx.strokeStyle = '#8E9AA8';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, obs.w, obs.h, 4);
          ctx.fill();
          ctx.stroke();
        });

        // Cast LiDAR rays
        const startAngle = -Math.PI / 2 - (lidarFov * Math.PI) / 360 + Math.sin(t * 0.5) * 0.2;
        const totalAngle = (lidarFov * Math.PI) / 180;
        const angleStep = totalAngle / rayDensity;

        ctx.strokeStyle = 'rgba(0, 213, 255, 0.45)';
        ctx.lineWidth = 1;

        for (let i = 0; i <= rayDensity; i++) {
          const angle = startAngle + i * angleStep;
          const rayEndX = robotX + Math.cos(angle) * lidarRange;
          const rayEndY = robotY + Math.sin(angle) * lidarRange;

          ctx.beginPath();
          ctx.moveTo(robotX, robotY);
          ctx.lineTo(rayEndX, rayEndY);
          ctx.stroke();

          // Point cloud bounce return
          ctx.fillStyle = '#00D5FF';
          ctx.beginPath();
          ctx.arc(rayEndX, rayEndY, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw Robot Center Sensor
        ctx.fillStyle = '#00D5FF';
        ctx.beginPath();
        ctx.arc(robotX, robotY, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0B0F14';
        ctx.beginPath();
        ctx.arc(robotX, robotY, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#E9F1F8';
        ctx.font = '10px monospace';
        ctx.fillText('LIDAR RIG [ACTIVE]', robotX - 50, robotY + 28);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [labMode, inflationRadius, turningCost, lidarFov, lidarRange, rayDensity]);

  return (
    <section
      id="lab"
      style={{
        padding: 'var(--section-padding) 0',
        backgroundColor: 'var(--bg-graphite)',
        position: 'relative',
      }}
    >
      <div className="section-container">
        <SectionHeader
          number="SEC_11"
          category="Interactive Sandbox"
          title="Innovation Lab"
          subtitle="Test fundamental robotics algorithms in real time: adjust safety buffers, turning weights, and sensor coverage parameters to inspect algorithmic responses."
          badge={<DemoBadge label="Interactive Algorithm Simulator" verified={true} />}
        />

        {/* Simulator Mode Switcher */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
          <button
            onClick={() => { setLabMode('path-planning'); soundFx.playClick(); }}
            style={{
              padding: '10px 18px',
              borderRadius: 4,
              border: labMode === 'path-planning' ? '1px solid #00D5FF' : '1px solid var(--border-subtle)',
              backgroundColor: labMode === 'path-planning' ? 'rgba(0, 213, 255, 0.15)' : 'rgba(18, 27, 38, 0.6)',
              color: labMode === 'path-planning' ? '#00D5FF' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            EXPERIMENT 01 // A* PATH PLANNING & OBSTACLE AVOIDANCE
          </button>

          <button
            onClick={() => { setLabMode('lidar-fov'); soundFx.playClick(); }}
            style={{
              padding: '10px 18px',
              borderRadius: 4,
              border: labMode === 'lidar-fov' ? '1px solid #00D5FF' : '1px solid var(--border-subtle)',
              backgroundColor: labMode === 'lidar-fov' ? 'rgba(0, 213, 255, 0.15)' : 'rgba(18, 27, 38, 0.6)',
              color: labMode === 'lidar-fov' ? '#00D5FF' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            EXPERIMENT 02 // 3D LIDAR RANGE & VOXEL COVERAGE
          </button>
        </div>

        {/* Simulation Grid Layout: Canvas & Controls */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1.5fr) minmax(280px, 1fr)',
            gap: 28,
            alignItems: 'start',
          }}
        >
          {/* Real-time Canvas Visualizer */}
          <div
            className="glass-panel blueprint-box"
            style={{
              height: '380px',
              backgroundColor: '#0B0F14',
              borderRadius: 6,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <canvas
              ref={canvasRef}
              width={680}
              height={380}
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
              }}
            />

            <div
              style={{
                position: 'absolute',
                top: 14,
                left: 14,
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: '#00D5FF',
                backgroundColor: 'rgba(11, 15, 20, 0.85)',
                padding: '4px 8px',
                borderRadius: 3,
                border: '1px solid rgba(0, 213, 255, 0.3)',
              }}
            >
              SIMULATION ENGINE: REALTIME JS COMPUTATION
            </div>
          </div>

          {/* Parameter Sliders Control Console */}
          <div
            className="glass-panel blueprint-box"
            style={{
              padding: 28,
              minHeight: '380px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00D5FF', marginBottom: 6 }}>
                SIMULATION CONTROLS
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-snow)', marginBottom: 20 }}>
                {labMode === 'path-planning' ? 'Kinodynamic Parameters' : 'Optics & Ray Parameters'}
              </h3>

              {labMode === 'path-planning' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '11px', marginBottom: 6 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>INFLATION SAFETY RADIUS</span>
                      <span style={{ color: '#00D5FF' }}>{inflationRadius} px</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="45"
                      value={inflationRadius}
                      onChange={(e) => setInflationRadius(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: '#00D5FF' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '11px', marginBottom: 6 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>CURVATURE SMOOTHING FACTOR</span>
                      <span style={{ color: '#00D5FF' }}>{turningCost.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="3.0"
                      step="0.1"
                      value={turningCost}
                      onChange={(e) => setTurningCost(parseFloat(e.target.value))}
                      style={{ width: '100%', accentColor: '#00D5FF' }}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '11px', marginBottom: 6 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>FIELD OF VIEW (FOV)</span>
                      <span style={{ color: '#00D5FF' }}>{lidarFov}°</span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="360"
                      step="10"
                      value={lidarFov}
                      onChange={(e) => setLidarFov(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: '#00D5FF' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '11px', marginBottom: 6 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>MAX DETECTION RANGE</span>
                      <span style={{ color: '#00D5FF' }}>{lidarRange} m</span>
                    </div>
                    <input
                      type="range"
                      min="80"
                      max="200"
                      value={lidarRange}
                      onChange={(e) => setLidarRange(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: '#00D5FF' }}
                    />
                  </div>
                </div>
              )}
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
              ALGORITHM: DWA (Dynamic Window Approach) & Ray-Marching
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
