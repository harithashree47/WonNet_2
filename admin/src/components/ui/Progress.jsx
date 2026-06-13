import React from 'react';

export const Progress = ({ value = 0, max = 100, tone = 'primary', size = 'md', className = '' }) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' };
  const tones = {
    primary: 'from-indigo-500 to-fuchsia-500',
    success: 'from-emerald-500 to-teal-500',
    warning: 'from-amber-500 to-orange-500',
    danger: 'from-rose-500 to-pink-500',
    info: 'from-sky-500 to-cyan-500',
  };
  return (
    <div className={['w-full bg-slate-200/70 rounded-full overflow-hidden', heights[size] || heights.md, className].join(' ')}>
      <div
        className={['h-full rounded-full bg-gradient-to-r transition-all duration-500', tones[tone] || tones.primary].join(' ')}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export default Progress;
