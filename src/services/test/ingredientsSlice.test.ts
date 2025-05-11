import { ingredientsSlice } from '../slices/ingredientsSlice';
import { fetchIngredients } from '../slices/ingredientsSlice';
import { TIngredient } from '@utils-types';

const { reducer, selectors } = ingredientsSlice;

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
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
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
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  }
];

describe('ingredientsSlice tests', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual({
      items: [],
      isLoading: false,
      error: null
    });
  });

  it('should handle fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(undefined, action);

    expect(state).toEqual({
      items: [],
      isLoading: true,
      error: null
    });
  });

  it('should handle fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = reducer(undefined, action);

    expect(state).toEqual({
      items: mockIngredients,
      isLoading: false,
      error: null
    });
  });

  it('should handle fetchIngredients.rejected', () => {
    const errorMessage = 'Ошибка загрузки';
    const action = {
      type: fetchIngredients.rejected.type,
      payload: errorMessage
    };
    const state = reducer(undefined, action);

    expect(state).toEqual({
      items: [],
      isLoading: false,
      error: errorMessage
    });
  });

  it('selectors should return correct data', () => {
    const state = {
      ingredients: {
        items: mockIngredients,
        isLoading: false,
        error: null
      }
    };

    expect(selectors.selectIngredients(state as any)).toEqual(mockIngredients);
    expect(selectors.selectIngredientsLoading(state as any)).toBe(false);
    expect(selectors.selectIngredientsError(state as any)).toBeNull();
    expect(selectors.selectIngredientById(state as any)('1')).toEqual(
      mockIngredients[0]
    );
  });
});
