import React, { useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { soundFx } from './audio';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: (e: React.MouseEvent) => void;
  ariaLabel?: string;
  id?: string;
  dataTarget?: string;
  style?: React.CSSProperties;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  strength = 0.28,
  onClick,
  ariaLabel,
  id,
  dataTarget,
  style,
}) => {
  const btnRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = btnRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    gsap.to(el, {
      x: x * strength,
      y: y * strength,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseEnter = () => {
    soundFx.playHover();
  };

  const handleMouseLeave = () => {
    const el = btnRef.current;
    if (!el) return;

    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    soundFx.playClick();
    if (onClick) onClick(e);
  };

  return (
    <div
      ref={btnRef}
      id={id}
      data-target={dataTarget}
      className={`magnetic-wrapper ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      aria-label={ariaLabel}
      style={{ display: 'inline-block', willChange: 'transform', ...style }}
    >
      {children}
    </div>
  );
};
