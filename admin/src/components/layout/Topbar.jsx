import React, { useState } from 'react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { ToneIcon } from '../ui/ToneIcon';
import { Icon } from '../ui/Icon';
import { useTheme } from '../../context/ThemeContext';

const notifications = [
  { id: 1, text: 'New user registered', time: '2m ago', tone: 'primary', icon: 'user-plus' },
  { id: 2, text: 'Job post approved', time: '15m ago', tone: 'success', icon: 'check-circle' },
  { id: 3, text: 'Server usage at 80%', time: '1h ago', tone: 'warning', icon: 'alert-triangle' },
  { id: 4, text: '12 new applications', time: '2h ago', tone: 'info', icon: 'file-check' },
];

const profileMenu = [
  { icon: 'user', label: 'My Profile' },
  { icon: 'settings', label: 'Account Settings' },
  { icon: 'help-circle', label: 'Help Center' },
];

export const Topbar = ({ user, onMenuClick, onLogout, pageTitle, pageSubtitle }) => {
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/80">
      <div className="h-16 px-4 lg:px-6 flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100"
        >
          <Icon name="menu" size={18} />
        </button>

        <div className="flex-1 min-w-0">
          <div className="md:hidden">
            <h1 className="text-sm font-bold text-slate-900 tracking-tight truncate">{pageTitle || 'Dashboard'}</h1>
          </div>
          <div className="hidden md:block">
            <h1 className="text-base font-bold text-slate-900 tracking-tight">{pageTitle || 'Dashboard'}</h1>
            {pageSubtitle && <p className="text-xs text-slate-500">{pageSubtitle}</p>}
          </div>
        </div>

        <div className="flex-1 max-w-md mx-auto">
          <div className="relative">
            <Icon name="search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search anything..."
              className="w-full pl-10 pr-14 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition"
            />
           
          </div>
        </div>

        <div className="flex items-center gap-2">
         


        

          <div className="relative">
            <button
              onClick={() => { setShowProfile((v) => !v); setShowNotif(false); }}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-slate-100 transition"
            >
              <Avatar name={user?.name || 'Admin'} size="sm" status="online" />
              <div className="hidden md:block text-left">
                <div className="text-sm font-semibold text-slate-800 leading-tight">{user?.name}</div>
                <div className="text-[10px] text-slate-500 capitalize">{user?.role?.replace('_', ' ')}</div>
              </div>
              <Icon name="chevron-down" size={12} className="text-slate-400 hidden md:block" />
            </button>
            {showProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-premium-lg overflow-hidden animate-fade-in-up z-50">
                <div className="p-4 border-b border-slate-100 bg-gradient-to-br from-indigo-50 to-violet-50">
                  <div className="flex items-center gap-3">
                    <Avatar name={user?.name || 'Admin'} size="md" />
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">{user?.name}</div>
                      <div className="text-xs text-slate-500 truncate">{user?.email}</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-2 border-t border-slate-100">
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
                  >
                    <span className="w-4 h-4 inline-flex items-center justify-center">
                      <Icon name="log-out" size={14} />
                    </span>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
