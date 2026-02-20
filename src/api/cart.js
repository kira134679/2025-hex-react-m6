import { GUEST_API_PATH } from './constants';
import { guestClient } from './instances/guestClient';

export const guestCartApi = {
  addToCart: data => guestClient.post(`${GUEST_API_PATH}/cart`, data),
  getCart: () => guestClient.get(`${GUEST_API_PATH}/cart`),
  updateCart: id => guestClient.put(`${GUEST_API_PATH}/cart/${id}`, data),
  deleteCartItem: id => guestClient.delete(`${GUEST_API_PATH}/cart/${id}`),
  deleteCart: () => guestClient.delete(`${GUEST_API_PATH}/carts`),
};
