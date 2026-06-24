const BASE_URL = import.meta.env.VITE_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (response.ok) return { success: true, data };
  return { success: false, error: data };
};

export async function addToWishlist(jobId) {
  try {
    const response = await fetch(`${BASE_URL}/wishlist/jobs/${jobId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

export async function removeFromWishlist(jobId) {
  try {
    const response = await fetch(`${BASE_URL}/wishlist/jobs/${jobId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

export async function isWishlisted(jobId) {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return { success: true, data: { isWishlisted: false } };
    }
    const response = await fetch(`${BASE_URL}/wishlist/jobs/${jobId}/status`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

export async function getMyWishlist(page = 1, limit = 10) {
  try {
    const response = await fetch(`${BASE_URL}/wishlist?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}