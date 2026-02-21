import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { guestProductsApi } from '../api';

export const getProducts = createAsyncThunk('product/getProducts', async (_, { rejectWithValue }) => {
  try {
    return await guestProductsApi.getProducts();
  } catch (error) {
    return rejectWithValue(error);
  }
});

const productSlice = createSlice({
  name: 'product',
  initialState: {
    productList: [],
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getProducts.fulfilled, (state, { payload }) => {
      state.productList = payload.products;
    });
    builder.addCase(getProducts.rejected, state => {
      state.productList = [];
    });
  },
});

export const selectProductList = state => state.product.productList;
export const selectPagination = state => state.product.pagination;

export default productSlice.reducer;
