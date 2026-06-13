import React from 'react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Icon } from '../ui/Icon';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'gauge' },
   { id: 'analytics', label: 'Analytics', icon: 'bar-chart' },
  { id: 'users', label: 'Users', icon: 'users', badge: '12.8k' },
  { id: 'staff', label: 'Staff Management', icon: 'user-check' },
  { id: 'jobs', label: 'Jobs', icon: 'briefcase', badge: '1.2k' },
  { id: 'companies', label: 'Companies', icon: 'building', badge: '320' },
  { id: 'applications', label: 'Applications', icon: 'file-check' },
 
  { id: 'messages', label: 'Messages', icon: 'mail', badge: '5' },
];

const masterDataItems = [
  { id: 'categories', label: 'Categories', icon: 'grid' },
  { id: 'experience-levels', label: 'Experience Levels', icon: 'layers' },
  { id: 'employment-types', label: 'Employment Types', icon: 'clipboard' },
  { id: 'education-levels', label: 'Education Levels', icon: 'award' },
  { id: 'departments', label: 'Departments', icon: 'building' },
];

const secondary = [
  { id: 'settings', label: 'Settings', icon: 'settings' },

];

export const Sidebar = ({ active, onNavigate, user, collapsed, onToggle }) => {
  const role = user?.role?.toUpperCase() || '';
  const isAdmin = role.includes('ADMIN');

  return (
    <aside
      className={[
        'fixed lg:static inset-y-0 left-0 z-40',
        'flex flex-col bg-white border-r border-slate-200/80',
        'transition-all duration-300 ease-out',
        collapsed ? 'w-20' : 'w-72',
        'lg:translate-x-0',
      ].join(' ')}
    >
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Icon name="zap" size={20} strokeWidth={2.5} className="text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-white animate-pulse-glow"></span>
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <div className="text-base font-extrabold tracking-tight text-slate-900">
                Won<span className="text-gradient">Net</span>
              </div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                Admin Panel
              </div>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className="w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition hidden lg:flex items-center justify-center"
        >
          <Icon name={collapsed ? 'chevrons-right' : 'chevrons-left'} size={14} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {!collapsed && (
          <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Main
          </p>
        )}
        {navItems.map((item) => {
          // Only show Staff Management to Admins and Super Admins
          if (item.id === 'staff' && !isAdmin) {
            return null;
          }

          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className={[
                'group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                isActive
                  ? 'bg-slate-800 text-white shadow-lg shadow-slate-500/30'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                collapsed ? 'justify-center' : '',
              ].join(' ')}
              title={collapsed ? item.label : ''}
            >
              <span className={['w-5 h-5 inline-flex items-center justify-center', isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'].join(' ')}>
                <Icon name={item.icon} size={16} strokeWidth={2.25} />
              </span>
              {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
             
              
            </button>
          );
        })}

        {!collapsed && isAdmin && (
          <p className="px-3 mt-6 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Master Data
          </p>
        )}
        {collapsed && isAdmin && <div className="my-3 mx-2 border-t border-slate-100"></div>}
        {isAdmin && masterDataItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className={[
                'group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                isActive
                  ? 'bg-slate-800 text-white shadow-lg shadow-slate-500/30'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                collapsed ? 'justify-center' : '',
              ].join(' ')}
              title={collapsed ? item.label : ''}
            >
              <span className={['w-5 h-5 inline-flex items-center justify-center', isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'].join(' ')}>
                <Icon name={item.icon} size={16} strokeWidth={2.25} />
              </span>
              {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
            </button>
          );
        })}

        {!collapsed && (
          <p className="px-3 mt-6 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            System
          </p>
        )}
        {collapsed && <div className="my-3 mx-2 border-t border-slate-100"></div>}
        {secondary.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className={[
                'group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                isActive
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                collapsed ? 'justify-center' : '',
              ].join(' ')}
            >
              <span className="w-5 h-5 inline-flex items-center justify-center text-slate-400 group-hover:text-indigo-600">
                <Icon name={item.icon} size={16} strokeWidth={2.25} />
              </span>
              {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
            </button>
          );
        })}
      </nav>

  
    </aside>
  );
};

export default Sidebar;
