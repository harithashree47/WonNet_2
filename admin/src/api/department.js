const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const handleResponse = async (response) => {
  const data = await response.json();
  if (response.ok) return { success: true, data };
  return { success: false, error: data };
};

// Get all departments
export async function getDepartments() {
  try {
    const response = await fetch(`${API_BASE_URL}/department`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// Get active departments only
export async function getActiveDepartments() {
  try {
    const response = await fetch(`${API_BASE_URL}/department/active`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// Get single department by ID
export async function getDepartmentById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/department/${id}`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// Create new department
export async function createDepartment(data) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/department`, {
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

// Update department
export async function updateDepartment(id, data) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/department/${id}`, {
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

// Soft delete department
export async function deleteDepartment(id) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/department/${id}`, {
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