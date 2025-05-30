import orderSlice, {
  initialState,
  createOrder,
  fetchOrderByNumber,
  clearOrder,
  resetOrderLoading,
  selectCurrentOrder,
  selectOrderLoading,
  selectOrderError
} from '../slices/orderSlice';
import { TOrder } from '@utils-types';

describe('Тесты для orderSlice', () => {
  
  const mockOrder: TOrder = {
    _id: '6607c7f497ede0001d066220',
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941'],
    status: 'done',
    name: 'Space флюоресцентный бургер',
    createdAt: '2024-03-30T16:20:36.546Z',
    updatedAt: '2024-03-30T16:20:36.546Z',
    number: 12345
  };

  it('должен вернуть начальное состояние', () => {
    const result = orderSlice(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  describe('Тесты для createOrder', () => {
    it('должен установить isLoading в true при pending', () => {
      const state = orderSlice(initialState, {
        type: createOrder.pending.type
      });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранить заказ и isLoading в false при fulfilled', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      const state = orderSlice(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.currentOrder).toEqual(mockOrder);
      expect(state.error).toBeNull();
    });

    it('должен установить ошибку при rejected', () => {
      const errorMessage = 'Ошибка создания заказа';
      const action = {
        type: createOrder.rejected.type,
        error: { message: errorMessage }
      };
      const state = orderSlice(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.currentOrder).toBeNull();
    });
  });

  describe('Тесты для fetchOrderByNumber', () => {
    it('должен установить isLoading в true при pending', () => {
      const state = orderSlice(initialState, {
        type: fetchOrderByNumber.pending.type
      });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранить заказ и isLoading в false при fulfilled', () => {
      const action = {
        type: fetchOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      const state = orderSlice(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.currentOrder).toEqual(mockOrder);
      expect(state.error).toBeNull();
    });

    it('должен установить ошибку при rejected', () => {
      const errorMessage = 'Заказ не найден';
      const action = {
        type: fetchOrderByNumber.rejected.type,
        error: { message: errorMessage }
      };
      const state = orderSlice(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.currentOrder).toBeNull();
    });
  });

  describe('Тесты для редьюсеров', () => {
    it('должен очищать текущий заказ при clearOrder', () => {
      const stateWithOrder = { ...initialState, currentOrder: mockOrder };
      const state = orderSlice(stateWithOrder, clearOrder());

      expect(state.currentOrder).toBeNull();
    });

    it('должен сбрасывать  isLoading при resetOrderLoading', () => {
      const loadingState = { ...initialState, isLoading: true };
      const state = orderSlice(loadingState, resetOrderLoading());

      expect(state.isLoading).toBe(false);
    });
  });

  describe('Тесты для селекторов', () => {
    const mockState = {
      order: {
        currentOrder: mockOrder,
        isLoading: false,
        error: null
      }
    };

    it('selectCurrentOrder должен возвращать текущий заказ', () => {
      const result = selectCurrentOrder(mockState);
      expect(result).toEqual(mockOrder);
    });

    it('selectOrderLoading должен возвращать состояние загрузки', () => {
      const result = selectOrderLoading(mockState);
      expect(result).toBe(false);
    });

    it('selectOrderError должен возвращать ошибку', () => {
      const errorState = {
        order: {
          ...mockState.order,
          error: 'Test error'
        }
      };
      const result = selectOrderError(errorState);
      expect(result).toBe('Test error');
    });
  });
});
