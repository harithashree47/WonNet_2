import React from 'react';
import { Icon } from './Icon';

const toneMap = {
  primary: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  success: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  warning: { bg: 'bg-amber-50', text: 'text-amber-600' },
  danger: { bg: 'bg-rose-50', text: 'text-rose-600' },
  info: { bg: 'bg-sky-50', text: 'text-sky-600' },
  purple: { bg: 'bg-violet-50', text: 'text-violet-600' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-600' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-600' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600' },
  slate: { bg: 'bg-slate-50', text: 'text-slate-600' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
};

export const ToneIcon = ({ icon, tone = 'primary', size = 'md', className = '' }) => {
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' };
  const iconSizes = { sm: 14, md: 18, lg: 22 };
  const t = toneMap[tone] || toneMap.primary;
  return (
    <div className={[sizes[size] || sizes.md, t.bg, t.text, 'rounded-xl flex items-center justify-center shrink-0', className].join(' ')}>
      <Icon name={icon} size={iconSizes[size] || 18} strokeWidth={2.25} />
    </div>
  );
};

export default ToneIcon;
