import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';

import {
  selectConstructorItems,
  clearConstructor
} from '../../services/slices/burgerConstructorSlice';
import {
  createOrder,
  selectCurrentOrder,
  selectOrderLoading,
  clearOrder
} from '../../services/slices/orderSlice';
import { selectUser } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // данные из хранилища с помощью селекторов
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderLoading);
  const orderModalData = useSelector(selectCurrentOrder);
  const user = useSelector(selectUser);

  //Обработчик клика по кнопке "Оформить заказ"
  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    // Если пользователь не авторизован - перенаправляем на страницу входа
    if (!user) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    // Формируем массив id ингредиентов для заказа
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id
    ];

    // Отправляем запрос на создание заказа
    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then(() => {
        // После создания заказа чистм конструктор
        dispatch(clearConstructor());
      })
      .catch((error) => {
        console.error('Ошибка при создании заказа:', error);
      });
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (sum: number, ingredient: TConstructorIngredient) =>
          sum + ingredient.price,
        0
      ),
    [constructorItems]
  );

  // Рендерим UI компонент
  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
