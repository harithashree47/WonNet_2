import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const Layout = ({ user, onLogout, active, onNavigate, pageTitle, pageSubtitle, children, sidebarCollapsed, onSidebarToggle, mobileSidebarOpen, onMobileSidebarToggle }) => {
  const [collapsed, setCollapsed] = useState(sidebarCollapsed || false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="lg:relative fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 lg:translate-x-0">
        <Sidebar
          active={active}
          onNavigate={(id) => {
            onNavigate?.(id);
          }}
          user={user}
          collapsed={collapsed}
          onToggle={() => {
            setCollapsed((v) => !v);
            onSidebarToggle?.();
          }}
          mobileOpen={mobileSidebarOpen}
          onMobileToggle={onMobileSidebarToggle}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          user={user}
          onLogout={onLogout}
          onMenuClick={onMobileSidebarToggle}
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
