import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { guestOrderApi } from '../api/order';

export const createOrder = createAsyncThunk('order/createOrder', async (data, { rejectWithValue }) => {
  try {
    const res = await guestOrderApi.checkout(data);
    return res;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const orderSlice = createSlice({
  name: 'order',
  initialState: {},
  reducers: {},
});
