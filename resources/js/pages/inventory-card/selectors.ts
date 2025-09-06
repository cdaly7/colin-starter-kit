import { createSelector } from 'reselect';
import { OrderItem, Order } from '@/types';

// Input Selector
const orders = (state) => state.orders;
const orderItems = (state) => state.orderItems;

const sortByCategory = (items) => {
  return items.slice().sort((a, b) => {
    if (a.category_name < b.category_name) return -1;
    if (a.category_name > b.category_name) return 1;
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
};

export const orderList = createSelector(
    orders,
    (orders) => orders.items ? orders.items : []
);

export const ordersToPack = createSelector(
  orderList,
  (orderList) => orderList.filter(order => order.status === 'PAID')      
);
export const filterdOrderId = createSelector(
  orderItems,
  (orderItems) => orderItems.filters.order  
);
export const orderItemsList = createSelector(
  orderItems,
  (orderItems) => orderItems.items ? orderItems.items : []
);

// Output Selector (derived data)
export const categoriesInOrders = createSelector(
  orderItemsList,
  (orderItems) => [...new Set(orderItems.map(item => item.category_name))].sort()
);

export const allItems = createSelector(
  orderItemsList,
  (orderItems) => sortByCategory(orderItems)
);

export const itemsNotPacked = createSelector(
  orderItemsList,
  (orderItems) => sortByCategory(orderItems.filter(item => !item.is_packed))
);

export const viewAll = createSelector(
  orderItems,
  (orders) => orders.viewAll
);

export const viewUsed = createSelector(
  orderItems,
  (orders) => orders.viewUsed
);

export const viewNew = createSelector(
  orderItems,
  (orders) => orders.viewNew
);

export const selectedCatergory = createSelector(
  orderItems,
  (orders) => orders.selectedCatergory
);

export const filteredItems = createSelector(
  allItems,
  selectedCatergory,
  viewAll,
  viewNew,
  viewUsed,
  filterdOrderId,
  (items, filterdCategory, viewAllItems, viewNew, viewUsed, orderId) => {
     return items.filter((item:OrderItem) => {
        let matchesCategory = true;
        let matchesOrderId = true;
        let matchesPickedStatus = true;
        let matchesNewStatus = true;
        let matchesUsedStatus = true;
        // Filter by new/used status
        if (!viewNew) {
             matchesNewStatus = item.condition !== 'N';
        }
        if (!viewUsed) {
            matchesUsedStatus = item.condition !== 'U'; 
        }
        if (filterdCategory) {
             matchesCategory = item.category_name === filterdCategory;
        }
        if (!viewAllItems) {
            matchesPickedStatus = item.total_quantity != item.picked_quantity;
        }
        if (orderId) {
            matchesOrderId = item.order_id == orderId;
        }
        return matchesCategory && matchesPickedStatus && matchesNewStatus && matchesUsedStatus && matchesOrderId;
     });
  }
);
