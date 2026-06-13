// Mock data for the admin panel

export const stats = [
  {
    label: 'Total Revenue',
    value: '$84,329',
    change: 12.5,
    icon: 'fa-solid fa-dollar-sign',
    tone: 'primary',
    spark: [12, 18, 14, 22, 28, 24, 32, 30, 36, 40, 38, 44],
  },
  {
    label: 'Active Users',
    value: '12,847',
    change: 8.2,
    icon: 'fa-solid fa-users',
    tone: 'success',
    spark: [10, 14, 12, 18, 22, 20, 24, 28, 26, 30, 34, 36],
  },
  {
    label: 'Job Listings',
    value: '1,254',
    change: -2.4,
    icon: 'fa-solid fa-briefcase',
    tone: 'warning',
    spark: [22, 24, 26, 25, 24, 26, 28, 27, 26, 25, 24, 26],
  },
  {
    label: 'Applications',
    value: '5,632',
    change: 18.7,
    icon: 'fa-solid fa-file-circle-check',
    tone: 'info',
    spark: [14, 18, 22, 20, 24, 28, 30, 34, 32, 38, 42, 44],
  },
];

export const revenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  values: [18, 24, 22, 30, 28, 36, 34, 42, 40, 48, 52, 58],
};

export const applicationsData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  values: [42, 58, 64, 52, 78, 32, 24],
};

export const userDistribution = [
  { name: 'Job Seekers', value: 8420, color: '#6366f1' },
  { name: 'Employers', value: 3120, color: '#8b5cf6' },
  { name: 'Recruiters', value: 980, color: '#ec4899' },
  { name: 'Admins', value: 327, color: '#10b981' },
];

export const recentUsers = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'Job Seeker', status: 'active', joined: '2 hours ago' },
  { id: 2, name: 'Michael Chen', email: 'm.chen@example.com', role: 'Employer', status: 'active', joined: '5 hours ago' },
  { id: 3, name: 'Emma Williams', email: 'emma.w@example.com', role: 'Recruiter', status: 'pending', joined: '1 day ago' },
  { id: 4, name: 'David Brown', email: 'd.brown@example.com', role: 'Job Seeker', status: 'active', joined: '1 day ago' },
  { id: 5, name: 'Lisa Anderson', email: 'lisa.a@example.com', role: 'Employer', status: 'inactive', joined: '2 days ago' },
  { id: 6, name: 'James Wilson', email: 'j.wilson@example.com', role: 'Job Seeker', status: 'active', joined: '3 days ago' },
];

export const recentJobs = [
  { id: 1, title: 'Senior Frontend Engineer', company: 'TechCorp Inc.', location: 'San Francisco, CA', type: 'Full-time', salary: '$120k-$160k', applicants: 48, status: 'active', posted: '2h ago' },
  { id: 2, title: 'Product Designer', company: 'Design Studio', location: 'Remote', type: 'Full-time', salary: '$90k-$130k', applicants: 32, status: 'active', posted: '5h ago' },
  { id: 3, title: 'DevOps Engineer', company: 'Cloud Systems', location: 'New York, NY', type: 'Full-time', salary: '$130k-$170k', applicants: 21, status: 'pending', posted: '1d ago' },
  { id: 4, title: 'Marketing Manager', company: 'Growth Co.', location: 'Austin, TX', type: 'Full-time', salary: '$80k-$110k', applicants: 64, status: 'active', posted: '1d ago' },
  { id: 5, title: 'Data Scientist', company: 'AI Labs', location: 'Seattle, WA', type: 'Full-time', salary: '$140k-$180k', applicants: 39, status: 'active', posted: '2d ago' },
  { id: 6, title: 'Customer Success Lead', company: 'SaaSify', location: 'Remote', type: 'Full-time', salary: '$95k-$125k', applicants: 18, status: 'closed', posted: '3d ago' },
];

export const recentApplications = [
  { id: 1, candidate: 'Alex Thompson', job: 'Senior Frontend Engineer', company: 'TechCorp', status: 'reviewing', applied: '3h ago', experience: '6 yrs' },
  { id: 2, candidate: 'Maria Garcia', job: 'Product Designer', company: 'Design Studio', status: 'shortlisted', applied: '5h ago', experience: '4 yrs' },
  { id: 3, candidate: 'John Smith', job: 'DevOps Engineer', company: 'Cloud Systems', status: 'interview', applied: '8h ago', experience: '5 yrs' },
  { id: 4, candidate: 'Priya Patel', job: 'Data Scientist', company: 'AI Labs', status: 'reviewing', applied: '1d ago', experience: '3 yrs' },
  { id: 5, candidate: 'Robert Lee', job: 'Marketing Manager', company: 'Growth Co.', status: 'rejected', applied: '2d ago', experience: '7 yrs' },
];

