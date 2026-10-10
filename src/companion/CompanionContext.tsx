import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { CompanionAPI, CompanionPose, TargetCoordinates } from './unit01.types';
import { soundFx } from '../utils/audio';

const CompanionContext = createContext<CompanionAPI | null>(null);

export const CompanionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [enabled, setEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('sre_unit01_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  const [lowPowerMode, setLowPowerMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('sre_low_power');
    return saved === 'true';
  });

  const [currentPose, setCurrentPoseState] = useState<CompanionPose>(() => {
    const saved = localStorage.getItem('sre_unit01_pose') as CompanionPose | null;
    return saved || 'idle';
  });

  const [target, setTargetCoords] = useState<TargetCoordinates | null>(null);
  const [isPressing, setIsPressing] = useState<boolean>(false);
  const idleTimeoutRef = useRef<number | null>(null);

  const setPose = (pose: CompanionPose) => {
    setCurrentPoseState(pose);
    localStorage.setItem('sre_unit01_pose', pose);
  };

  const enable = () => {
    setEnabled(true);
    localStorage.setItem('sre_unit01_enabled', 'true');
    soundFx.playTargetLock();
  };

  const disable = () => {
    setEnabled(false);
    localStorage.setItem('sre_unit01_enabled', 'false');
  };

  const toggleEnabled = () => {
    if (enabled) disable();
    else enable();
  };

  const toggleLowPowerMode = () => {
    setLowPowerMode((prev) => {
      const next = !prev;
      localStorage.setItem('sre_low_power', String(next));
      return next;
    });
  };

  const setTarget = (elementOrCoords: HTMLElement | TargetCoordinates | null) => {
    if (!elementOrCoords) {
      setTargetCoords(null);
      return;
    }

    if ('x' in elementOrCoords && 'y' in elementOrCoords) {
      setTargetCoords(elementOrCoords);
    } else {
      const rect = elementOrCoords.getBoundingClientRect();
      setTargetCoords({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
        label: elementOrCoords.getAttribute('aria-label') || elementOrCoords.innerText || 'TARGET',
      });
    }
  };

  // Keyboard and Pointer Interaction Listeners
  useEffect(() => {
    if (!enabled) return;

    // Hover targeting
    const handleMouseOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest('button, a, [data-target], .btn-cyber, .interactive') as HTMLElement | null;
      if (el) {
        if (idleTimeoutRef.current) window.clearTimeout(idleTimeoutRef.current);
        const rect = el.getBoundingClientRect();
        setTargetCoords({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height,
          label: el.getAttribute('aria-label') || el.innerText || 'ACTION_NODE',
        });
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest('button, a, [data-target], .btn-cyber, .interactive');
      if (el) {
        idleTimeoutRef.current = window.setTimeout(() => {
          setTargetCoords(null);
        }, 800);
      }
    };

    // Keyboard focus targeting (for accessibility)
    const handleFocusIn = (e: FocusEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && typeof el.getBoundingClientRect === 'function') {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setTargetCoords({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            width: rect.width,
            height: rect.height,
            label: el.getAttribute('aria-label') || el.innerText || 'FOCUS_NODE',
          });
          soundFx.playServo();
        }
      }
    };

    // Click mirroring / Press animation
    const handlePointerDown = () => {
      setIsPressing(true);
    };

    const handlePointerUp = () => {
      setIsPressing(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        setIsPressing(true);
        setTimeout(() => setIsPressing(false), 200);
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('keydown', handleKeyDown);
      if (idleTimeoutRef.current) window.clearTimeout(idleTimeoutRef.current);
    };
  }, [enabled]);

  return (
    <CompanionContext.Provider
      value={{
        enabled,
        currentPose,
        target,
        isPressing,
        setPose,
        setTarget,
        enable,
        disable,
        toggleEnabled,
        toggleLowPowerMode,
        lowPowerMode,
      }}
    >
      {children}
    </CompanionContext.Provider>
  );
};

export const useCompanionRobot = (): CompanionAPI => {
  const context = useContext(CompanionContext);
  if (!context) {
    throw new Error('useCompanionRobot must be used within a CompanionProvider');
  }
  return context;
};
