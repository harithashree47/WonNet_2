import React from 'react';
import { Icon } from './Icon';

const variants = {
  primary:
    'bg-slate-800 text-white shadow-lg shadow-slate-500/20 hover:bg-slate-700 hover:shadow-xl hover:shadow-slate-500/30',
  secondary:
    'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100',
  outline:
    'bg-white/70 backdrop-blur border border-slate-200 text-slate-700 hover:bg-white',
  danger:
    'bg-rose-600 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-500 hover:shadow-xl hover:shadow-rose-500/30',
  success:
    'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-500/30',
};

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
  xl: 'px-6 py-3.5 text-base',
};

const iconSizeMap = { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 };

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon = null,
  iconRight = null,
  className = '',
  type = 'button',
  onClick,
  ...rest
}) => {
  const isz = iconSizeMap[size] || 16;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      {...rest}
    >
      {loading ? (
        <svg className="animate-spin" width={isz} height={isz} viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <Icon name={icon} size={isz} strokeWidth={2.25} />
      ) : null}
      {children}
      {iconRight && !loading && <Icon name={iconRight} size={isz} strokeWidth={2.25} />}
    </button>
  );
};

export default Button;
