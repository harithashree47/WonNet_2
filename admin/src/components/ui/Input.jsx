import React from 'react';
import { Icon } from './Icon';

export const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  icon,
  iconRight,
  hint,
  disabled = false,
  className = '',
  ...rest
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
            <Icon name={icon} size={16} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={[
            'w-full rounded-xl border bg-white text-slate-800 placeholder:text-slate-400',
            'transition-all duration-200 outline-none',
            'focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10',
            'disabled:bg-slate-50 disabled:cursor-not-allowed',
            icon ? 'pl-10 pr-4' : 'px-4',
            iconRight ? 'pr-10' : '',
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10'
              : 'border-slate-200 hover:border-slate-300',
            'py-2.5 text-sm',
          ].join(' ')}
          {...rest}
        />
        {iconRight && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {iconRight}
          </div>
        )}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
          <Icon name="alert-triangle" size={12} />
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
};

export const Textarea = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  rows = 4,
  className = '',
  ...rest
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={[
          'w-full rounded-xl border bg-white text-slate-800 placeholder:text-slate-400 px-4 py-2.5 text-sm',
          'transition-all duration-200 outline-none resize-none',
          'focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10',
          error ? 'border-rose-400' : 'border-slate-200 hover:border-slate-300',
        ].join(' ')}
        {...rest}
      />
      {error && <p className="mt-1.5 text-xs text-rose-500">{error}</p>}
    </div>
  );
};

export const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  error,
  className = '',
  icon,
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Icon name={icon} size={16} />
          </div>
        )}
        <select
          value={value}
          onChange={onChange}
          className={[
            'w-full appearance-none rounded-xl border bg-white text-slate-800',
            'transition-all duration-200 outline-none cursor-pointer',
            'focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10',
            'border-slate-200 hover:border-slate-300',
            icon ? 'pl-10 pr-10' : 'px-4 pr-10',
            'py-2.5 text-sm',
            error ? 'border-rose-400' : '',
          ].join(' ')}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Icon name="chevron-down" size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-500">{error}</p>}
    </div>
  );
};

export default Input;
