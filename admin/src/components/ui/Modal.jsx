import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';

export const Modal = ({ open, onClose, title, subtitle, children, footer, size = 'md' }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div
        className={[
          'relative w-full bg-white rounded-2xl shadow-premium-lg',
          'max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up',
          widths[size] || widths.md,
        ].join(' ')}
      >
        <div className="flex items-start justify-between p-6 border-b border-slate-100">
          <div>
            {title && <h3 className="text-lg font-bold text-slate-900">{title}</h3>}
            {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
        {footer && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
