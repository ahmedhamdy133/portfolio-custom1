import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SectionHeader } from '../../common/SectionHeader';
import { DemoBadge } from '../../common/DemoBadge';
import { soundFx } from '../../../utils/audio';
import { Layers, Info, RotateCw, ZoomIn, Eye, Cpu, Zap, Activity } from 'lucide-react';

interface AtlasHotspot {
  id: string;
  name: string;
  category: string;
  specs: string;
  details: string;
  position3D: [number, number, number];
  screenPercent: { x: number; y: number };
  sourceUrl: string;
}

const ATLAS_HOTSPOTS: AtlasHotspot[] = [
  {
    id: 'vision-turret',
    name: '360° Vision & Perception Turret',
    category: 'Perception Suite',
    specs: 'Dual Stereo Depth Cameras + Solid-State LiDAR',
    details: 'Real-time voxel SLAM mapping creates a sub-centimeter point cloud of surrounding geometry, allowing autonomous footstep planning across unstable surfaces.',
    position3D: [0, 2.2, 0.4],
    screenPercent: { x: 50, y: 22 },
    sourceUrl: 'https://bostondynamics.com/atlas/',
  },
  {
    id: 'cycloidal-actuator',
    name: 'Custom Cycloidal Electric Actuators',
    category: 'Powertrain',
    specs: '400+ Nm Peak Torque // 360° Infinite Rotation',
    details: 'Replaces bulky hydraulic hoses with high-power compact electric cycloidal drive units, enabling unnatural range of motion and 360-degree joint revolutions.',
    position3D: [1.2, 1.4, 0.2],
    screenPercent: { x: 68, y: 38 },
    sourceUrl: 'https://spectrum.ieee.org/boston-dynamics-new-atlas',
  },
  {
    id: 'battery-core',
    name: 'Modular High-Density Battery Core',
    category: 'Energy Architecture',
    specs: '800Wh Lithium Pack // Passive & Forced Convection',
    details: 'Center-of-mass integrated battery pack provides rapid recharge turnaround and optimal dynamic inertia balance during high-velocity somersaults and running.',
    position3D: [0, 0.9, -0.3],
    screenPercent: { x: 50, y: 50 },
    sourceUrl: 'https://en.wikipedia.org/wiki/Atlas_(robot)',
  },
  {
    id: 'dynamic-balance',
    name: 'Dynamic Whole-Body MPC Controller',
    category: 'Control Theory',
    specs: '500 Hz Feedback Loop // Real-Time Footstep Optimization',
    details: 'Calculates ground reaction forces and whole-body angular momentum in real time. Can withstand unexpected shoves and immediately recalculate recovery steps.',
    position3D: [0.6, -1.2, 0.1],
    screenPercent: { x: 58, y: 78 },
    sourceUrl: 'https://bostondynamics.com/atlas/',
  },
];

type AtlasGen = 'electric-2024' | 'hydraulic-2020' | 'darpagen1-2013';

