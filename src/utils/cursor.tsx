import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Check touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!cursor || !ring || !dot) return;

    let mouseX = -100;
    let mouseY = -100;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.08,
        ease: 'none',
      });

      gsap.to(ring, {
        x: mouseX,
        y: mouseY,
        duration: 0.22,
        ease: 'power2.out',
      });
    };

    const onMouseDown = () => {
      gsap.to(ring, {
        scale: 0.75,
        borderColor: '#00D5FF',
        backgroundColor: 'rgba(0, 213, 255, 0.25)',
        duration: 0.15,
      });
    };

    const onMouseUp = () => {
      gsap.to(ring, {
        scale: isHovering ? 1.6 : 1,
        borderColor: isHovering ? '#00D5FF' : 'rgba(0, 213, 255, 0.5)',
        backgroundColor: 'transparent',
        duration: 0.25,
      });
    };

    const handlePointerOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest('button, a, input, select, textarea, [data-interactive="true"], .interactive, .btn-cyber, .btn-cyber-outline');
      if (interactive) {
        setIsHovering(true);
        gsap.to(ring, {
          scale: 1.65,
          borderColor: '#00D5FF',
          borderWidth: 2,
          duration: 0.25,
        });
        gsap.to(dot, {
          scale: 0,
          opacity: 0,
          duration: 0.15,
        });
      }
    };

    const handlePointerOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest('button, a, input, select, textarea, [data-interactive="true"], .interactive, .btn-cyber, .btn-cyber-outline');
      if (interactive) {
        setIsHovering(false);
        gsap.to(ring, {
          scale: 1,
          borderColor: 'rgba(0, 213, 255, 0.5)',
          borderWidth: 1.5,
          duration: 0.25,
        });
        gsap.to(dot, {
          scale: 1,
          opacity: 1,
          duration: 0.15,
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', handlePointerOver);
    document.addEventListener('mouseout', handlePointerOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', handlePointerOver);
      document.removeEventListener('mouseout', handlePointerOut);
    };
  }, [isHovering]);

  if (isTouchDevice) return null;

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'screen',
      }}
      aria-hidden="true"
    >
      {/* Outer Reticle Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'absolute',
          top: -16,
          left: -16,
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '1.5px solid rgba(0, 213, 255, 0.5)',
          boxShadow: '0 0 10px rgba(0, 213, 255, 0.25)',
          pointerEvents: 'none',
          willChange: 'transform',
          transition: 'border-color 0.2s',
        }}
      >
        {/* Subtle crosshair notches */}
        <div style={{ position: 'absolute', top: -3, left: '50%', width: 1, height: 4, background: '#00D5FF', transform: 'translateX(-50%)' }} />
        <div style={{ position: 'absolute', bottom: -3, left: '50%', width: 1, height: 4, background: '#00D5FF', transform: 'translateX(-50%)' }} />
        <div style={{ position: 'absolute', left: -3, top: '50%', width: 4, height: 1, background: '#00D5FF', transform: 'translateY(-50%)' }} />
        <div style={{ position: 'absolute', right: -3, top: '50%', width: 4, height: 1, background: '#00D5FF', transform: 'translateY(-50%)' }} />
      </div>

      {/* Center Laser Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'absolute',
          top: -2.5,
          left: -2.5,
          width: 5,
          height: 5,
          borderRadius: '50%',
          backgroundColor: '#00D5FF',
          boxShadow: '0 0 8px #00D5FF',
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      />
    </div>
  );
};
