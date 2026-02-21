import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { authApi } from '../api';

export const login = createAsyncThunk('auth/login', async (submitData, { rejectWithValue }) => {
  try {
    return await authApi.login(submitData);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const verifyAuth = createAsyncThunk('auth/verifyAuth', async (_, { rejectWithValue }) => {
  try {
    const res = await authApi.check();
    console.log('thunk', res);
    return res;
  } catch (error) {
    console.error(error);
    return rejectWithValue(error);
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    return await authApi.logout();
  } catch (error) {
    return rejectWithValue(error);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuth: false,
    isAuthChecked: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(verifyAuth.pending, state => {
      state.isAuthChecked = false;
    });
    builder.addCase(verifyAuth.fulfilled, state => {
      state.isAuth = true;
    });
    builder.addCase(verifyAuth.rejected, state => {
      state.isAuth = false;
    });
    builder.addMatcher(isAnyOf(verifyAuth.fulfilled, verifyAuth.rejected), state => {
      state.isAuthChecked = true;
    });
  },
});

export const selectIsAuth = state => state.auth.isAuth;
export const selectIsAuthChecked = state => state.auth.isAuthChecked;

export default authSlice.reducer;
