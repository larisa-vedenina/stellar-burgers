import { constructorSlice, initialState } from '../slices/burgerConstructorSlice';
import { TIngredient } from '@utils-types';

const { reducer, actions } = constructorSlice;

describe('constructorSlice tests', () => {
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

  const mockMain1: TIngredient = {
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
  };

  const mockMain2: TIngredient = {
    _id: '643d69a5c3f7b9001cfa0940',
    name: 'Говяжий метеорит (отбивная)',
    type: 'main',
    proteins: 800,
    fat: 800,
    carbohydrates: 300,
    calories: 2674,
    price: 3000,
    image: 'https://code.s3.yandex.net/react/code/meat-04.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png',
  };

  it('should return initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle addIngredient (bun)', () => {
    const action = actions.addIngredient(mockBun);
    const result = reducer(initialState, action);
    
    expect(result.bun).toEqual({
      ...mockBun,
      id: expect.any(String)
    });
    expect(result.ingredients).toEqual([]);
  });

  it('should handle addIngredient (not bun)', () => {
    const action = actions.addIngredient(mockMain1);
    const result = reducer(initialState, action);
    
    expect(result.bun).toBeNull();
    expect(result.ingredients).toEqual([
      {
        ...mockMain1,
        id: expect.any(String)
      }
    ]);
  });

  it('should handle removeIngredient', () => {
    // Добавляем ингредиент
    const stateWithIngredient = reducer(
      initialState,
      actions.addIngredient(mockMain1)
    );
    const ingredientId = stateWithIngredient.ingredients[0].id;
    
    // Удаляем ингредиент
    const result = reducer(
      stateWithIngredient,
      actions.removeIngredient(ingredientId)
    );
    
    expect(result.ingredients).toEqual([]);
  });

  it('should handle moveIngredient', () => {
    // Добавляем два ингредиента
    let state = reducer(initialState, actions.addIngredient(mockMain1));
    state = reducer(state, actions.addIngredient(mockMain2));

    const fromIndex = 0;
    const toIndex = 1;

    // Меняем местами
    const result = reducer(
      state,
      actions.moveIngredient({ fromIndex, toIndex })
    );

    expect(result.ingredients[0]._id).toBe(mockMain2._id);
    expect(result.ingredients[1]._id).toBe(mockMain1._id);
  });

  it('should handle clearConstructor', () => {
    let state = reducer(initialState, actions.addIngredient(mockBun));
    state = reducer(state, actions.addIngredient(mockMain1));
    
    // Очищаем конструктор
    const result = reducer(state, actions.clearConstructor());
    
    expect(result).toEqual(initialState);
  });

  it('should replace bun when adding new bun', () => {
    // Добавляем первую булку
    let state = reducer(initialState, actions.addIngredient(mockBun));
    
    // Создаем вторую булку (с тем же _id, но другими свойствами)
    const mockBun2: TIngredient = {
      ...mockBun,
      name: 'Новая булка',
      price: 2000
    };
    
    // Добавляем вторую булку
    state = reducer(state, actions.addIngredient(mockBun2));
    
    // Проверяем что булка заменилась
    expect(state.bun?.name).toBe('Новая булка');
    expect(state.bun?.price).toBe(2000);
    expect(state.ingredients).toEqual([]);
  });
});
