import React from 'react';

interface DemoBadgeProps {
  label?: string;
  verified?: boolean;
  citationUrl?: string;
}

export const DemoBadge: React.FC<DemoBadgeProps> = ({
  label = 'Demo / Illustrative Data',
  verified = false,
  citationUrl,
}) => {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 8px',
        fontSize: '10px',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        borderRadius: '3px',
        border: verified
          ? '1px solid rgba(0, 230, 153, 0.4)'
          : '1px solid rgba(255, 179, 0, 0.4)',
        backgroundColor: verified
          ? 'rgba(0, 230, 153, 0.08)'
          : 'rgba(255, 179, 0, 0.08)',
        color: verified ? 'var(--accent-emerald)' : 'var(--accent-amber)',
        marginRight: 8,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          backgroundColor: verified ? 'var(--accent-emerald)' : 'var(--accent-amber)',
          boxShadow: `0 0 6px ${verified ? 'var(--accent-emerald)' : 'var(--accent-amber)'}`,
        }}
      />
      {label}
      {citationUrl && (
        <a
          href={citationUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'underline', marginLeft: 4 }}
          aria-label="View source citation"
        >
          [SOURCE]
        </a>
      )}
    </span>
  );
};
