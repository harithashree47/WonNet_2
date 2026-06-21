
const API_BASE_URL = (import.meta.env.VITE_BASE_URL || 'http://localhost:3000')
  .toString()
  .trim()
  .replace(/^['"]|['"]$/g, '');

const handleResponse = async (response) => {
  const data = await response.json();
  if (response.ok) return { success: true, data };
  return { success: false, error: data };
};

// Get all applications for current user
export async function getUserApplications(params = {}) {
  try {
    const { status, page = 1, limit = 10 } = params;
    const queryParams = new URLSearchParams();
    if (status) queryParams.append('status', status);
    queryParams.append('page', page);
    queryParams.append('limit', limit);

    const token = localStorage.getItem('access_token');
    const response = await fetch(
      `${API_BASE_URL}/applications/user/my-applications?${queryParams.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// Apply for a job with all fields
export async function applyForJob(data) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        jobId: data.jobId,
        resumeUrl: data.resumeUrl,
        linkedin: data.linkedin,
        portfolio: data.portfolio,
        motivation: data.motivation,
        expectedSalary: data.expectedSalary,
        noticePeriod: data.noticePeriod,
      }),
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

// Update application
export async function updateApplication(id, data) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// Withdraw application
export async function withdrawApplication(id) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/applications/${id}/withdraw`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// Get user application statistics
export async function getUserApplicationStats() {
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

// Check if user has applied to a job
export async function checkApplication(jobId) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/applications/check/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}