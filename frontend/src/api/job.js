const BASE_URL = import.meta.env.VITE_BASE_URL;

const handleResponse = async (response) => {
  const data = await response.json();
  if (response.ok) return { success: true, data };
  return { success: false, error: data };
};

export async function getJobs() {
  try {
    const response = await fetch(`${BASE_URL}/jobs`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

export async function getPublishedJobs() {
  try {
    const response = await fetch(`${BASE_URL}/jobs/published`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

export async function getJobById(id) {
  try {
    const response = await fetch(`${BASE_URL}/jobs/${id}`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

export async function searchJobs(query) {
  try {
    const response = await fetch(`${BASE_URL}/jobs/search?q=${encodeURIComponent(query)}`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

export async function getJobsByCompany(companyId) {
  try {
    const response = await fetch(`${BASE_URL}/jobs/company/${companyId}`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

export async function getJobsByCategory(categoryId) {
  try {
    const response = await fetch(`${BASE_URL}/jobs/category/${categoryId}`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}

export async function getJobsByLocation(locationId) {
  try {
    const response = await fetch(`${BASE_URL}/jobs/location/${locationId}`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, error: { message: 'Network error occurred' } };
  }
}