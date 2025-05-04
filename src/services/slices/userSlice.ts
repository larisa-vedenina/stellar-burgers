import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '../../utils/burger-api';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

export const fetchUser = createAsyncThunk(
  'user/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      if (!response.success) {
        return rejectWithValue('Ошибка получения данных пользователя');
      }
      return response.user;
    } catch (error) {
      console.error('User API Error:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка авторизации'
      );
    }
  }
);

const handleAuthTokens = (accessToken: string, refreshToken: string) => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const login = createAsyncThunk(
  'user/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      if (!response.success) {
        return rejectWithValue('Ошибка входа');
      }
      handleAuthTokens(response.accessToken, response.refreshToken);
      return response.user;
    } catch (error) {
      console.error('Login Error:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка входа'
      );
    }
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      if (!response.success) {
        return rejectWithValue('Ошибка регистрации');
      }
      handleAuthTokens(response.accessToken, response.refreshToken);
      return response.user;
    } catch (error) {
      console.error('Register Error:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка регистрации'
      );
    }
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutApi();
      if (!response.success) {
        return rejectWithValue('Ошибка выхода');
      }
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return null;
    } catch (error) {
      console.error('Logout Error:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка выхода'
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(data);
      if (!response.success) {
        return rejectWithValue('Ошибка обновления данных');
      }
      return response.user;
    } catch (error) {
      console.error('Update User Error:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка обновления'
      );
    }
  }
);

type TUserState = {
  data: TUser | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  data: null,
  isAuthChecked: false,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authCheck: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.isAuthChecked = true;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Ошибка входа';
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.data = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
  selectors: {
    selectUser: (state) => state.data,
    selectAuthChecked: (state) => state.isAuthChecked,
    selectAuthenticated: (state) => state.isAuthenticated,
    selectUserLoading: (state) => state.isLoading,
    selectUserError: (state) => state.error
  }
});

export const { authCheck } = userSlice.actions;
export const {
  selectUser,
  selectAuthChecked,
  selectAuthenticated,
  selectUserLoading,
  selectUserError
} = userSlice.selectors;

export default userSlice.reducer;
