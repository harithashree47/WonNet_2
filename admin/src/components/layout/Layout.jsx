import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const Layout = ({ user, onLogout, active, onNavigate, pageTitle, pageSubtitle, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={[
          'lg:relative fixed inset-y-0 left-0 z-40 transform transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
        ].join(' ')}
      >
        <Sidebar
          active={active}
          onNavigate={(id) => {
            onNavigate?.(id);
            setMobileOpen(false);
          }}
          user={user}
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          user={user}
          onLogout={onLogout}
          onMenuClick={() => setMobileOpen((v) => !v)}
          pageTitle={pageTitle}
          pageSubtitle={pageSubtitle}
        />
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
