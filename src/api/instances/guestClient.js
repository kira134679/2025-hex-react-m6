import axios from 'axios';

const guestClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

guestClient.interceptors.response.use(
  res => res.data,
  err => Promise.reject(err.response?.data?.message || err.message),
);

export { guestClient };
