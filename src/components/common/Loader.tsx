import React, { useState, useEffect } from 'react';

interface LoaderProps {
  onComplete?: () => void;
}

export const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // If user prefers reduced motion, finish immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(false);
      if (onComplete) onComplete();
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setFading(true);
          setTimeout(() => {
            setVisible(false);
            if (onComplete) onComplete();
          }, 350);
          return 100;
        }
        const increment = Math.floor(Math.random() * 25) + 15;
        return Math.min(100, prev + increment);
      });
    }, 60);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#0B0F14',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.35s ease-out',
        pointerEvents: fading ? 'none' : 'auto',
      }}
      role="status"
      aria-live="polite"
    >
      <div style={{ width: '320px', textAlign: 'center' }}>
        {/* Futuristic Hexagon Loader Icon */}
        <div style={{ marginBottom: 24, position: 'relative', display: 'inline-block' }}>
          <svg width="64" height="64" viewBox="0 0 100 100">
            <polygon
              points="50 5, 90 27.5, 90 72.5, 50 95, 10 72.5, 10 27.5"
              fill="none"
              stroke="rgba(0, 213, 255, 0.2)"
              strokeWidth="4"
            />
            <polygon
              points="50 5, 90 27.5, 90 72.5, 50 95, 10 72.5, 10 27.5"
              fill="none"
              stroke="#00D5FF"
              strokeWidth="4"
              strokeDasharray="300"
              strokeDashoffset={300 - (300 * progress) / 100}
              style={{ transition: 'stroke-dashoffset 0.1s linear' }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: '#00D5FF',
              fontWeight: 700,
            }}
          >
            {progress}%
          </div>
        </div>

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.14em',
            color: 'var(--text-snow)',
            marginBottom: '8px',
          }}
        >
          SIGNATURE ROBOTICS EXPERIENCE
        </div>

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--text-secondary)',
            marginBottom: '16px',
          }}
        >
          {progress < 40 && 'INITIALIZING CORE TELEMETRY...'}
          {progress >= 40 && progress < 80 && 'CALIBRATING UNIT-01 IK SOLVER...'}
          {progress >= 80 && 'SYSTEMS SYNCHRONIZED [ONLINE]'}
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: '100%',
            height: '3px',
            backgroundColor: 'rgba(142, 154, 168, 0.2)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: '#00D5FF',
              boxShadow: '0 0 10px #00D5FF',
              transition: 'width 0.08s ease-out',
            }}
          />
        </div>
      </div>
    </div>
  );
};
