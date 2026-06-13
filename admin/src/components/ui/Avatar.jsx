import React from 'react';

const sizes = {
  xs: 'w-7 h-7 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const tones = {
  indigo: 'from-indigo-500 to-violet-600',
  pink: 'from-pink-500 to-rose-500',
  emerald: 'from-emerald-500 to-teal-500',
  amber: 'from-amber-500 to-orange-500',
  sky: 'from-sky-500 to-cyan-500',
  violet: 'from-violet-500 to-fuchsia-500',
  slate: 'from-slate-500 to-slate-700',
};

const tonesList = Object.keys(tones);

function pickTone(seed) {
  if (!seed) return tones.indigo;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return tones[tonesList[h % tonesList.length]];
}

function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Avatar = ({ name = '', src, size = 'md', tone, status, className = '' }) => {
  const sizeCls = sizes[size] || sizes.md;
  const toneCls = tone ? tones[tone] : pickTone(name);

  return (
    <div className={['relative inline-flex shrink-0', className].join(' ')}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={[sizeCls, 'rounded-full object-cover ring-2 ring-white'].join(' ')}
        />
      ) : (
        <div
          className={[
            sizeCls,
            'rounded-full bg-gradient-to-br text-white font-bold',
            'flex items-center justify-center ring-2 ring-white shadow-sm',
            toneCls,
          ].join(' ')}
        >
          {initials(name)}
        </div>
      )}
      {status && (
        <span
          className={[
            'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white',
            status === 'online'
              ? 'bg-emerald-500'
              : status === 'busy'
              ? 'bg-rose-500'
              : 'bg-slate-400',
          ].join(' ')}
        />
      )}
    </div>
  );
};

export default Avatar;
