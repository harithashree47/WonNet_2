import React from 'react';

export const Table = ({ children, className = '' }) => (
  <div className={['overflow-x-auto no-scrollbar', className].join(' ')}>
    <table className="w-full text-sm">{children}</table>
  </div>
);

export const THead = ({ children }) => (
  <thead className="bg-slate-50/70 border-b border-slate-200">
    {children}
  </thead>
);

export const TBody = ({ children }) => (
  <tbody className="divide-y divide-slate-100">{children}</tbody>
);

export const TR = ({ children, className = '', onClick }) => (
  <tr
    onClick={onClick}
    className={[
      'transition-colors',
      onClick ? 'cursor-pointer hover:bg-slate-50' : '',
      className,
    ].join(' ')}
  >
    {children}
  </tr>
);

export const TH = ({ children, className = '', align = 'left' }) => (
  <th
    className={[
      'px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500',
      align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left',
      className,
    ].join(' ')}
  >
    {children}
  </th>
);

export const TD = ({ children, className = '', align = 'left' }) => (
  <td
    className={[
      'px-4 py-3 text-slate-700',
      align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left',
      className,
    ].join(' ')}
  >
    {children}
  </td>
);

export default Table;
