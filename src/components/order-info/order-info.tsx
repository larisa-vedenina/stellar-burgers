import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectCurrentOrder,
  selectOrderLoading,
  fetchOrderByNumber,
  clearOrder
} from '../../services/slices/orderSlice';
import { selectIngredients } from '../../services/slices/ingredientsSlice';

export const OrderInfo: FC = () => {
  // Получаем данные текущего заказа и всех ингредиентов из хранилища
  const orderData = useSelector(selectCurrentOrder);
  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectOrderLoading);
  const { number } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }

    return () => {
      dispatch(clearOrder());
    };
  }, [dispatch, number]);

  if (isLoading || !orderData) {
    return <Preloader />;
  }

  const ingredientsInfo = orderData.ingredients.reduce(
    (acc, id) => {
      const ingredient = ingredients.find((ing) => ing._id === id);
      if (ingredient) {
        acc[id] = acc[id]
          ? { ...ingredient, count: acc[id].count + 1 }
          : { ...ingredient, count: 1 };
      }
      return acc;
    },
    {} as Record<string, TIngredient & { count: number }>
  );

  const total = Object.values(ingredientsInfo).reduce(
    (acc, item) => acc + item.price * item.count,
    0
  );

  const orderInfo = {
    ...orderData,
    ingredientsInfo,
    date: new Date(orderData.createdAt),
    total
  };

  return <OrderInfoUI orderInfo={orderInfo} />;
};
