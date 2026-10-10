// ==========================================================================
// UNIT-01 Autonomous Companion Robot - Types & Interfaces
// ==========================================================================

export type CompanionPose = 
  | 'idle' 
  | 'scanning' 
  | 'lifting' 
  | 'console-typing' 
  | 'alert' 
  | 'observing';

export interface TargetCoordinates {
  x: number; // screen pixel X
  y: number; // screen pixel Y
  width?: number;
  height?: number;
  label?: string;
}

export interface JointAngles {
  baseYaw: number;      // Turret rotation around Y axis (radians)
  shoulderPitch: number;// Shoulder joint elevation (radians)
  elbowPitch: number;   // Elbow joint bend (radians)
  wristPitch: number;   // Wrist angle (radians)
}

export interface RobotState {
  enabled: boolean;
  currentPose: CompanionPose;
  target: TargetCoordinates | null;
  isPressing: boolean;
  scrollVelocity: number;
  mode: 'webgl' | 'svg';
  lowPowerMode: boolean;
}

export interface CompanionAPI {
  enabled: boolean;
  currentPose: CompanionPose;
  target: TargetCoordinates | null;
  isPressing: boolean;
  setPose: (pose: CompanionPose) => void;
  setTarget: (elementOrCoords: HTMLElement | TargetCoordinates | null) => void;
  enable: () => void;
  disable: () => void;
  toggleEnabled: () => void;
  toggleLowPowerMode: () => void;
  lowPowerMode: boolean;
  onPoseChange?: (cb: (pose: CompanionPose) => void) => () => void;
}
