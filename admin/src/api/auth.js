// API Configuration
const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

// Helper function for handling responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (response.ok) {
    return { success: true, data };
  } else {
    return { success: false, error: data };
  }
};

// 1. LOGIN API FUNCTION (For all users - USER, ADMIN, SUPER_ADMIN)
export async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: { message: 'Network error occurred' } 
    };
  }
}

// 2. ADMIN/SUPER ADMIN LOGIN API FUNCTION (Single login page for both)
export async function adminLogin(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const result = await handleResponse(response);
    
    if (result.success) {
      // Store token and user data
      localStorage.setItem('access_token', result.data.access_token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
    }
    
    return result;
  } catch (error) {
    console.error('Admin login error:', error);
    return { 
      success: false, 
      error: { message: 'Network error occurred' } 
    };
  }
}

// 3. CREATE ADMIN API FUNCTION (Only SUPER_ADMIN can access)
export async function createAdmin(adminData) {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`${API_BASE_URL}/auth/create-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(adminData),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Create admin error:', error);
    return { 
      success: false, 
      error: { message: 'Network error occurred' } 
    };
  }
}

// 4. REGISTER USER API FUNCTION
export async function registerUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Registration error:', error);
    return { 
      success: false, 
      error: { message: 'Network error occurred' } 
    };
  }
}

// 5. LOGOUT FUNCTION
export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

// 6. GET CURRENT USER
export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
}

// 7. CHECK IF USER IS AUTHENTICATED
export function isAuthenticated() {
  return localStorage.getItem('access_token') !== null;
}

// 8. CHECK USER ROLE
export function hasRole(role) {
  const user = getCurrentUser();
  return user && user.role === role;
}

// 9. GET AUTH TOKEN
export function getToken() {
  return localStorage.getItem('access_token');
}