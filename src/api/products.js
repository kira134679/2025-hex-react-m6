import { adminClient } from './instances/adminClient';

const ADMIN_API_PATH = `/api/${import.meta.env.VITE_API_PATH}/admin`;

export const productsApi = {
  getAllProducts: () => adminClient.get(`${ADMIN_API_PATH}/products/all`),
  getProducts: (params = {}) => adminClient.get(`${ADMIN_API_PATH}/products`, { params }),
  createProduct: data => adminClient.post(`${ADMIN_API_PATH}/product`, { data }),
  updateProduct: (id, data) => adminClient.put(`${ADMIN_API_PATH}/product/${id}`, { data }),
  deleteProduct: id => adminClient.delete(`${ADMIN_API_PATH}/product/${id}`),
};
