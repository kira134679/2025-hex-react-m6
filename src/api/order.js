import { GUEST_API_PATH } from './constants';
import { guestClient } from './instances/guestClient';

export const guestOrderApi = {
  checkout: data => guestClient.post(`${GUEST_API_PATH}/order`, { data }),
};
