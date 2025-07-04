import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { useDispatch } from '../../services/store';
import { addIngredient } from '../../services/slices/burgerConstructorSlice';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const dispatch = useDispatch();
    const location = useLocation();

    //Обработчик добавления ингредиента в конструктор
    const handleAdd = () => {
      dispatch(addIngredient(ingredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
