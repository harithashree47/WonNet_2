const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const handleResponse = async (response) => {
  const data = await response.json();
  if (response.ok) return { success: true, data };
  return { success: false, error: data };
};

// Get all jobs
export async function getJobs() {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// Get published jobs only
export async function getPublishedJobs() {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/published`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// Get single job by ID
export async function getJobById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// Search jobs
export async function searchJobs(query) {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/search?q=${encodeURIComponent(query)}`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// Get jobs by company
export async function getJobsByCompany(companyId) {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/company/${companyId}`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// Get jobs by category
export async function getJobsByCategory(categoryId) {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/category/${categoryId}`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// Get jobs by location
export async function getJobsByLocation(locationId) {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/location/${locationId}`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// Create new job
export async function createJob(data) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
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

// Update job
export async function updateJob(id, data) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
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

// Update job status
export async function updateJobStatus(id, status) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/jobs/${id}/status`, {
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

// Delete job
export async function deleteJob(id) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}