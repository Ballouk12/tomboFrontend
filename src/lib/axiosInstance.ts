import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8082',
});

instance.interceptors.request.use((config) => {
  // Ne pas ajouter le token pour signup et signin
  if (
    config.url?.includes('/user/signup') ||
    config.url?.includes('/user/signin')
  ) {
    return config;
  }
  const token = localStorage.getItem('token');
  console.log('[Axios Interceptor] Token utilisé:', token);
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

export default instance;
