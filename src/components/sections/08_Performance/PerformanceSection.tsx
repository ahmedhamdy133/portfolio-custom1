import React, { useState } from 'react';
import { SectionHeader } from '../../common/SectionHeader';
import { DemoBadge } from '../../common/DemoBadge';
import { soundFx } from '../../../utils/audio';
import { TrendingUp, BarChart3, Clock, Zap } from 'lucide-react';

type TimeRange = '1h' | '24h' | '7d' | '30d';
type MetricType = 'uptime' | 'throughput' | 'battery' | 'mtbf';

interface MetricConfig {
  id: MetricType;
  label: string;
  unit: string;
  currentValue: string;
  data: Record<TimeRange, number[]>;
  timeLabels: Record<TimeRange, string[]>;
}

const METRICS: Record<MetricType, MetricConfig> = {
  uptime: {
    id: 'uptime',
    label: 'Fleet Uptime Availability',
    unit: '%',
    currentValue: '99.82%',
    data: {
      '1h': [99.7, 99.8, 99.8, 99.9, 99.8, 99.9, 99.82],
      '24h': [99.4, 99.6, 99.8, 99.7, 99.9, 99.8, 99.82],
      '7d': [99.1, 99.5, 99.7, 99.8, 99.6, 99.9, 99.82],
      '30d': [98.8, 99.2, 99.4, 99.7, 99.8, 99.7, 99.82],
    },
    timeLabels: {
      '1h': ['10:00', '10:10', '10:20', '10:30', '10:40', '10:50', '11:00'],
      '24h': ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
      '7d': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      '30d': ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
    },
  },
  throughput: {
    id: 'throughput',
    label: 'Hourly Warehouse Pick / Scan Volume',
    unit: ' units/hr',
    currentValue: '782 units/hr',
    data: {
      '1h': [710, 740, 765, 750, 790, 810, 782],
      '24h': [680, 720, 750, 790, 820, 800, 782],
      '7d': [690, 730, 740, 780, 810, 795, 782],
      '30d': [650, 700, 730, 760, 780, 790, 782],
    },
    timeLabels: {
      '1h': ['10:00', '10:10', '10:20', '10:30', '10:40', '10:50', '11:00'],
      '24h': ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
      '7d': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      '30d': ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
    },
  },
  battery: {
    id: 'battery',
    label: 'Battery Thermal & Cycle Retention',
    unit: '% Health',
    currentValue: '98.4%',
    data: {
      '1h': [98.5, 98.5, 98.5, 98.4, 98.4, 98.4, 98.4],
      '24h': [98.8, 98.7, 98.6, 98.5, 98.5, 98.4, 98.4],
      '7d': [99.0, 98.9, 98.8, 98.7, 98.6, 98.5, 98.4],
      '30d': [99.5, 99.3, 99.0, 98.8, 98.6, 98.5, 98.4],
    },
    timeLabels: {
      '1h': ['10:00', '10:10', '10:20', '10:30', '10:40', '10:50', '11:00'],
      '24h': ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
      '7d': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      '30d': ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
    },
  },
  mtbf: {
    id: 'mtbf',
    label: 'Mean Time Between Intervention (MTBF)',
    unit: ' Hours',
    currentValue: '4,280 Hrs',
    data: {
      '1h': [4250, 4260, 4270, 4275, 4280, 4280, 4280],
      '24h': [4150, 4180, 4210, 4230, 4260, 4275, 4280],
      '7d': [3900, 4000, 4120, 4180, 4220, 4260, 4280],
      '30d': [3600, 3800, 3950, 4100, 4200, 4250, 4280],
    },
    timeLabels: {
      '1h': ['10:00', '10:10', '10:20', '10:30', '10:40', '10:50', '11:00'],
      '24h': ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
      '7d': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      '30d': ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
    },
  },
};

