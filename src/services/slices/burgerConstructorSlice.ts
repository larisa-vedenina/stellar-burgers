import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

export type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  isLoading: boolean;
};

export const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
  isLoading: false
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;
        if (ingredient.type === 'bun') {
          state.bun = ingredient;
        } else {
          state.ingredients.push(ingredient);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { ingredients } = state;
      const { fromIndex, toIndex } = action.payload;

      if (fromIndex === toIndex) return;

      const [movedItem] = ingredients.splice(fromIndex, 1);
      ingredients.splice(toIndex, 0, movedItem);
    },
    clearConstructor: () => initialState
  },
  selectors: {
    selectConstructorItems: (state) => state,
    selectConstructorBun: (state) => state.bun,
    selectConstructorIngredients: (state) => state.ingredients
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

export const {
  selectConstructorItems,
  selectConstructorBun,
  selectConstructorIngredients
} = constructorSlice.selectors;

export default constructorSlice.reducer;
