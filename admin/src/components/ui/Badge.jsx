import React from 'react';
import { Icon } from './Icon';

const tones = {
  default: 'bg-slate-100 text-slate-700 ring-slate-200',
  primary: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200',
  danger: 'bg-rose-50 text-rose-700 ring-rose-200',
  info: 'bg-sky-50 text-sky-700 ring-sky-200',
  purple: 'bg-violet-50 text-violet-700 ring-violet-200',
  pink: 'bg-pink-50 text-pink-700 ring-pink-200',
};

const dotTones = {
  default: 'bg-slate-400',
  primary: 'bg-indigo-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  info: 'bg-sky-500',
  purple: 'bg-violet-500',
  pink: 'bg-pink-500',
};

export const Badge = ({ children, tone = 'default', dot = false, icon = null, iconSize = 10, className = '' }) => (
  <span
    className={[
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
      'ring-1 ring-inset',
      tones[tone] || tones.default,
      className,
    ].join(' ')}
  >
    {dot && <span className={['w-1.5 h-1.5 rounded-full', dotTones[tone] || dotTones.default].join(' ')}></span>}
    {icon && <Icon name={icon} size={iconSize} strokeWidth={2.5} />}
    {children}
  </span>
);

export default Badge;