export const activities = [
  { id: 1, user: 'Sarah Johnson', action: 'applied to', target: 'Senior Frontend Engineer', time: '2m ago', icon: 'fa-solid fa-paper-plane', tone: 'indigo' },
  { id: 2, user: 'TechCorp Inc.', action: 'posted a new job', target: 'Senior Frontend Engineer', time: '15m ago', icon: 'fa-solid fa-briefcase', tone: 'violet' },
  { id: 3, user: 'Michael Chen', action: 'subscribed to', target: 'Premium Plan', time: '1h ago', icon: 'fa-solid fa-crown', tone: 'amber' },
  { id: 4, user: 'Emma Williams', action: 'updated profile', target: '', time: '2h ago', icon: 'fa-solid fa-user-pen', tone: 'pink' },
  { id: 5, user: 'David Brown', action: 'saved', target: 'Data Scientist at AI Labs', time: '3h ago', icon: 'fa-solid fa-bookmark', tone: 'sky' },
  { id: 6, user: 'System', action: 'approved 12 new companies', target: '', time: '5h ago', icon: 'fa-solid fa-circle-check', tone: 'emerald' },
];

export const topCompanies = [
  { id: 1, name: 'TechCorp Inc.', jobs: 42, applicants: 384, rating: 4.8, logo: 'T', tone: 'indigo' },
  { id: 2, name: 'Design Studio', jobs: 18, applicants: 156, rating: 4.6, logo: 'D', tone: 'pink' },
  { id: 3, name: 'Cloud Systems', jobs: 27, applicants: 221, rating: 4.7, logo: 'C', tone: 'sky' },
  { id: 4, name: 'AI Labs', jobs: 15, applicants: 198, rating: 4.9, logo: 'A', tone: 'violet' },
  { id: 5, name: 'Growth Co.', jobs: 22, applicants: 142, rating: 4.5, logo: 'G', tone: 'amber' },
];

export const trafficSources = [
  { source: 'Organic Search', visits: 12480, percent: 42, tone: 'primary' },
  { source: 'Direct', visits: 8420, percent: 28, tone: 'success' },
  { source: 'Social Media', visits: 4960, percent: 17, tone: 'warning' },
  { source: 'Referral', visits: 3120, percent: 10, tone: 'info' },
  { source: 'Email', visits: 820, percent: 3, tone: 'danger' },
];

export const companyList = [
  { id: 1, name: 'TechCorp Inc.', industry: 'Technology', jobs: 42, status: 'verified', employees: '1k-5k', location: 'San Francisco, CA' },
  { id: 2, name: 'Design Studio', industry: 'Design', jobs: 18, status: 'verified', employees: '50-200', location: 'Remote' },
  { id: 3, name: 'Cloud Systems', industry: 'Cloud Computing', jobs: 27, status: 'verified', employees: '500-1k', location: 'New York, NY' },
  { id: 4, name: 'AI Labs', industry: 'Artificial Intelligence', jobs: 15, status: 'pending', employees: '50-200', location: 'Seattle, WA' },
  { id: 5, name: 'Growth Co.', industry: 'Marketing', jobs: 22, status: 'verified', employees: '200-500', location: 'Austin, TX' },
  { id: 6, name: 'SaaSify', industry: 'SaaS', jobs: 31, status: 'verified', employees: '200-500', location: 'Boston, MA' },
  { id: 7, name: 'DataFlow', industry: 'Analytics', jobs: 14, status: 'pending', employees: '50-200', location: 'Chicago, IL' },
  { id: 8, name: 'MobileFirst', industry: 'Mobile Development', jobs: 19, status: 'verified', employees: '50-200', location: 'Los Angeles, CA' },
];

export const settingsTabs = [
  { id: 'profile', label: 'Profile', icon: 'fa-solid fa-user' },
  { id: 'account', label: 'Account', icon: 'fa-solid fa-shield-halved' },
  { id: 'notifications', label: 'Notifications', icon: 'fa-solid fa-bell' },
  { id: 'billing', label: 'Billing', icon: 'fa-solid fa-credit-card' },
  { id: 'team', label: 'Team', icon: 'fa-solid fa-users-gear' },
];
