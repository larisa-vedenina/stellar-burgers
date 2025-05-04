import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

import { useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { TIngredient } from '@utils-types';

export const IngredientDetails: FC = () => {
  const location = useLocation();

  // Получаем все ингредиенты из хранилища
  const ingredients = useSelector(selectIngredients);

  // Извлекаем id ингредиента из URL
  const id = location.pathname.split('/').pop();

  // Находим нужный ингредиент в массиве
  const ingredientData = ingredients.find(
    (ingredient: TIngredient) => ingredient._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
