import userSlice, {
  initialState,
  fetchUser,
  login,
  register,
  logout,
  updateUser,
  authCheck
} from '../slices/userSlice';
import { TUser } from '@utils-types';

describe('userSlice тесты', () => {
  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  // Тест начального состояния
  it('должен вернуть initialState', () => {
    const state = userSlice(undefined, { type: '' });
    expect(state).toEqual(initialState);
  });

  // Тест синхронного экшена
  it('authCheck должен установить isAuthChecked', () => {
    const state = userSlice(initialState, authCheck());
    expect(state.isAuthChecked).toBe(true);
  });

  // Общие тесты для асинхронных экшенов
  describe('Асинхронные экшены', () => {
    const testCases = [
      { name: 'fetchUser', action: fetchUser },
      { name: 'login', action: login },
      { name: 'register', action: register },
      { name: 'updateUser', action: updateUser },
      { name: 'logout', action: logout }
    ];

    testCases.forEach(({ name, action }) => {
      it(`${name}.pending должен установить isLoading`, () => {
        const state = userSlice(initialState, { type: action.pending.type });
        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
      });

      it(`${name}.rejected должен установить ошибку`, () => {
        const error = 'Ошибка теста';
        const state = userSlice(initialState, {
          type: action.rejected.type,
          payload: error
        });
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(error);
      });
    });

    // Тесты для успешных сценариев
    it('fetchUser.fulfilled должен установить пользователя', () => {
      const state = userSlice(initialState, {
        type: fetchUser.fulfilled.type,
        payload: mockUser
      });
      expect(state.data).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('logout.fulfilled должен очистить пользователя', () => {
      const state = userSlice(
        { ...initialState, data: mockUser, isAuthenticated: true },
        { type: logout.fulfilled.type }
      );
      expect(state.data).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });
});
