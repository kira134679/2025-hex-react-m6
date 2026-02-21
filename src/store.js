import authReducer from '@/slice/authSlice';
import cartReducer from '@/slice/cartSlice';
import productReducer from '@/slice/productSlice';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    product: productReducer,
  },
});

export default store;
