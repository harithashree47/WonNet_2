import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import { isAuthenticated, getCurrentUser, logout } from './api/auth';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';
import { JobsPage } from './pages/JobsPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { StaffManagementPage } from './pages/StaffManagementPage';
import { SettingsPage } from './pages/SettingsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ExperienceLevelsPage } from './pages/ExperienceLevelsPage';
import { EmploymentTypesPage } from './pages/EmploymentTypesPage';
import { EducationLevelsPage } from './pages/EducationLevelsPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { WorkModePage } from './pages/WorkModePage'; // ← IMPORT WORK MODE PAGE
import { Card, CardHeader, CardBody } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Badge } from './components/ui/Badge';
import { ToneIcon } from './components/ui/ToneIcon';
import LocationsPage from './pages/LocationsPage';

const PAGE_META = {
  dashboard: { title: 'Dashboard', subtitle: "Here's what's happening today" },
  users: { title: 'Users', subtitle: 'Manage all registered users' },
  jobs: { title: 'Jobs', subtitle: 'Manage all job postings' },
  staff: { title: 'Staff Management', subtitle: 'Manage administrative access and team roles' },
  companies: { title: 'Companies', subtitle: 'Manage all registered companies' },
  applications: { title: 'Applications', subtitle: 'Review and manage applications' },
  analytics: { title: 'Analytics', subtitle: 'Deep insights into your platform' },
  categories: { title: 'Categories', subtitle: 'Manage job categories (Master Data)' },
  'experience-levels': { title: 'Experience Levels', subtitle: 'Manage experience level options (Master Data)' },
  'employment-types': { title: 'Employment Types', subtitle: 'Manage employment type options (Master Data)' },
  'work-modes': { title: 'Work Modes', subtitle: 'Manage work arrangement options (Remote, On-site, Hybrid)' }, 
  'locations': { 
  title: 'Locations', 
  subtitle: 'Manage job locations (State & City)' 
},
  'education-levels': { title: 'Education Levels', subtitle: 'Manage education requirement options (Master Data)' },
  departments: { title: 'Departments', subtitle: 'Manage departments (Master Data)' },
  messages: { title: 'Messages', subtitle: 'Your inbox and conversations' },
  settings: { title: 'Settings', subtitle: 'Manage your account & preferences' },
};

const PlaceholderPage = ({ id }) => (
  <div className="space-y-6">
    <Card>
      <CardBody className="text-center py-16">
        <div className="w-20 h-20 rounded-2xl gradient-brand mx-auto flex items-center justify-center shadow-premium-lg">
          <i className="fa-solid fa-rocket text-white text-3xl"></i>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mt-5 capitalize">{id}</h2>
        <p className="text-slate-500 mt-2 max-w-md mx-auto">
          This module is ready for your data. Connect it to your backend to bring it to life.
        </p>
        <div className="flex items-center justify-center gap-2 mt-5">
          <Badge tone="primary" icon="fa-solid fa-sparkles">Coming Soon</Badge>
          <Badge tone="success" icon="fa-solid fa-check">UI Complete</Badge>
        </div>
        <Button className="mt-6" icon="fa-solid fa-arrow-left" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </CardBody>
    </Card>
  </div>
);

const Shell = ({ user, onLogout }) => {
  const [active, setActive] = useState('dashboard');
  const meta = PAGE_META[active] || { title: 'Dashboard', subtitle: '' };

  const renderPage = () => {
    switch (active) {
      case 'dashboard':
        return <DashboardPage onNavigate={setActive} />;
      case 'users':
        return <UsersPage />;
      case 'jobs':
        return <JobsPage />;
      case 'staff':
        return <StaffManagementPage />;
      case 'companies':
        return <CompaniesPage />;
      case 'applications':
        return <ApplicationsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'experience-levels':
        return <ExperienceLevelsPage />;
      case 'employment-types':
        return <EmploymentTypesPage />;
      case 'work-modes': 
        return <WorkModePage />;
      case 'locations':
        return <LocationsPage />;
      case 'education-levels':
        return <EducationLevelsPage />;
      case 'departments':
        return <DepartmentsPage />;
      case 'settings':
        return <SettingsPage user={user} />;
      case 'messages':
        return <PlaceholderPage id={active} />;
      default:
        return <DashboardPage onNavigate={setActive} />;
    }
  };

  return (
    <Layout
      user={user}
      onLogout={onLogout}
      active={active}
      onNavigate={setActive}
      pageTitle={meta.title}
      pageSubtitle={meta.subtitle}
    >
      {renderPage()}
    </Layout>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      if (isAuthenticated()) {
        setIsLoggedIn(true);
        setUser(getCurrentUser());
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <ThemeProvider>
      {isLoggedIn && user ? (
        <Shell user={user} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </ThemeProvider>
  );
}

export default App;