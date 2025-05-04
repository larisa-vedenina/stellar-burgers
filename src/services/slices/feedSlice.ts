import {
  createAsyncThunk,
  createSlice,
  createSelector
} from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder, TOrdersData } from '@utils-types';

export const fetchFeeds = createAsyncThunk(
  'feed/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFeedsApi();
      return data;
    } catch (error) {
      console.error('Feeds API Error:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка загрузки ленты'
      );
    }
  }
);

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

// Начальное состояние фида
const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

// Создание слайса для фида
export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearFeed(state) {
      Object.assign(state, initialState);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Ошибка загрузки ленты';
      });
  },
  selectors: {
    selectFeeds: (state) => state,
    selectFeedOrders: (state) => state.orders,
    selectTotal: (state) => state.total,
    selectTotalToday: (state) => state.totalToday
  }
});

export const selectFeedTotals = createSelector(
  [feedSlice.selectors.selectTotal, feedSlice.selectors.selectTotalToday],
  (total, totalToday) => ({ total, totalToday })
);

export const { clearFeed } = feedSlice.actions;
export const { selectFeeds, selectFeedOrders } = feedSlice.selectors;

export default feedSlice.reducer;
