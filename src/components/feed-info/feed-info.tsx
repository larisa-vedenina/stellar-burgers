import { FC, useMemo } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

import { useSelector } from '../../services/store';
import {
  selectFeedOrders,
  selectFeedTotals
} from '../../services/slices/feedSlice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  // Получаем данные из хранилища
  const orders = useSelector(selectFeedOrders);
  const feed = useSelector(selectFeedTotals);

  const readyOrders = useMemo(() => getOrders(orders, 'done'), [orders]);
  const pendingOrders = useMemo(() => getOrders(orders, 'pending'), [orders]);

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
