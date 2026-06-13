import React from 'react';

export const Card = ({ children, className = '', ...rest }) => (
  <div
    className={[
      'bg-white rounded-2xl border border-slate-200/70 shadow-premium',
      'transition-all duration-200',
      className,
    ].join(' ')}
    {...rest}
  >
    {children}
  </div>
);

export const CardHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={['flex items-start justify-between gap-4 p-6 pb-4', className].join(' ')}>
    <div>
      {title && (
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          {title}
        </h3>
      )}
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={['p-6 pt-2', className].join(' ')}>{children}</div>
);

export default Card;
