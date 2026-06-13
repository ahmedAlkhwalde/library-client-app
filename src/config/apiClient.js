import axios from 'axios';

const apiClient = axios.create({
  timeout: 10000, 
  
  headers: {
    'Accept': 'application/json',
  },

  baseURL: 'http://localhost:8000/api',
});

// Add a request interceptor to attach the token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Adjust key if needed
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;