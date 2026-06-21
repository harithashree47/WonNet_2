import React, { useState, useEffect } from 'react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Icon } from '../ui/Icon';
import { getUsers } from '../../api/auth';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'gauge' },
  { id: 'users', label: 'Users', icon: 'users' },
  { id: 'staff', label: 'Staff Management', icon: 'shield' },
  { id: 'hrs', label: 'HR Management', icon: 'user-plus' },
  { id: 'jobs', label: 'Jobs', icon: 'briefcase' },
  { id: 'companies', label: 'Companies', icon: 'building' },
  { id: 'applications', label: 'Applications', icon: 'file-check' },
  { id: 'analytics', label: 'Analytics', icon: 'bar-chart' },
  { id: 'messages', label: 'Messages', icon: 'mail' },
];

const hrNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'gauge' },
  { id: 'applications', label: 'Applications', icon: 'file-check' },
  { id: 'messages', label: 'Messages', icon: 'mail' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

const masterDataItems = [
  { id: 'categories', label: 'Categories', icon: 'grid' },
  { id: 'experience-levels', label: 'Experience Levels', icon: 'layers' },
  { id: 'employment-types', label: 'Employment Types', icon: 'clipboard' },
  { id: 'work-modes', label: 'Work Modes', icon: 'globe' }, 
  { id: 'locations', label: 'Locations', icon: 'map-pin' },
  { id: 'education-levels', label: 'Education Levels', icon: 'award' },
  { id: 'departments', label: 'Departments', icon: 'building' },
  { id: 'skills', label: 'Skills', icon: 'code' },          
  { id: 'benefits', label: 'Benefits', icon: 'gift' },
];

const secondary = [
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

export const Sidebar = ({ active, onNavigate, user, collapsed, onToggle, mobileOpen, onMobileToggle }) => {
  const role = user?.role?.toUpperCase() || '';
  const isSuper = role === 'SUPER_ADMIN';
  const isAdmin = isSuper || role === 'ADMIN';
  const isHr = role === 'HR';
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      const res = await getUsers();
      if (res.success) {
        const regularUsers = res.data.filter(u => u.role?.toUpperCase() === 'USER');
        setUsers(regularUsers);
      }
      setLoadingUsers(false);
    };
    fetchUsers();
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30 transition-opacity"
          onClick={onMobileToggle}
        />
      )}

      <aside
        className={[
          'fixed lg:sticky top-0 h-screen left-0 z-40',
          'flex flex-col bg-white border-r border-slate-200/80',
          'transition-all duration-300 ease-in-out shadow-sm',
          collapsed ? 'w-20' : 'w-72',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
      <div className="h-16 flex items-center justify-between px-4 lg:px-5 border-b border-slate-100">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
            <Icon name="zap" size={20} strokeWidth={2.5} className="text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-white animate-pulse-glow"></span>
          </div>
          {!collapsed && (
            <div className="animate-fade-in min-w-0">
              <div className="text-base font-extrabold tracking-tight text-slate-900 truncate">
                Won<span className="text-gradient">Net</span>
              </div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest truncate">
                {isHr ? 'HR Panel' : 'Admin Panel'}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {/* Mobile close button */}
          <button
            onClick={onMobileToggle}
            className="lg:hidden w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition flex items-center justify-center"
          >
            <Icon name="x" size={18} />
          </button>
          {/* Desktop collapse button */}
          <button
            onClick={onToggle}
            className="hidden lg:flex w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition items-center justify-center"
          >
            <Icon name={collapsed ? 'chevrons-right' : 'chevrons-left'} size={14} />
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {!collapsed && (
          <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Main
          </p>
        )}
        
        {isHr ? (
          hrNavItems.map((item) => {
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
          })
        ) : (
          navItems.map((item) => {
            if ((item.id === 'staff' || item.id === 'hrs') && !isSuper) {
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
          })
        )}

        {!collapsed && isAdmin && !isHr && (
          <p className="px-3 mt-6 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Master Data
          </p>
        )}
        {collapsed && isAdmin && !isHr && <div className="my-3 mx-2 border-t border-slate-100"></div>}
        {isAdmin && !isHr && masterDataItems.map((item) => {
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

        {!collapsed && !isHr && (
          <p className="px-3 mt-6 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            System
          </p>
        )}
        {collapsed && !isHr && <div className="my-3 mx-2 border-t border-slate-100"></div>}
        {!isHr && secondary.map((item) => {
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
    </>
  );
};

export default Sidebar;