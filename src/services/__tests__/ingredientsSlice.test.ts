import ingredientsSlice, {
  initialState,
  fetchIngredients,
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError,
  selectIngredientById
} from '../slices/ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('Тесты для ingredientsSlice', () => {
  // Тест на возвращение начального состояния
  it('должен вернуть начальное состояние', () => {
    const result = ingredientsSlice(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  describe('Тесты для асинхронных экшенов fetchIngredients', () => {
    // Тест на состояние pending (запрос начался)
    it('должен установить isLoading в true при pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsSlice(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    // Тест на состояние fulfilled (запрос успешен)
    it('должен установить ингредиенты и isLoading в false при fulfilled', () => {
      const mockIngredients: TIngredient[] = [
        {
          _id: '643d69a5c3f7b9001cfa093c',
          name: 'Краторная булка N-200i',
          type: 'bun',
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: 'https://code.s3.yandex.net/react/code/bun-02.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
        },
        {
          _id: '643d69a5c3f7b9001cfa0941',
          name: 'Биокотлета из марсианской Магнолии',
          type: 'main',
          proteins: 420,
          fat: 142,
          carbohydrates: 242,
          calories: 4242,
          price: 424,
          image: 'https://code.s3.yandex.net/react/code/meat-01.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
        }
      ];

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsSlice(initialState, action);

      // Проверяем что загрузка завершена
      expect(state.isLoading).toBe(false);
      // Проверяем что ингредиенты установлены
      expect(state.items).toEqual(mockIngredients);
      // Проверяем что нет ошибок
      expect(state.error).toBeNull();
    });

    // Тест на состояние rejected (ошибка запроса)
    it('должен установить ошибку и isLoading в false при rejected', () => {
      const errorMessage = 'Ошибка загрузки ингредиентов';
      const action = {
        type: fetchIngredients.rejected.type,
        payload: errorMessage
      };
      const state = ingredientsSlice(initialState, action);

      // Проверяем что загрузка завершена
      expect(state.isLoading).toBe(false);
      // Проверяем что ошибка установлена
      expect(state.error).toBe(errorMessage);
      // Проверяем что список ингредиентов пустой
      expect(state.items).toEqual([]);
    });
  });

  describe('Тесты для селекторов', () => {
    // Моковое состояние для тестирования селекторов
    const mockState = {
      ingredients: {
        items: [
          {
            _id: '1',
            name: 'Тестовый ингредиент',
            type: 'main',
            proteins: 100,
            fat: 100,
            carbohydrates: 100,
            calories: 100,
            price: 100,
            image: 'test-image.png',
            image_mobile: 'test-image-mobile.png',
            image_large: 'test-image-large.png'
          }
        ],
        isLoading: false,
        error: null
      }
    };

    // Тест селектора всех ингредиентов
    it('должен выбрать все ингредиенты', () => {
      const result = selectIngredients(mockState);
      expect(result).toEqual(mockState.ingredients.items);
    });

    // Тест селектора состояния загрузки
    it('должен выбрать состояние загрузки', () => {
      const result = selectIngredientsLoading(mockState);
      expect(result).toBe(mockState.ingredients.isLoading);
    });

    // Тест селектора ошибки
    it('должен выбрать ошибку', () => {
      const result = selectIngredientsError(mockState);
      expect(result).toBe(mockState.ingredients.error);
    });

    // Тест селектора ингредиента по ID
    it('должен выбрать ингредиент по ID', () => {
      const selector = selectIngredientById(mockState);
      // Проверяем существующий ингредиент
      const result = selector('1');
      expect(result).toEqual(mockState.ingredients.items[0]);
      // Проверяем несуществующий ингредиент
      expect(selector('2')).toBeUndefined();
    });
  });
});
