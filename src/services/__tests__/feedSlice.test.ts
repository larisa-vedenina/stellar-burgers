import feedSlice, {
  initialState,
  fetchFeeds,
  clearFeed,
  selectFeeds,
  selectFeedOrders,
  selectFeedTotals
} from '../slices/feedSlice';
import { TOrder } from '@utils-types';

describe('Тесты для feedSlice', () => {
  const mockOrders: TOrder[] = [
    {
      _id: '1',
      number: 123,
      ingredients: ['ing1', 'ing2'],
      name: 'Order 1',
      status: 'done',
      createdAt: '2025-05-11',
      updatedAt: '2025-05-11'
    },
    {
      _id: '2',
      number: 456,
      ingredients: ['ing3', 'ing4'],
      name: 'Order 2',
      status: 'pending',
      createdAt: '2025-05-11',
      updatedAt: '2025-05-11'
    }
  ];

  const mockFeedData = {
    orders: mockOrders,
    total: 100,
    totalToday: 10
  };

  it('должен вернуть начальное состояние', () => {
    const state = feedSlice(undefined, { type: '' });
    expect(state).toEqual(initialState);
  });

  describe('Экшен clearFeed', () => {
    it('должен сбрасывать состояние ', () => {
      const stateWithData = {
        ...initialState,
        orders: mockOrders,
        total: 50,
        totalToday: 5
      };
      const state = feedSlice(stateWithData, clearFeed());
      expect(state).toEqual(initialState);
    });
  });

  describe('Асинхронный экшен fetchFeeds', () => {
    it('должен установить isLoading в true при pending', () => {
      const state = feedSlice(initialState, { type: fetchFeeds.pending.type });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранить данные фида при fulfilled', () => {
      const action = {
        type: fetchFeeds.fulfilled.type,
        payload: mockFeedData
      };
      const state = feedSlice(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(10);
      expect(state.error).toBeNull();
    });

    it('должен установить ошибку при rejected', () => {
      const errorMessage = 'Ошибка загрузки';
      const action = {
        type: fetchFeeds.rejected.type,
        payload: errorMessage
      };
      const state = feedSlice(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('Селекторы', () => {
    const mockState = {
      feed: {
        ...initialState,
        orders: mockOrders,
        total: 100,
        totalToday: 10
      }
    };

    it('selectFeeds должен возвращать все данные фида', () => {
      const result = selectFeeds(mockState);
      expect(result).toEqual(mockState.feed);
    });

    it('selectFeedOrders должен возвращать только заказы', () => {
      const result = selectFeedOrders(mockState);
      expect(result).toEqual(mockOrders);
    });

    it('selectFeedTotals должен возвращать total и totalToday', () => {
      const result = selectFeedTotals(mockState);
      expect(result).toEqual({
        total: 100,
        totalToday: 10
      });
    });
  });
});
