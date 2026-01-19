import { apiClient } from './instances/apiClient';

const ADMIN_API_PATH = `/api/${import.meta.env.VITE_API_PATH}/admin`;

export const productsApi = {
  getAllProducts: () => apiClient.get(`${ADMIN_API_PATH}/products/all`),
  getProducts: (params = {}) => apiClient.get(`${ADMIN_API_PATH}/products`, { params }),
  createProduct: data => apiClient.post(`${ADMIN_API_PATH}/product`, { data }),
  updateProduct: (id, data) => apiClient.put(`${ADMIN_API_PATH}/product/${id}`, { data }),
  deleteProduct: id => apiClient.delete(`${ADMIN_API_PATH}/product/${id}`),
};
