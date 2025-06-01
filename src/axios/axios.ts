import axios from 'axios';

export default axios.create({
  baseURL: 'https://learnx-spring-app-86563bbf71fb.herokuapp.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const axiosPrivate = axios.create({
  baseURL: 'https://learnx-spring-app-86563bbf71fb.herokuapp.com/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosPrivate.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    console.debug('Axios private request interceptor: token', token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);