import { JointAngles } from './unit01.types';

// Link lengths in Three.js world units
export const LINK_UPPER_ARM = 3.2;
export const LINK_FOREARM = 2.8;
export const LINK_WRIST = 1.1;

/**
 * Analytic Inverse Kinematics solver for 3-joint articulated robotic arm
 * @param targetX - X coordinate in robot local frame
 * @param targetY - Y coordinate in robot local frame
 * @param targetZ - Z coordinate in robot local frame
 */
export function solveIK(targetX: number, targetY: number, targetZ: number): JointAngles {
  // 1. Base yaw (rotation in horizontal plane)
  const baseYaw = Math.atan2(targetX, targetZ);

  // 2. Planar distance in the arm's sagittal plane
  const planarDist = Math.sqrt(targetX * targetX + targetZ * targetZ);
  const dy = targetY;

  // Total direct distance to wrist center
  const totalDist = Math.sqrt(planarDist * planarDist + dy * dy);

  // Clamp reach to avoid mathematical singularities if target is too far or too close
  const maxReach = (LINK_UPPER_ARM + LINK_FOREARM) * 0.96;
  const minReach = Math.abs(LINK_UPPER_ARM - LINK_FOREARM) * 1.15;
  const clampedDist = Math.max(minReach, Math.min(maxReach, totalDist));

  // Law of Cosines for elbow angle
  const cosElbow = (clampedDist * clampedDist - LINK_UPPER_ARM * LINK_UPPER_ARM - LINK_FOREARM * LINK_FOREARM) /
                   (2 * LINK_UPPER_ARM * LINK_FOREARM);
  
  const clampedCosElbow = Math.max(-1, Math.min(1, cosElbow));
  const elbowAngle = Math.acos(clampedCosElbow); // radians

  // Shoulder angle
  const angleToTarget = Math.atan2(dy, planarDist);
  const interiorShoulderAngle = Math.atan2(
    LINK_FOREARM * Math.sin(elbowAngle),
    LINK_UPPER_ARM + LINK_FOREARM * Math.cos(elbowAngle)
  );
  const shoulderPitch = angleToTarget + interiorShoulderAngle;

  // Wrist orientation to point roughly forward/down
  const wristPitch = -(shoulderPitch - elbowAngle) * 0.5;

  return {
    baseYaw,
    shoulderPitch: Math.max(-0.6, Math.min(1.8, shoulderPitch)),
    elbowPitch: -Math.max(0.1, Math.min(2.5, elbowAngle)),
    wristPitch: Math.max(-1.2, Math.min(1.2, wristPitch)),
  };
}

/**
 * Spring-damper physics interpolator for servo motor simulation
 */
export class ServoSpring {
  public current: number;
  public velocity: number = 0;
  public target: number;
  private stiffness: number;
  private damping: number;

  constructor(initial: number = 0, stiffness: number = 180, damping: number = 22) {
    this.current = initial;
    this.target = initial;
    this.stiffness = stiffness;
    this.damping = damping;
  }

  update(dt: number): number {
    const springForce = -this.stiffness * (this.current - this.target);
    const dampingForce = -this.damping * this.velocity;
    const acceleration = springForce + dampingForce;

    this.velocity += acceleration * dt;
    this.current += this.velocity * dt;
    return this.current;
  }

  setTarget(target: number) {
    this.target = target;
  }
}
