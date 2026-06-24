export const stats = [
  {
    label: 'Total Users',
    value: '24,891',
    change: 12.5,
    icon: 'users',
    tone: 'primary',
    spark: [45, 52, 38, 55, 48, 60, 58, 62, 70, 65, 72, 78, 75, 82, 80, 85, 88, 92, 90, 95, 98, 102, 105, 108],
  },
  {
    label: 'Total Jobs',
    value: '1,423',
    change: 8.2,
    icon: 'briefcase',
    tone: 'success',
    spark: [20, 25, 18, 30, 28, 35, 32, 38, 42, 40, 45, 48, 50, 52, 48, 55, 58, 60, 62, 58, 65, 68, 70, 72],
  },
  {
    label: 'Applications',
    value: '12,847',
    change: 3.8,
    icon: 'file-text',
    tone: 'warning',
    spark: [80, 75, 90, 85, 95, 88, 100, 92, 105, 98, 110, 102, 115, 108, 120, 112, 118, 125, 130, 122, 128, 135, 140, 138],
  },
  {
    label: 'Companies',
    value: '486',
    change: -2.1,
    icon: 'building',
    tone: 'info',
    spark: [30, 28, 32, 30, 28, 35, 32, 30, 28, 26, 30, 28, 32, 30, 28, 26, 30, 28, 26, 24, 28, 26, 24, 22],
  },
];

export const revenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  values: [45000, 52000, 48000, 58000, 62000, 55000, 63000, 68000, 72000, 65000, 78000, 85000],
};

export const applicationsData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  values: [120, 180, 240, 200, 280, 160, 90],
};

export const userDistribution = [
  { name: 'Job Seekers', value: 18200, color: '#6366f1' },
  { name: 'Employers', value: 4200, color: '#10b981' },
  { name: 'Admins', value: 891, color: '#f59e0b' },
  { name: 'HR Managers', value: 1600, color: '#8b5cf6' },
];

export const recentUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Job Seeker', status: 'active', joined: '2 hours ago' },
  { id: 2, name: 'Jane Smith', email: 'jane@company.com', role: 'Employer', status: 'active', joined: '5 hours ago' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Job Seeker', status: 'pending', joined: '1 day ago' },
  { id: 4, name: 'Alice Brown', email: 'alice@hr.com', role: 'HR Manager', status: 'active', joined: '2 days ago' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Job Seeker', status: 'inactive', joined: '3 days ago' },
];

export const recentJobs = [
  { id: 1, title: 'Senior Frontend Developer', company: 'TechCorp', location: 'San Francisco, CA', salary: '$120k - $150k', applicants: 24, status: 'active', posted: '2 days ago' },
  { id: 2, title: 'Backend Engineer', company: 'DataFlow Inc', location: 'Remote', salary: '$110k - $140k', applicants: 18, status: 'active', posted: '3 days ago' },
  { id: 3, title: 'UX Designer', company: 'DesignStudio', location: 'New York, NY', salary: '$90k - $120k', applicants: 12, status: 'reviewing', posted: '5 days ago' },
  { id: 4, title: 'DevOps Engineer', company: 'CloudBase', location: 'Austin, TX', salary: '$130k - $160k', applicants: 8, status: 'active', posted: '1 week ago' },
  { id: 5, title: 'Product Manager', company: 'InnovateTech', location: 'Seattle, WA', salary: '$140k - $180k', applicants: 15, status: 'closed', posted: '2 weeks ago' },
];

export const recentApplications = [
  { id: 1, candidate: 'Emily Clark', experience: '4 years', job: 'Senior Frontend Developer', company: 'TechCorp', status: 'shortlisted', applied: '1 hour ago' },
  { id: 2, candidate: 'David Lee', experience: '6 years', job: 'Backend Engineer', company: 'DataFlow Inc', status: 'reviewing', applied: '3 hours ago' },
  { id: 3, candidate: 'Sophia Martinez', experience: '3 years', job: 'UX Designer', company: 'DesignStudio', status: 'interview', applied: '6 hours ago' },
  { id: 4, candidate: 'James Wilson', experience: '7 years', job: 'DevOps Engineer', company: 'CloudBase', status: 'pending', applied: '1 day ago' },
  { id: 5, candidate: 'Olivia Taylor', experience: '5 years', job: 'Product Manager', company: 'InnovateTech', status: 'rejected', applied: '2 days ago' },
];

export const activities = [
  { id: 1, icon: 'user-plus', tone: 'success', user: 'John Doe', action: 'registered as a', target: 'Job Seeker', time: '2 hours ago' },
  { id: 2, icon: 'briefcase', tone: 'primary', user: 'TechCorp', action: 'posted a new job:', target: 'Senior Frontend Developer', time: '3 hours ago' },
  { id: 3, icon: 'file-text', tone: 'warning', user: 'Emily Clark', action: 'applied for', target: 'Senior Frontend Developer', time: '4 hours ago' },
  { id: 4, icon: 'check-circle', tone: 'success', user: 'DataFlow Inc', action: 'was approved as a', target: 'company', time: '6 hours ago' },
  { id: 5, icon: 'x-circle', tone: 'danger', user: 'Charlie Wilson', action: 'was flagged for review', target: '', time: '8 hours ago' },
  { id: 6, icon: 'star', tone: 'purple', user: 'DesignStudio', action: 'achieved a rating of 4.8', target: '', time: '1 day ago' },
  { id: 7, icon: 'edit', tone: 'info', user: 'Admin', action: 'updated system settings', target: '', time: '1 day ago' },
];

export const topCompanies = [
  { id: 1, name: 'TechCorp', tone: 'primary', jobs: 24, applicants: 340, rating: 4.8 },
  { id: 2, name: 'DataFlow Inc', tone: 'success', jobs: 18, applicants: 280, rating: 4.6 },
  { id: 3, name: 'DesignStudio', tone: 'warning', jobs: 12, applicants: 190, rating: 4.9 },
  { id: 4, name: 'CloudBase', tone: 'info', jobs: 20, applicants: 310, rating: 4.7 },
  { id: 5, name: 'InnovateTech', tone: 'purple', jobs: 15, applicants: 220, rating: 4.5 },
];

export const trafficSources = [
  { source: 'Direct', visits: 12480, percent: 35, tone: 'primary' },
  { source: 'Google', visits: 9280, percent: 26, tone: 'success' },
  { source: 'LinkedIn', visits: 6420, percent: 18, tone: 'info' },
  { source: 'Twitter', visits: 4280, percent: 12, tone: 'warning' },
  { source: 'Indeed', visits: 3210, percent: 9, tone: 'purple' },
];

export const settingsTabs = [
  { id: 'profile', label: 'Profile' },
  { id: 'account', label: 'Account' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'billing', label: 'Billing' },
  { id: 'team', label: 'Team' },
];