import store, { RootState } from '../store';
import { initialState as feedInitialState } from '../slices/feedSlice';
import { initialState as ingredientsInitialState } from '../slices/ingredientsSlice';
import { initialState as burgerConstructorInitialState } from '../slices/burgerConstructorSlice';
import { initialState as userInitialState } from '../slices/userSlice';
import { initialState as orderInitialState } from '../slices/orderSlice';

describe('Тесты для store (rootReducer)', () => {
  const expectedInitialState: RootState = {
    feed: feedInitialState,
    ingredients: ingredientsInitialState,
    burgerConstructor: burgerConstructorInitialState,
    user: userInitialState,
    order: orderInitialState
  };

  it('должен возвращать корректное начальное состояние', () => {
    const state = store.getState();
    expect(state).toEqual(expectedInitialState);
  });

  it('должен корректно обрабатывать неизвестный экшен', () => {
    const initialState = store.getState();
    store.dispatch({ type: 'UNKNOWN_ACTION' } as any);
    expect(store.getState()).toEqual(initialState);
  });

  it('должен содержать все необходимые слайсы', () => {
    const state = store.getState();
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('order');
  });

  it('должен правильно типизировать RootState', () => {
    const state: RootState = store.getState();
    expect(state.feed.orders).toBeInstanceOf(Array);
    expect(state.ingredients.items).toBeInstanceOf(Array);
    expect(state.user.data).toEqual(null);
  });
});
