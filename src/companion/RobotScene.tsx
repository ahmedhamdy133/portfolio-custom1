import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useCompanionRobot } from './CompanionContext';
import { solveIK, ServoSpring } from './ikSolver';

export const RobotScene: React.FC = () => {
  const { enabled, currentPose, target, isPressing, lowPowerMode } = useCompanionRobot();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hudTelemetry, setHudTelemetry] = useState<{ x: number; y: number; pose: string; reach: number }>({
    x: 0,
    y: 0,
    pose: 'idle',
    reach: 0,
  });

  // Keep references for animation loop
  const animFrameRef = useRef<number | null>(null);
  const targetRef = useRef(target);
  const isPressingRef = useRef(isPressing);
  const currentPoseRef = useRef(currentPose);
  const enabledRef = useRef(enabled);

  useEffect(() => { targetRef.current = target; }, [target]);
  useEffect(() => { isPressingRef.current = isPressing; }, [isPressing]);
  useEffect(() => { currentPoseRef.current = currentPose; }, [currentPose]);
  useEffect(() => { enabledRef.current = enabled; }, [enabled]);

  // Three.js Scene Setup
  useEffect(() => {
    if (!enabled || lowPowerMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0f14, 0.035);

    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    // Camera placed to frame robot at bottom-right / background center-right
    camera.position.set(0, 3, 13);
    camera.lookAt(0, 2.5, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: window.devicePixelRatio < 2,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
    } catch (e) {
      console.warn('WebGL init failed, using fallback:', e);
      return;
    }

    // 2. Cinematic Lighting
    const ambientLight = new THREE.AmbientLight(0x182433, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00d5ff, 2.4);
    keyLight.position.set(8, 12, 10);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x00d5ff, 3.5, 25);
    rimLight.position.set(-6, 8, -4);
    scene.add(rimLight);

    const bottomGlow = new THREE.PointLight(0x00e699, 1.5, 15);
    bottomGlow.position.set(2, -2, 4);
    scene.add(bottomGlow);

    // 3. Procedural Robot Materials
    const darkArmorMat = new THREE.MeshStandardMaterial({
      color: 0x11161d,
      metalness: 0.85,
      roughness: 0.25,
    });

    const brushedMetalMat = new THREE.MeshStandardMaterial({
      color: 0x3d4a58,
      metalness: 0.92,
      roughness: 0.35,
    });

    const cyanGlowMat = new THREE.MeshBasicMaterial({
      color: 0x00d5ff,
    });

    const orangeAccentMat = new THREE.MeshStandardMaterial({
      color: 0xffa000,
      metalness: 0.5,
      roughness: 0.4,
    });

    // 4. Construct Articulated Robot Hierarchy
    const robotRoot = new THREE.Group();
    // Position base slightly to the right, floating gracefully in the background
    robotRoot.position.set(3.8, -1.8, 0);
    scene.add(robotRoot);

    // Base pedestal & turntable
    const basePedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.9, 0.6, 32), darkArmorMat);
    robotRoot.add(basePedestal);

    // Turntable glowing ring
    const baseRing = new THREE.Mesh(new THREE.TorusGeometry(1.62, 0.04, 16, 64), cyanGlowMat);
    baseRing.rotation.x = Math.PI / 2;
    robotRoot.add(baseRing);

    // Base Turret (rotates around Y)
    const baseTurret = new THREE.Group();
    baseTurret.position.y = 0.3;
    robotRoot.add(baseTurret);

    const turretHousing = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 0.8, 24), brushedMetalMat);
    baseTurret.add(turretHousing);

    // Shoulder Joint
    const shoulderPivot = new THREE.Group();
    shoulderPivot.position.set(0, 0.6, 0);
    baseTurret.add(shoulderPivot);

    const shoulderSphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 24, 24), darkArmorMat);
    shoulderPivot.add(shoulderSphere);

    const shoulderAccent = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.05, 16, 32), cyanGlowMat);
    shoulderAccent.rotation.y = Math.PI / 2;
    shoulderPivot.add(shoulderAccent);

    // Upper Arm Link (Length: 3.2 units)
    const upperArm = new THREE.Group();
    shoulderPivot.add(upperArm);

    const upperArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3.2, 0.6), darkArmorMat);
    upperArmMesh.position.y = 1.6;
    upperArm.add(upperArmMesh);

    const upperArmRod = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.0, 16), brushedMetalMat);
    upperArmRod.position.set(0.32, 1.6, 0);
    upperArm.add(upperArmRod);

    // Elbow Joint (Length: 2.8 units)
    const elbowPivot = new THREE.Group();
    elbowPivot.position.set(0, 3.2, 0);
    upperArm.add(elbowPivot);

    const elbowHinge = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.7, 24), brushedMetalMat);
    elbowHinge.rotation.z = Math.PI / 2;
    elbowPivot.add(elbowHinge);

    // Forearm Link
    const forearm = new THREE.Group();
    elbowPivot.add(forearm);

    const forearmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.8, 0.45), darkArmorMat);
    forearmMesh.position.y = 1.4;
    forearm.add(forearmMesh);

    const forearmOrangeBand = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.3, 0.47), orangeAccentMat);
    forearmOrangeBand.position.y = 2.1;
    forearm.add(forearmOrangeBand);

    // Wrist Pivot
    const wristPivot = new THREE.Group();
    wristPivot.position.set(0, 2.8, 0);
    forearm.add(wristPivot);

    const wristBall = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), brushedMetalMat);
    wristPivot.add(wristBall);

    // End-Effector / Gripper Head + Laser Diode
    const endEffector = new THREE.Group();
    wristPivot.add(endEffector);

    const gripperMount = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.4), darkArmorMat);
    gripperMount.position.y = 0.25;
    endEffector.add(gripperMount);

    // Dual Fingers
    const fingerLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7, 0.15), brushedMetalMat);
    fingerLeft.position.set(-0.2, 0.65, 0);
    endEffector.add(fingerLeft);

    const fingerRight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7, 0.15), brushedMetalMat);
    fingerRight.position.set(0.2, 0.65, 0);
    endEffector.add(fingerRight);

    // Laser Emitter Diode
    const laserDiode = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.15, 12), cyanGlowMat);
    laserDiode.position.y = 0.45;
    endEffector.add(laserDiode);

    // Servo Physics Springs for Natural Motion
    const baseYawSpring = new ServoSpring(0, 140, 20);
    const shoulderSpring = new ServoSpring(0.3, 120, 18);
    const elbowSpring = new ServoSpring(-1.2, 130, 19);
    const wristSpring = new ServoSpring(-0.3, 160, 22);

    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let clock = new THREE.Clock();

    // 5. Animation Render Loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      if (document.hidden) return; // Pause when tab hidden

      const dt = Math.min(clock.getDelta(), 0.05);
      const time = clock.getElapsedTime();

      // Scroll velocity decay
      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      scrollVelocity = scrollVelocity * 0.9 + scrollDiff * 0.008;

      // Base spring displacement on scroll
      robotRoot.rotation.z = THREE.MathUtils.lerp(robotRoot.rotation.z, -scrollVelocity * 0.25, 0.1);
      robotRoot.position.y = THREE.MathUtils.lerp(robotRoot.position.y, -1.8 - Math.min(0.5, Math.abs(scrollVelocity)), 0.1);

      // Check current target or pose
      const activeTarget = targetRef.current;
      const activePose = currentPoseRef.current;
      const isPress = isPressingRef.current;

      if (activeTarget) {
        // Convert screen pixel coordinates (X, Y) to Three.js view coordinates
        const ndcX = (activeTarget.x / window.innerWidth) * 2 - 1;
        const ndcY = -(activeTarget.y / window.innerHeight) * 2 + 1;

        // Project onto robot's work plane
        const targetWorldX = ndcX * 6.5 - robotRoot.position.x;
        const targetWorldY = ndcY * 4.8 - robotRoot.position.y;
        const targetWorldZ = isPress ? 3.8 : 2.5; // Press moves arm forward

        const ik = solveIK(targetWorldX, targetWorldY, targetWorldZ);

        baseYawSpring.setTarget(ik.baseYaw);
        shoulderSpring.setTarget(ik.shoulderPitch);
        elbowSpring.setTarget(ik.elbowPitch);
        wristSpring.setTarget(ik.wristPitch);

        setHudTelemetry({
          x: Math.round(activeTarget.x),
          y: Math.round(activeTarget.y),
          pose: 'TRACKING_NODE',
          reach: Math.round(Math.sqrt(targetWorldX * targetWorldX + targetWorldY * targetWorldY) * 20),
        });
      } else {
        // Presets when idle or per-section
        let targetYaw = 0;
        let targetShoulder = 0.4;
        let targetElbow = -1.3;
        let targetWrist = -0.4;

        if (activePose === 'scanning') {
          targetYaw = Math.sin(time * 0.8) * 0.65;
          targetShoulder = 0.6 + Math.cos(time * 0.5) * 0.15;
          targetElbow = -1.6;
        } else if (activePose === 'lifting') {
          targetYaw = -0.3;
          targetShoulder = 1.1;
          targetElbow = -0.8;
          targetWrist = -0.2;
        } else if (activePose === 'console-typing') {
          targetYaw = -0.5 + Math.sin(time * 4) * 0.05;
          targetShoulder = 0.3 + Math.cos(time * 6) * 0.03;
          targetElbow = -1.8;
          targetWrist = 0.2;
        } else if (activePose === 'alert') {
          targetYaw = 0.2;
          targetShoulder = 1.3;
          targetElbow = -0.5;
          targetWrist = 0.0;
        } else {
          // Idle breathing
          targetYaw = Math.sin(time * 0.4) * 0.2;
          targetShoulder = 0.35 + Math.sin(time * 0.7) * 0.06;
          targetElbow = -1.25 + Math.cos(time * 0.7) * 0.06;
        }

        baseYawSpring.setTarget(targetYaw);
        shoulderSpring.setTarget(targetShoulder);
        elbowSpring.setTarget(targetElbow);
        wristSpring.setTarget(targetWrist);

        if (Math.random() < 0.05) {
          setHudTelemetry({
            x: 0,
            y: 0,
            pose: activePose.toUpperCase(),
            reach: 65,
          });
        }
      }

      // Update servo physics
      baseTurret.rotation.y = baseYawSpring.update(dt);
      shoulderPivot.rotation.z = shoulderSpring.update(dt);
      elbowPivot.rotation.z = elbowSpring.update(dt);
      wristPivot.rotation.z = wristSpring.update(dt);

      // Subtle gripper flex during press
      if (isPress) {
        fingerLeft.position.x = THREE.MathUtils.lerp(fingerLeft.position.x, -0.12, 0.2);
        fingerRight.position.x = THREE.MathUtils.lerp(fingerRight.position.x, 0.12, 0.2);
      } else {
        fingerLeft.position.x = THREE.MathUtils.lerp(fingerLeft.position.x, -0.2, 0.1);
        fingerRight.position.x = THREE.MathUtils.lerp(fingerRight.position.x, 0.2, 0.1);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      scene.clear();
    };
  }, [enabled, lowPowerMode]);

  if (!enabled) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1, // Behind page content (z-index 2+)
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {/* Three.js Canvas */}
      {!lowPowerMode ? (
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.88,
          }}
        />
      ) : (
        /* Lightweight SVG Fallback for Low-Power Mode */
        <svg
          style={{
            position: 'absolute',
            bottom: 40,
            right: 40,
            width: 320,
            height: 380,
            opacity: 0.75,
            filter: 'drop-shadow(0 0 16px rgba(0, 213, 255, 0.3))',
          }}
          viewBox="0 0 200 240"
        >
          {/* Base */}
          <rect x="50" y="210" width="100" height="20" rx="4" fill="#182332" stroke="#00D5FF" strokeWidth="1.5" />
          <circle cx="100" cy="210" r="14" fill="#0B0F14" stroke="#8E9AA8" strokeWidth="1.5" />
          {/* Lower Arm */}
          <line x1="100" y1="210" x2="130" y2="120" stroke="#00D5FF" strokeWidth="8" strokeLinecap="round" />
          <circle cx="130" cy="120" r="8" fill="#11161d" stroke="#00D5FF" strokeWidth="2" />
          {/* Upper Arm */}
          <line x1="130" y1="120" x2="80" y2="50" stroke="#8E9AA8" strokeWidth="6" strokeLinecap="round" />
          <circle cx="80" cy="50" r="6" fill="#00D5FF" />
          {/* Gripper */}
          <line x1="80" y1="50" x2="60" y2="30" stroke="#00D5FF" strokeWidth="3" />
          <line x1="80" y1="50" x2="70" y2="20" stroke="#00D5FF" strokeWidth="3" />
          <text x="100" y="238" fill="#00D5FF" fontSize="9" fontFamily="monospace" textAnchor="middle">
            UNIT-01 [2D ECO]
          </text>
        </svg>
      )}

      {/* Dynamic Laser Reticle & Pulse Ring on Active Target */}
      {target && (
        <div
          style={{
            position: 'absolute',
            left: target.x,
            top: target.y,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        >
          {/* Cyan Pulse Ring on Interaction */}
          <div
            style={{
              width: (target.width ? Math.max(target.width, 36) : 36) + (isPressing ? 18 : 6),
              height: (target.height ? Math.max(target.height, 36) : 36) + (isPressing ? 18 : 6),
              borderRadius: '6px',
              border: `1.5px ${isPressing ? 'solid #00D5FF' : 'dashed rgba(0, 213, 255, 0.6)'}`,
              boxShadow: isPressing ? '0 0 24px #00D5FF, inset 0 0 12px rgba(0, 213, 255, 0.4)' : 'none',
              transform: 'translate(-50%, -50%)',
              position: 'absolute',
              transition: 'all 0.15s ease-out',
            }}
          />

          {/* Tiny Targeting Crosshair Coordinates Tag */}
          <div
            style={{
              position: 'absolute',
              left: 20,
              top: -24,
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: '#00D5FF',
              backgroundColor: 'rgba(11, 15, 20, 0.85)',
              padding: '2px 6px',
              border: '1px solid rgba(0, 213, 255, 0.4)',
              borderRadius: '2px',
              whiteSpace: 'nowrap',
            }}
          >
            IK_LOCK: {Math.round(target.x)}:{Math.round(target.y)} {isPressing ? '[PRESS]' : ''}
          </div>
        </div>
      )}

      {/* Floating HUD Companion Telemetry Indicator */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          backgroundColor: 'rgba(11, 15, 20, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(0, 213, 255, 0.25)',
          borderRadius: 4,
          padding: '8px 14px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          zIndex: 90,
          boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#00D5FF', fontWeight: 600 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00D5FF', boxShadow: '0 0 6px #00D5FF' }} />
          UNIT-01 // CO-PILOT ACTIVE
        </div>
        <div>STATE: <span style={{ color: '#E9F1F8' }}>{hudTelemetry.pose}</span></div>
        <div>
          SERVO_IK: <span style={{ color: '#8E9AA8' }}>X:{hudTelemetry.x} Y:{hudTelemetry.y} | REACH:{hudTelemetry.reach}%</span>
        </div>
      </div>
    </div>
  );
};
