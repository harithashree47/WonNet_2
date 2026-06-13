const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const handleResponse = async (response) => {
  const data = await response.json();
  if (response.ok) return { success: true, data };
  return { success: false, error: data };
};

// Get all experience levels
export async function getExperienceLevels() {
  try {
    const response = await fetch(`${API_BASE_URL}/experience-level`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// Get active experience levels only
export async function getActiveExperienceLevels() {
  try {
    const response = await fetch(`${API_BASE_URL}/experience-level/active`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// Get single experience level by ID
export async function getExperienceLevelById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/experience-level/${id}`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// Create new experience level
export async function createExperienceLevel(data) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/experience-level`, {
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

// Update experience level
export async function updateExperienceLevel(id, data) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/experience-level/${id}`, {
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

// Soft delete experience level (set status to inactive)
export async function deleteExperienceLevel(id) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/experience-level/${id}`, {
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