export const PerformanceSection: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('throughput');
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const activeMetric = METRICS[selectedMetric];
  const dataPoints = activeMetric.data[timeRange];
  const labels = activeMetric.timeLabels[timeRange];

  const minVal = Math.min(...dataPoints);
  const maxVal = Math.max(...dataPoints);
  const range = maxVal - minVal || 1;

  // Chart Dimensions
  const chartWidth = 720;
  const chartHeight = 260;
  const paddingX = 40;
  const paddingY = 40;
  const graphWidth = chartWidth - paddingX * 2;
  const graphHeight = chartHeight - paddingY * 2;

  // Compute SVG Points
  const points = dataPoints.map((val, idx) => {
    const x = paddingX + (idx / (dataPoints.length - 1)) * graphWidth;
    const y = paddingY + graphHeight - ((val - minVal) / range) * graphHeight;
    return { x, y, val, label: labels[idx] };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${chartHeight - paddingY} L ${points[0].x},${chartHeight - paddingY} Z`;

  return (
    <section
      id="performance"
      style={{
        padding: 'var(--section-padding) 0',
        backgroundColor: 'var(--section-navy)',
        borderTop: '1px solid rgba(142, 154, 168, 0.12)',
        position: 'relative',
      }}
    >
      <div className="section-container">
        <SectionHeader
          number="SEC_08"
          category="Operational Intelligence"
          title="Performance & Insights"
          subtitle="Real-world operational benchmarks across commercial deployments: track throughput, fleet uptime, and component longevity with interactive time-series telemetry."
          badge={<DemoBadge label="Illustrative Performance Data" verified={false} />}
        />

        {/* Metric Selector Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            marginBottom: 28,
          }}
        >
          {(Object.keys(METRICS) as MetricType[]).map((mKey) => {
            const m = METRICS[mKey];
            const isSelected = selectedMetric === mKey;
            return (
              <button
                key={mKey}
                onClick={() => {
                  setSelectedMetric(mKey);
                  soundFx.playClick();
                }}
                className="glass-panel"
                style={{
                  padding: 18,
                  textAlign: 'left',
                  borderRadius: 6,
                  border: isSelected ? '1px solid #00D5FF' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'rgba(0, 213, 255, 0.1)' : 'var(--surface-card)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                aria-pressed={isSelected}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: isSelected ? '#00D5FF' : 'var(--text-secondary)', marginBottom: 6 }}>
                  {mKey.toUpperCase()} METRIC
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text-snow)', marginBottom: 4 }}>
                  {m.currentValue}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {m.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Time-Range & Chart Stage */}
        <div
          className="glass-panel blueprint-box"
          style={{
            padding: 32,
            position: 'relative',
          }}
        >
          {/* Header Bar with Time Selector */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--text-snow)' }}>
                {activeMetric.label}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00D5FF', marginTop: 4 }}>
                CURRENT: {activeMetric.currentValue}
              </div>
            </div>

            {/* Time Ranges */}
            <div style={{ display: 'flex', gap: 6 }}>
              {(['1h', '24h', '7d', '30d'] as TimeRange[]).map((tr) => (
                <button
                  key={tr}
                  onClick={() => { setTimeRange(tr); soundFx.playClick(); }}
                  style={{
                    padding: '6px 12px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    borderRadius: 4,
                    border: timeRange === tr ? '1px solid #00D5FF' : '1px solid var(--border-subtle)',
                    backgroundColor: timeRange === tr ? 'rgba(0, 213, 255, 0.2)' : 'rgba(11, 15, 20, 0.6)',
                    color: timeRange === tr ? '#00D5FF' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {tr.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Animated Chart */}
          <div
            style={{
              height: '280px',
              backgroundColor: '#0B0F14',
              borderRadius: 6,
              border: '1px solid rgba(0, 213, 255, 0.2)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <svg
              style={{ width: '100%', height: '100%' }}
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D5FF" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#00D5FF" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                const y = paddingY + graphHeight * (1 - pct);
                return (
                  <line
                    key={idx}
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="rgba(142, 154, 168, 0.12)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Area Gradient Fill */}
              <path d={areaD} fill="url(#chartGrad)" />

              {/* Glowing Line */}
              <path
                d={pathD}
                fill="none"
                stroke="#00D5FF"
                strokeWidth="2.5"
                filter="drop-shadow(0 0 8px rgba(0, 213, 255, 0.6))"
              />

              {/* Point Dots */}
              {points.map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r={hoverIndex === i ? 6 : 4}
                  fill={hoverIndex === i ? '#FFFFFF' : '#00D5FF'}
                  stroke="#0B0F14"
                  strokeWidth="2"
                  style={{ cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                />
              ))}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoverIndex !== null && points[hoverIndex] && (
              <div
                style={{
                  position: 'absolute',
                  left: `${(points[hoverIndex].x / chartWidth) * 100}%`,
                  top: `${(points[hoverIndex].y / chartHeight) * 100}%`,
                  transform: 'translate(-50%, -130%)',
                  backgroundColor: 'rgba(11, 15, 20, 0.95)',
                  border: '1px solid #00D5FF',
                  borderRadius: 4,
                  padding: '6px 10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: '#FFFFFF',
                  pointerEvents: 'none',
                  boxShadow: '0 4px 14px rgba(0, 213, 255, 0.3)',
                  whiteSpace: 'nowrap',
                }}
              >
                <div>{points[hoverIndex].label}</div>
                <div style={{ color: '#00D5FF', fontWeight: 700 }}>
                  {points[hoverIndex].val} {activeMetric.unit}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
