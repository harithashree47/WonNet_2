const BASE_URL = import.meta.env.VITE_BASE_URL;

const handleResponse = async (response) => {
  const data = await response.json();
  if (response.ok) return { success: true, data };
  return { success: false, error: data };
};

export async function getExperienceLevels() {
  try {
    const response = await fetch(`${BASE_URL}/experience-levels`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

export async function getActiveExperienceLevels() {
  try {
    const response = await fetch(`${BASE_URL}/experience-levels/active`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

export async function getExperienceLevelById(id) {
  try {
    const response = await fetch(`${BASE_URL}/experience-levels/${id}`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}