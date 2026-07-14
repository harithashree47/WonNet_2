const API_BASE_URL = (import.meta.env.VITE_BASE_URL || 'http://localhost:3000')
  .toString()
  .trim()
  .replace(/^['"]|['"]$/g, '');

const handleResponse = async (response) => {
  const data = await response.json();
  if (response.ok) return { success: true, data };
  return { success: false, error: data };
};

const authHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Authorization': `Bearer ${token}`,
  };
};

// Get dashboard stats
export async function getDashboardStats() {
  try {
    const token = localStorage.getItem('access_token');
    const headers = { 'Authorization': `Bearer ${token}` };

    const [usersRes, jobsRes, companiesRes, applicationsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/users`, { headers }),
      fetch(`${API_BASE_URL}/jobs`),
      fetch(`${API_BASE_URL}/companies`),
      fetch(`${API_BASE_URL}/applications`, { headers }),
    ]);

    const users = await handleResponse(usersRes);
    const jobs = await handleResponse(jobsRes);
    const companies = await handleResponse(companiesRes);
    const applications = await handleResponse(applicationsRes);

    const stats = [];

    if (users.success && Array.isArray(users.data)) {
      stats.push({
        label: 'Total Users',
        value: users.data.length.toLocaleString(),
        change: 0,
        icon: 'users',
        tone: 'primary',
      });
    }

    if (jobs.success && Array.isArray(jobs.data)) {
      stats.push({
        label: 'Total Jobs',
        value: jobs.data.length.toLocaleString(),
        change: 0,
        icon: 'briefcase',
        tone: 'success',
      });
    }

    if (applications.success && applications.data) {
      const apps = applications.data.data || applications.data;
      const count = Array.isArray(apps) ? apps.length : 0;
      stats.push({
        label: 'Applications',
        value: count.toLocaleString(),
        change: 0,
        icon: 'file-text',
        tone: 'warning',
      });
    }

    if (companies.success && Array.isArray(companies.data)) {
      stats.push({
        label: 'Companies',
        value: companies.data.length.toLocaleString(),
        change: 0,
        icon: 'building',
        tone: 'info',
      });
    }

    return { success: true, stats };
  } catch (error) {
    return { success: false, error: { message: 'Failed to fetch dashboard stats' } };
  }
}

// Get recent applications for dashboard
export async function getRecentApplications(limit = 5) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/applications?limit=${limit}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const result = await handleResponse(response);
    if (result.success && result.data) {
      const apps = result.data.data || result.data;
      const mapped = Array.isArray(apps)
        ? apps.map((a) => ({
            id: a.id,
            candidate: a.user?.name || 'Unknown',
            experience: a.user?.designation || 'N/A',
            job: a.job?.title || 'Unknown',
            company: a.job?.company?.name || 'Unknown',
            status: a.status || 'pending',
            applied: a.createdAt
              ? timeAgo(new Date(a.createdAt))
              : 'N/A',
          }))
        : [];
      return { success: true, data: mapped };
    }
    return { success: true, data: [] };
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}