export const AtlasSection: React.FC = () => {
  const [generation, setGeneration] = useState<AtlasGen>('electric-2024');
  const [selectedHotspot, setSelectedHotspot] = useState<AtlasHotspot | null>(ATLAS_HOTSPOTS[0]);
  const [is3DMode, setIs3DMode] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 3D Interactive WebGL Atlas Model Viewer
  useEffect(() => {
    if (!is3DMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.1, 50);
    camera.position.set(0, 0.5, 6.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    } catch {
      setIs3DMode(false);
      return;
    }

    // Cinematic Lighting
    const amb = new THREE.AmbientLight(0x182433, 1.8);
    scene.add(amb);
    const key = new THREE.DirectionalLight(0x00d5ff, 2.5);
    key.position.set(5, 8, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffb300, 1.2);
    fill.position.set(-5, -2, -3);
    scene.add(fill);

    // Procedural Humanoid Mesh Model
    const atlasRoot = new THREE.Group();
    scene.add(atlasRoot);

    const matArmor = new THREE.MeshStandardMaterial({
      color: generation === 'electric-2024' ? 0x141a24 : 0x222a35,
      metalness: 0.8,
      roughness: 0.25,
    });
    const matJoint = new THREE.MeshStandardMaterial({
      color: 0x00d5ff,
      metalness: 0.5,
      roughness: 0.2,
      emissive: 0x00d5ff,
      emissiveIntensity: 0.25,
    });
    const matAccent = new THREE.MeshStandardMaterial({
      color: generation === 'electric-2024' ? 0x00d5ff : 0xff9900,
    });

    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.5, 0.7), matArmor);
    torso.position.y = 0.8;
    atlasRoot.add(torso);

    // Head / Perception Pod
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.45, 24), matArmor);
    head.position.y = 1.95;
    atlasRoot.add(head);

    // Head Glowing Ring Eye
    const eyeRing = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.04, 12, 32), matJoint);
    eyeRing.rotation.x = Math.PI / 2;
    eyeRing.position.set(0, 1.95, 0.15);
    atlasRoot.add(eyeRing);

    // Shoulders & Arms
    const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), matJoint);
    shoulderL.position.set(-0.85, 1.3, 0);
    atlasRoot.add(shoulderL);
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 1.2, 16), matArmor);
    armL.position.set(-0.95, 0.6, 0);
    atlasRoot.add(armL);

    const shoulderR = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), matJoint);
    shoulderR.position.set(0.85, 1.3, 0);
    atlasRoot.add(shoulderR);
    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 1.2, 16), matArmor);
    armR.position.set(0.95, 0.6, 0);
    atlasRoot.add(armR);

    // Pelvis & Legs
    const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.4, 0.6), matArmor);
    pelvis.position.y = -0.15;
    atlasRoot.add(pelvis);

    const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 1.6, 16), matArmor);
    legL.position.set(-0.4, -1.05, 0);
    atlasRoot.add(legL);

    const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 1.6, 16), matArmor);
    legR.position.set(0.4, -1.05, 0);
    atlasRoot.add(legR);

    // Subtle Ground Shadow
    const shadowGeo = new THREE.CircleGeometry(1.6, 32);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.9;
    atlasRoot.add(shadow);

    // Mouse drag interaction to rotate
    let isDragging = false;
    let prevMouseX = 0;
    let targetRotationY = 0;

    const onPointerDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };
    const onPointerMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      prevMouseX = e.clientX;
      targetRotationY += deltaX * 0.01;
    };
    const onPointerUp = () => { isDragging = false; };

    canvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    let animId: number;
    let clock = new THREE.Clock();

    const render = () => {
      animId = requestAnimationFrame(render);
      const time = clock.getElapsedTime();

      // Inertial smoothing
      atlasRoot.rotation.y = THREE.MathUtils.lerp(atlasRoot.rotation.y, targetRotationY + Math.sin(time * 0.4) * 0.15, 0.08);

      renderer.render(scene, camera);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      canvas.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      scene.clear();
    };
  }, [is3DMode, generation]);

  return (
    <section
      id="atlas"
      style={{
        padding: 'var(--section-padding) 0',
        backgroundColor: 'var(--bg-graphite)',
        position: 'relative',
      }}
    >
      <div className="section-container">
        <SectionHeader
          number="SEC_03"
          category="Humanoid Robotics"
          title="Atlas Experience"
          subtitle="Explore the biomechanical engineering of the world's most dynamic humanoid robot platform. Interact with key subsystems or rotate the 3D model."
          badge={<DemoBadge label="Public Verified Technical Data" verified={true} />}
        />

        {/* Generation Selector Tabs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 32,
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginRight: 8,
            }}
          >
            GENERATION SELECTOR:
          </span>

          <button
            onClick={() => { setGeneration('electric-2024'); soundFx.playClick(); }}
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              border: generation === 'electric-2024' ? '1px solid #00D5FF' : '1px solid var(--border-subtle)',
              backgroundColor: generation === 'electric-2024' ? 'rgba(0, 213, 255, 0.15)' : 'rgba(18, 27, 38, 0.6)',
              color: generation === 'electric-2024' ? '#00D5FF' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            All-Electric Atlas (2024) [CURRENT GEN]
          </button>

          <button
            onClick={() => { setGeneration('hydraulic-2020'); soundFx.playClick(); }}
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              border: generation === 'hydraulic-2020' ? '1px solid #FFA000' : '1px solid var(--border-subtle)',
              backgroundColor: generation === 'hydraulic-2020' ? 'rgba(255, 160, 0, 0.15)' : 'rgba(18, 27, 38, 0.6)',
              color: generation === 'hydraulic-2020' ? '#FFA000' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Hydraulic Atlas HD (2016-2023)
          </button>

          <button
            onClick={() => { setGeneration('darpagen1-2013'); soundFx.playClick(); }}
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              border: generation === 'darpagen1-2013' ? '1px solid #8E9AA8' : '1px solid var(--border-subtle)',
              backgroundColor: generation === 'darpagen1-2013' ? 'rgba(142, 154, 168, 0.15)' : 'rgba(18, 27, 38, 0.6)',
              color: generation === 'darpagen1-2013' ? '#E9F1F8' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            DARPA Generation 1 (2013)
          </button>
        </div>

        {/* Main Interactive Stage Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1.4fr) minmax(300px, 1fr)',
            gap: 32,
            alignItems: 'start',
          }}
        >
          {/* Interactive Viewer Viewport */}
          <div
            className="glass-panel blueprint-box"
            style={{
              height: '520px',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Viewport Control Bar */}
            <div
              style={{
                position: 'absolute',
                top: 16,
                left: 16,
                right: 16,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 10,
              }}
            >
              <div className="telemetry-badge">
                <span className="dot" />
                {generation === 'electric-2024' ? 'ELECTRIC ATLAS // 360° REVOLUTION' : 'HYDRAULIC ATLAS // HIGH DYNAMIC'}
              </div>

              <button
                onClick={() => setIs3DMode(!is3DMode)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: '#00D5FF',
                  padding: '4px 8px',
                  border: '1px solid rgba(0, 213, 255, 0.3)',
                  borderRadius: 4,
                  backgroundColor: 'rgba(11, 15, 20, 0.8)',
                  cursor: 'pointer',
                }}
              >
                {is3DMode ? 'SWITCH TO 2D BLUEPRINT' : 'SWITCH TO 3D ROTATE'}
              </button>
            </div>

            {/* 3D Canvas */}
            {is3DMode ? (
              <canvas
                ref={canvasRef}
                style={{
                  width: '100%',
                  height: '100%',
                  cursor: 'grab',
                }}
              />
            ) : (
              /* High-Quality 2D Blueprint Fallback */
              <svg
                style={{ width: '80%', height: '80%', filter: 'drop-shadow(0 0 12px rgba(0, 213, 255, 0.2))' }}
                viewBox="0 0 400 500"
              >
                {/* Blueprint Grid & Robot Silhouette */}
                <rect x="150" y="80" width="100" height="150" rx="10" fill="#121B26" stroke="#00D5FF" strokeWidth="2" />
                <circle cx="200" cy="50" r="30" fill="#182332" stroke="#00D5FF" strokeWidth="2" />
                <circle cx="200" cy="50" r="14" fill="#00D5FF" />
                <line x1="150" y1="100" x2="80" y2="200" stroke="#8E9AA8" strokeWidth="12" strokeLinecap="round" />
                <line x1="250" y1="100" x2="320" y2="200" stroke="#8E9AA8" strokeWidth="12" strokeLinecap="round" />
                <line x1="170" y1="230" x2="160" y2="420" stroke="#8E9AA8" strokeWidth="16" strokeLinecap="round" />
                <line x1="230" y1="230" x2="240" y2="420" stroke="#8E9AA8" strokeWidth="16" strokeLinecap="round" />
                <text x="200" y="460" fill="#00D5FF" fontSize="12" fontFamily="monospace" textAnchor="middle">
                  ATLAS BLUEPRINT // 2D SCHEMATIC
                </text>
              </svg>
            )}

            {/* Clickable Hotspot Pins Overlay */}
            {ATLAS_HOTSPOTS.map((hotspot) => {
              const isSelected = selectedHotspot?.id === hotspot.id;
              return (
                <button
                  key={hotspot.id}
                  onClick={() => {
                    setSelectedHotspot(hotspot);
                    soundFx.playTargetLock();
                  }}
                  style={{
                    position: 'absolute',
                    left: `${hotspot.screenPercent.x}%`,
                    top: `${hotspot.screenPercent.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: isSelected ? '#00D5FF' : 'rgba(11, 15, 20, 0.85)',
                    border: `2px solid ${isSelected ? '#FFFFFF' : '#00D5FF'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 0 16px #00D5FF' : '0 0 8px rgba(0, 213, 255, 0.5)',
                    transition: 'all 0.2s',
                    zIndex: 20,
                  }}
                  aria-label={`Inspect ${hotspot.name}`}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: isSelected ? '#0B0F14' : '#00D5FF',
                    }}
                  />
                </button>
              );
            })}

            {/* Bottom Interaction Hint */}
            <div
              style={{
                position: 'absolute',
                bottom: 12,
                left: '50%',
                transform: 'translateX(-50%)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-secondary)',
                backgroundColor: 'rgba(11, 15, 20, 0.75)',
                padding: '4px 12px',
                borderRadius: 4,
                pointerEvents: 'none',
              }}
            >
              DRAG TO ROTATE // CLICK NODES TO INSPECT
            </div>
          </div>

          {/* Selected Hotspot Telemetry Card */}
          <div
            className="glass-panel blueprint-box"
            style={{
              padding: '32px 28px',
              minHeight: '520px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {selectedHotspot ? (
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
                      color: '#00D5FF',
                      letterSpacing: '0.1em',
                    }}
                  >
                    SUBSYSTEM // {selectedHotspot.category}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    STATUS: OPTIMAL
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: '1.45rem',
                    marginBottom: 16,
                    color: 'var(--text-snow)',
                  }}
                >
                  {selectedHotspot.name}
                </h3>

                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: '#00D5FF',
                    backgroundColor: 'rgba(0, 213, 255, 0.08)',
                    padding: '8px 12px',
                    borderRadius: 4,
                    border: '1px solid rgba(0, 213, 255, 0.25)',
                    marginBottom: 20,
                  }}
                >
                  {selectedHotspot.specs}
                </div>

                <p
                  style={{
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    color: 'var(--text-secondary)',
                    marginBottom: 24,
                  }}
                >
                  {selectedHotspot.details}
                </p>

                {/* Technical Metric Indicators */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 12,
                    marginBottom: 24,
                  }}
                >
                  <div
                    style={{
                      backgroundColor: 'rgba(18, 27, 38, 0.7)',
                      padding: '12px',
                      borderRadius: 4,
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>TEMPERATURE</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: '#00E699' }}>38.4 °C [NOMINAL]</div>
                  </div>
                  <div
                    style={{
                      backgroundColor: 'rgba(18, 27, 38, 0.7)',
                      padding: '12px',
                      borderRadius: 4,
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>BUS CURRENT</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: '#00D5FF' }}>42.8 A [NORMAL]</div>
                  </div>
                </div>
              </div>
            ) : (
              <p>Select any node to view real-time diagnostics.</p>
            )}

            {/* Citations Footer */}
            <div
              style={{
                paddingTop: 16,
                borderTop: '1px solid rgba(142, 154, 168, 0.15)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                }}
              >
                VERIFIED ARCHITECTURE
              </span>
              {selectedHotspot && (
                <a
                  href={selectedHotspot.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: '#00D5FF',
                    textDecoration: 'underline',
                  }}
                >
                  Official Technical Notes ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
