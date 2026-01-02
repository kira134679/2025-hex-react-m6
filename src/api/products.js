import { apiClient } from './instances/apiClient';

export const productsApi = {
  getProducts: () => apiClient.get(`/api/${import.meta.env.VITE_API_PATH}/admin/products`),
};
