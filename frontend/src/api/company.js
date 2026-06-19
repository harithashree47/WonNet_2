const BASE_URL = import.meta.env.VITE_BASE_URL;

const handleResponse = async (response) => {
  const data = await response.json();
  if (response.ok) return { success: true, data };
  return { success: false, error: data };
};

export async function getCompanies() {
  try {
    const response = await fetch(`${BASE_URL}/companies`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

export async function getCompanyById(id) {
  try {
    const response = await fetch(`${BASE_URL}/companies/${id}`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}