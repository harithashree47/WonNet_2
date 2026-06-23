const BASE_URL = import.meta.env.VITE_BASE_URL;

const handleResponse = async (response) => {
  const data = await response.json();
  if (response.ok) return { success: true, data };
  return { success: false, error: data };
};

export async function getJobTypes() {
  try {
    const response = await fetch(`${BASE_URL}/jobtype`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

export async function getActiveJobTypes() {
  try {
    const response = await fetch(`${BASE_URL}/jobtype/active`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

export async function getJobTypeById(id) {
  try {
    const response = await fetch(`${BASE_URL}/jobtype/${id}`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}