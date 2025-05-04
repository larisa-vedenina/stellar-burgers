import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useState } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import { selectUser } from '../../services/slices/userSlice';
import { selectFeedOrders, fetchFeeds } from '../../services/slices/feedSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const user = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Загружаем заказы, когда у нас есть пользователь
    if (user) {
      setIsLoading(true);
      dispatch(fetchFeeds())
        .unwrap()
        .catch((error) => console.error('Ошибка загрузки заказов:', error))
        .finally(() => setIsLoading(false));
    }
  }, [dispatch, user]);

  if (isLoading) {
    return <div>Загрузка заказов...</div>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
