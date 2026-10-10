import React from 'react';
import { SplitTextReveal } from '../../utils/splitText';

interface SectionHeaderProps {
  number: string;
  category: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  badge?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  number,
  category,
  title,
  subtitle,
  align = 'left',
  badge,
}) => {
  return (
    <div
      style={{
        marginBottom: '48px',
        textAlign: align,
        position: 'relative',
      }}
    >
      {/* Category line & number */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          justifyContent: align === 'center' ? 'center' : 'flex-start',
          marginBottom: '10px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--accent-cyan)',
            letterSpacing: '0.14em',
            fontWeight: 600,
          }}
        >
          {number} //
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          {category}
        </span>
        {badge}
      </div>

      {/* Main Title with Split Text Animation */}
      <SplitTextReveal tag="h2" stagger={0.02} scrollTriggered={true}>
        {title}
      </SplitTextReveal>

      {/* Engineering accent line */}
      <div
        style={{
          width: align === 'center' ? '120px' : '80px',
          height: '2px',
          background: 'linear-gradient(90deg, #00D5FF 0%, rgba(0, 213, 255, 0) 100%)',
          margin: align === 'center' ? '16px auto 16px auto' : '16px 0 16px 0',
        }}
      />

      {/* Subtitle */}
      {subtitle && (
        <p
          style={{
            maxWidth: '680px',
            margin: align === 'center' ? '0 auto' : '0',
            fontSize: '1.05rem',
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
