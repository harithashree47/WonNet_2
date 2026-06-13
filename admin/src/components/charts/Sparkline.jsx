import React from 'react';

export const Sparkline = ({ data = [], width = 120, height = 36, stroke = 'url(#sparkGrad)', fill = 'url(#sparkFill)' }) => {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1 || 1);

  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y];
  });

  const path = points.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ');
  const area = `${path} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={fill} />
      <path d={path} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const AreaChart = ({ data = [], labels = [], height = 240 }) => {
  if (!data.length) return null;
  const width = 600;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const max = Math.max(...data, 1);
  const min = 0;
  const stepX = innerW / (data.length - 1 || 1);

  const points = data.map((v, i) => {
    const x = padding.left + i * stepX;
    const y = padding.top + innerH - ((v - min) / (max - min || 1)) * innerH;
    return [x, y];
  });

  const linePath = points.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1][0]} ${padding.top + innerH} L ${points[0][0]} ${padding.top + innerH} Z`;

  const yTicks = 4;
  const tickValues = Array.from({ length: yTicks + 1 }, (_, i) => Math.round((max / yTicks) * i));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>

      {/* grid */}
      {tickValues.map((tv, i) => {
        const y = padding.top + innerH - (tv / max) * innerH;
        return (
          <g key={i}>
            <line x1={padding.left} y1={y} x2={padding.left + innerW} y2={y} stroke="#e2e8f0" strokeDasharray="4 4" />
            <text x={padding.left - 8} y={y + 4} textAnchor="end" className="fill-slate-400" style={{ fontSize: 10 }}>
              {tv}
            </text>
          </g>
        );
      })}

      <path d={areaPath} fill="url(#areaGrad)" />
      <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r="4" fill="#fff" stroke="#6366f1" strokeWidth="2" />
          <text x={p[0]} y={height - 8} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 10 }}>
            {labels[i] || ''}
          </text>
        </g>
      ))}
    </svg>
  );
};

export const BarChart = ({ data = [], labels = [], height = 240, tone = 'primary' }) => {
  if (!data.length) return null;
  const width = 600;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const max = Math.max(...data, 1);
  const barW = (innerW / data.length) * 0.55;
  const slotW = innerW / data.length;

  const tones = {
    primary: ['#6366f1', '#8b5cf6'],
    success: ['#10b981', '#06b6d4'],
    warning: ['#f59e0b', '#f97316'],
    danger: ['#ef4444', '#ec4899'],
  };
  const [c1, c2] = tones[tone] || tones.primary;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <defs>
        <linearGradient id={`barGrad-${tone}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((p, i) => {
        const y = padding.top + innerH - p * innerH;
        return (
          <g key={i}>
            <line x1={padding.left} y1={y} x2={padding.left + innerW} y2={y} stroke="#e2e8f0" strokeDasharray="4 4" />
            <text x={padding.left - 8} y={y + 4} textAnchor="end" className="fill-slate-400" style={{ fontSize: 10 }}>
              {Math.round(max * p)}
            </text>
          </g>
        );
      })}

      {data.map((v, i) => {
        const h = (v / max) * innerH;
        const x = padding.left + i * slotW + (slotW - barW) / 2;
        const y = padding.top + innerH - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={h} rx="6" fill={`url(#barGrad-${tone})`} />
            <text x={x + barW / 2} y={height - 8} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 10 }}>
              {labels[i] || ''}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export const DonutChart = ({ data = [], size = 180, thickness = 24 }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={thickness} />
        {data.map((d, i) => {
          const dash = (d.value / total) * circumference;
          const segment = (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${circumference}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${cx} ${cy})`}
              strokeLinecap="round"
            />
          );
          offset += dash;
          return segment;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-slate-900">{total}</div>
        <div className="text-xs text-slate-500">Total</div>
      </div>
    </div>
  );
};

export default Sparkline;
