import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeeds,
  selectFeedOrders,
  clearFeed
} from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders: TOrder[] = useSelector(selectFeedOrders);

  useEffect(() => {
    dispatch(fetchFeeds());

    return () => {
      dispatch(clearFeed());
    };
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  const handleGetFeeds = () => {
    dispatch(fetchFeeds()); // Повторно загружаем фиды
    dispatch(clearFeed()); // Очищаем фиды
  };

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
