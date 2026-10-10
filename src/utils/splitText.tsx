import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface SplitTextRevealProps {
  children: string;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  stagger?: number;
  delay?: number;
  scrollTriggered?: boolean;
}

export const SplitTextReveal: React.FC<SplitTextRevealProps> = ({
  children,
  className = '',
  tag = 'h1',
  stagger = 0.03,
  delay = 0.1,
  scrollTriggered = true,
}) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(el.querySelectorAll('.split-char'), { opacity: 1, y: 0 });
      return;
    }

    const chars = el.querySelectorAll('.split-char');

    gsap.set(chars, {
      opacity: 0,
      y: '100%',
      rotateX: -40,
      transformOrigin: '50% 100%',
    });

    if (scrollTriggered) {
      const anim = gsap.to(chars, {
        opacity: 1,
        y: '0%',
        rotateX: 0,
        stagger,
        duration: 0.8,
        ease: 'power3.out',
        delay,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      return () => {
        anim.scrollTrigger?.kill();
        anim.kill();
      };
    } else {
      const anim = gsap.to(chars, {
        opacity: 1,
        y: '0%',
        rotateX: 0,
        stagger,
        duration: 0.9,
        ease: 'power3.out',
        delay,
      });

      return () => {
        anim.kill();
      };
    }
  }, [children, stagger, delay, scrollTriggered]);

  const Tag = tag as keyof React.JSX.IntrinsicElements;

  // Split words and letters while keeping whitespace and words intact
  const words = children.split(' ');

  return React.createElement(
    Tag,
    {
      ref: containerRef,
      className: `split-text-container ${className}`,
      style: { overflow: 'hidden', display: 'inline-block' },
      'aria-label': children,
    },
    words.map((word, wIdx) => (
      <span key={wIdx} style={{ display: 'inline-block', whiteSpace: 'nowrap', marginRight: '0.28em' }}>
        {word.split('').map((char, cIdx) => (
          <span
            key={cIdx}
            className="split-char"
            style={{ display: 'inline-block', willChange: 'transform, opacity' }}
            aria-hidden="true"
          >
            {char}
          </span>
        ))}
      </span>
    ))
  );
};
