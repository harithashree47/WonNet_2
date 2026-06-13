const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const handleResponse = async (response) => {
  const data = await response.json();
  if (response.ok) return { success: true, data };
  return { success: false, error: data };
};

// Get all work modes
export async function getWorkModes() {
  try {
    const response = await fetch(`${API_BASE_URL}/workmode`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// Get active work modes only
export async function getActiveWorkModes() {
  try {
    const response = await fetch(`${API_BASE_URL}/workmode/active`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// Get single work mode by ID
export async function getWorkModeById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/workmode/${id}`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// Create new work mode
export async function createWorkMode(workModeData) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/workmode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(workModeData),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// Update work mode
export async function updateWorkMode(id, workModeData) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/workmode/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(workModeData),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// Soft delete work mode (set status to inactive)
export async function deleteWorkMode(id) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/workmode/${id}`, {
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

// Permanently delete work mode
export async function permanentDeleteWorkMode(id) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/workmode/${id}/permanent`, {
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