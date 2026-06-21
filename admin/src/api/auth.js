// src/api/auth.js
const API_BASE_URL = (import.meta.env.VITE_BASE_URL || 'http://localhost:3000')
  .toString()
  .trim()
  .replace(/^['"]|['"]$/g, '');

// Helper function for handling responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (response.ok) {
    return { success: true, data };
  } else {
    return { success: false, error: data };
  }
};

// 1. LOGIN API FUNCTION (For all users)
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

// 2. ADMIN/SUPER ADMIN LOGIN API FUNCTION
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
      localStorage.setItem('wonnet_admin', JSON.stringify(result.data.user));
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
    
    const data = await response.json();
    
    if (response.ok) {
      return { 
        success: true, 
        message: data.message,
        data: data 
      };
    } else {
      return { 
        success: false, 
        message: data.message || 'Failed to create admin',
        error: data 
      };
    }
  } catch (error) {
    console.error('Create admin error:', error);
    return { 
      success: false, 
      message: 'Network error occurred' 
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
  localStorage.removeItem('wonnet_admin');
  window.location.href = '/login';
}

// 6. GET CURRENT USER
export function getCurrentUser() {
  const userStr = localStorage.getItem('wonnet_admin');
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

// 10. GET ALL ADMINS
export async function getAdmins() {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`${API_BASE_URL}/auth/admins`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Get admins error:', error);
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// 11. UPDATE ADMIN API FUNCTION (PATCH)
export async function updateAdmin(id, adminData) {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`${API_BASE_URL}/auth/admin/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(adminData),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Update admin error:', error);
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// 12. DELETE (RESTRICT/SOFT DELETE) ADMIN API FUNCTION
export async function deleteAdmin(id) {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`${API_BASE_URL}/auth/admin/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Delete admin error:', error);
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// 13. GET ALL USERS (role === 'USER')
export async function getUsers() {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`${API_BASE_URL}/auth/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Get users error:', error);
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

// 14. UPDATE USER STATUS
export async function updateUserStatus(id, status) {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`${API_BASE_URL}/auth/user/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Update user status error:', error);
    return { success: false, error: { message: 'Network error occurred' } };
  }
}
