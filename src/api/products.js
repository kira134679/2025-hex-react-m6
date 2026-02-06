import { ADMIN_API_PATH, GUEST_API_PATH } from './constants';
import { adminClient } from './instances/adminClient';
import { guestClient } from './instances/guestClient';

export const adminProductsApi = {
  getAllProducts: () => adminClient.get(`${ADMIN_API_PATH}/products/all`),
  getProducts: (params = {}) => adminClient.get(`${ADMIN_API_PATH}/products`, { params }),
  createProduct: data => adminClient.post(`${ADMIN_API_PATH}/product`, { data }),
  updateProduct: (id, data) => adminClient.put(`${ADMIN_API_PATH}/product/${id}`, { data }),
  deleteProduct: id => adminClient.delete(`${ADMIN_API_PATH}/product/${id}`),
};

export const guestProductsApi = {
  getAllProducts: (config = {}) => guestClient.get(`${GUEST_API_PATH}/products/all`, config),
  getProducts: (params = {}) => {
    return guestClient.get(`${GUEST_API_PATH}/products`, { params });
  },
  getProductById: (productId, config = {}) => guestClient.get(`${GUEST_API_PATH}/product/${productId}`, config),
};
