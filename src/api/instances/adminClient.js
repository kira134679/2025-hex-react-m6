import axios from 'axios';

const adminClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

adminClient.interceptors.request.use(config => {
  const token = document.cookie
    .split(';')
    .map(s => s.trim())
    .find(s => s.startsWith('hex_token='))
    ?.split('=')[1];

  if (token) {
    config.headers.Authorization = token;
  }

  return config;
});

adminClient.interceptors.response.use(
  res => res.data,
  err => Promise.reject(err.response?.data?.message || err.message),
);

export { adminClient };
