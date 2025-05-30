import burgerConstructorReducer, {
  initialState,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../slices/burgerConstructorSlice';
import { TIngredient } from '@utils-types';

// Моковые данные для тестов
const mockBun: TIngredient = {
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
};

const mockMainIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093e',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
};

describe('burgerConstructorSlice reducer', () => {
  it('должен возвращат начальное состояние', () => {
    const result = burgerConstructorReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });
    expect(result).toEqual(initialState);
  });

  describe('Экшен addIngredient', () => {
    it('должен добавлять булку', () => {
      const state = burgerConstructorReducer(
        initialState,
        addIngredient(mockBun)
      );
      expect(state.bun).toMatchObject(mockBun);
      expect(state.bun?._id).toBeDefined();
    });

    it('должен заменять булку при добавлении новой', () => {
      const firstState = burgerConstructorReducer(
        initialState,
        addIngredient(mockBun)
      );
      const newBun = { ...mockBun, _id: 'new_bun_id' };
      const state = burgerConstructorReducer(firstState, addIngredient(newBun));
      expect(state.bun).toMatchObject(newBun);
    });

    it('должен добавлять основной ингредиент', () => {
      const state = burgerConstructorReducer(
        initialState,
        addIngredient(mockMainIngredient)
      );
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toMatchObject(mockMainIngredient);
    });
  });

  describe('Экшен removeIngredient', () => {
    it('должен удалять ингредиент по id', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockMainIngredient)
      );
      const ingredientId = state.ingredients[0].id;
      state = burgerConstructorReducer(state, removeIngredient(ingredientId));
      expect(state.ingredients).toHaveLength(0);
    });
  });

  describe('Экшен moveIngredient', () => {
    const mockSecondIngredient: TIngredient = {
      ...mockMainIngredient,
      _id: 'second_ingredient'
    };

    it('должен перемещать ингредиент', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockMainIngredient)
      );
      state = burgerConstructorReducer(
        state,
        addIngredient(mockSecondIngredient)
      );

      const originalOrder = [...state.ingredients];
      state = burgerConstructorReducer(
        state,
        moveIngredient({ fromIndex: 0, toIndex: 1 })
      );

      expect(state.ingredients[0]).toEqual(originalOrder[1]);
      expect(state.ingredients[1]).toEqual(originalOrder[0]);
    });
  });

  describe('Экшен clearConstructor', () => {
    it('должен сбрасывать состояние', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockBun)
      );
      state = burgerConstructorReducer(
        state,
        addIngredient(mockMainIngredient)
      );
      state = burgerConstructorReducer(state, clearConstructor());
      expect(state).toEqual(initialState);
    });
  });
});
