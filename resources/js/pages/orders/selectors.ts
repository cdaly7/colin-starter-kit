import { createSelector } from 'reselect';
import { OrderItem, Order } from '@/types';

// Input Selector
const orders = (state:any) => state.orders;

export const orderList = createSelector(
    orders,
    (orders) => orders.items ? orders.items : []
);

export const orderListWithMeta = createSelector(
    orderList,
    (orderList:Order[]) => {
      return orderList.map((order:Order) => {
          let readyToShip = true;
          if (order.status === 'PAID') {
              const missingItems = order.items.filter((orderItem:OrderItem) => orderItem.total_quantity !== orderItem.picked_quantity )
              readyToShip = missingItems.length === 0;
          }
          return { ...order, readyToShip };
      })
    }

)
