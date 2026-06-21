const API_BASE_URL = (import.meta.env.VITE_BASE_URL || 'http://localhost:3000')
  .toString()
  .trim()
  .replace(/^['"]|['"]$/g, '');

const handleResponse = async (response) => {
  const data = await response.json();
  if (response.ok) return { success: true, data };
  return { success: false, error: data };
};

// Get all applications (filtered by company for HR users)
export async function getAllApplications(query = {}) {
  try {
    const token = localStorage.getItem('access_token');
    const params = new URLSearchParams();
    if (query.status) params.append('status', query.status);
    if (query.page) params.append('page', query.page);
    if (query.limit) params.append('limit', query.limit);
    
    const response = await fetch(`${API_BASE_URL}/applications?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const result = await handleResponse(response);
    // Backend returns { data: { data: [...], pagination: {...} } }
    if (result.success && result.data) {
      if (result.data.data && Array.isArray(result.data.data)) {
        return { success: true, data: result.data.data };
      }
      if (Array.isArray(result.data)) {
        return { success: true, data: result.data };
      }
    }
    return { success: true, data: [] };
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// Get applications for a specific job
export async function getJobApplications(jobId, query = {}) {
  try {
    const token = localStorage.getItem('access_token');
    const params = new URLSearchParams();
    if (query.status) params.append('status', query.status);
    if (query.page) params.append('page', query.page);
    if (query.limit) params.append('limit', query.limit);
    
    const response = await fetch(`${API_BASE_URL}/applications/job/${jobId}?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// Get application by ID
export async function getApplicationById(id) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// Update application status
export async function updateApplicationStatus(id, status) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/applications/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// Bulk update application status
export async function bulkUpdateStatus(ids, status) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/applications/bulk/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ ids, status }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// Get company stats
export async function getCompanyStats() {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/applications/company/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// Get user stats
export async function getUserStats() {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/applications/user/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}