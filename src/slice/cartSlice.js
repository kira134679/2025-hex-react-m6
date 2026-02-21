import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { guestCartApi } from '../api/cart';

export const getCart = createAsyncThunk('cart/getCart', async (_, { rejectWithValue }) => {
  try {
    const res = await guestCartApi.getCart();
    return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (data, { rejectWithValue }) => {
  try {
    return await guestCartApi.addToCart({ data });
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const deleteCartItem = createAsyncThunk('cart/deleteCartItem', async (id, { rejectWithValue }) => {
  try {
    return await guestCartApi.deleteCartItem(id);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const deleteCarts = createAsyncThunk('cart/deleteCarts', async (_, { rejectWithValue }) => {
  try {
    return await guestCartApi.deleteCart();
  } catch (error) {
    return rejectWithValue(error);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartList: [],
    total: 0,
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getCart.fulfilled, (state, { payload }) => {
      state.cartList = payload.carts;
      state.total = payload.final_total;
    });
    builder.addCase(getCart.rejected, state => {
      state.cartList = [];
      state.total = 0;
    });
  },
});

export const selectCartList = state => state.cart.cartList;
export const selectTotal = state => state.cart.total;

export default cartSlice.reducer;
