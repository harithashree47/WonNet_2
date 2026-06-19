const BASE_URL = import.meta.env.VITE_BASE_URL;

const handleResponse = async (response) => {
  const data = await response.json();
  if (response.ok) return { success: true, data };
  return { success: false, error: data };
};

export async function getCategories() {
  try {
    const response = await fetch(`${BASE_URL}/categories`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

export async function getActiveCategories() {
  try {
    const response = await fetch(`${BASE_URL}/categories/active`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

export async function getCategoryById(id) {
  try {
    const response = await fetch(`${BASE_URL}/categories/${id}`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}