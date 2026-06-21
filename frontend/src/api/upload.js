const API_BASE_URL = (import.meta.env.VITE_BASE_URL || 'http://localhost:3000')
  .toString()
  .trim()
  .replace(/^['"]|['"]$/g, '');

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const token = localStorage.getItem('access_token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    const response = await fetch(`${API_BASE_URL}/upload/resume`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();
    
    if (response.ok) {
      const resumeUrl = data.url.startsWith('http') 
        ? data.url 
        : `${API_BASE_URL}${data.url.startsWith('/') ? '' : '/'}${data.url}`;
      
      return { success: true, url: resumeUrl, filename: data.filename };
    } else {
      return { success: false, error: data.message || 'Upload failed' };
    }
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'Network error occurred' };
  }
}