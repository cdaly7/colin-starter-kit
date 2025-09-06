import { createSelector } from 'reselect';
import { ApplicationOrder, BricklinkInventoryItem, OrderItem } from '@/types';
import App from '.';

// Input Selector
const orders = (state) => state.orders;
//const orderItems = (state) => state.orderItems;
const bricklinkStore = (state) => state.bricklinkStore;
const itemsToPick = (state) => state.itemsToPick;

export const orderList = createSelector(
  orders,
  (orders) => orders.items ? orders.items : []
);

export const ordersToPack = createSelector(
  orderList,
  (orderList) => orderList.filter((order: ApplicationOrder) => order.status === 'PAID')
);

export const ordersToPickWithStatus = createSelector(
  ordersToPack,
  (ordersToPack) => ordersToPack.map((order: ApplicationOrder) => ({
    ...order,
    is_picked: order.items.every((item) => item.picked_quantity == item.total_quantity),
    is_packed: order.items.every(item => item.is_packed)
  }))
);

export const allOrderItemsList = createSelector(
  ordersToPack,
  (orders) => {
    return orders.flatMap((order: ApplicationOrder) => order.items ? order.items : []);
  }
);

export const categoriesInOrders = createSelector(
  allOrderItemsList,
  (orderItems) => {
    const uniqueObjectsByName = new Map();

    const addObjectByName = (obj: { category_name: string; category_id: string }) => {
      uniqueObjectsByName.set(obj.category_name, obj);
    };
    orderItems.forEach((orderItem: OrderItem) => {
      addObjectByName({ category_name: orderItem.category_name, category_id: orderItem.category_id });
    });

    return Array.from(uniqueObjectsByName.values()).slice().sort((a, b) => {
      if (a.category_name < b.category_name) return -1;
      if (a.category_name > b.category_name) return 1;
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  }
);

export const filters = createSelector(
  itemsToPick,
  (itemsToPick) => itemsToPick.filters
);

const sortByCategory = (items) => {
  return items.slice().sort((a, b) => {
    if (a.category_name < b.category_name) return -1;
    if (a.category_name > b.category_name) return 1;
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
};


export const filterdOrderId = createSelector(
  filters,
  (filters) => filters.orderId
);

export const inventoryItemModalOpen = createSelector(
  itemsToPick,
  (itemsToPick) => itemsToPick.inventoryItemModalOpen
);

export const itemsNotPacked = createSelector(
  allOrderItemsList,
  (orderItems) => sortByCategory(orderItems.filter(item => !item.is_packed))
);

export const viewAll = createSelector(
  allOrderItemsList,
  (orders) => orders.viewAll
);

export const viewUsed = createSelector(
  allOrderItemsList,
  (orders) => orders.viewUsed
);

export const viewNew = createSelector(
  allOrderItemsList,
  (orders) => orders.viewNew
);

export const selectedCatergory = createSelector(
  allOrderItemsList,
  (orders) => orders.selectedCatergory
);

export const storeInventories = createSelector(
  bricklinkStore,
  (bricklinkStore) => bricklinkStore.inventories
);

export const storeInventoryItem = (inventoryId: String) =>
  createSelector(
    [bricklinkStore],
    (bricklinkStore) => bricklinkStore.inventories.find((item: BricklinkInventoryItem) => item.inventory_id === inventoryId)
  );

export const inventoryItem = createSelector(
  itemsToPick,
  storeInventories,
  (itemsToPick, invetoriesItems) => {
    if (itemsToPick.inventoryId && invetoriesItems) {
      const returnvalue = invetoriesItems.find((item: BricklinkInventoryItem) => item.inventory_id == itemsToPick.inventoryId)
      return returnvalue;
    }
    else {
      return null;
    }
  }
);

export const selectedCategoryIds = createSelector(
  categoriesInOrders,
  filters,
  (categoriesInInventories, filterss) => {
    return categoriesInInventories.filter((cat: Category) => {
      return filterss.categories.find((filterCat) => filterCat === cat.category_name);
    }).map(cat => cat.category_id);
  }
);

// export const selectedPartName = createSelector(
//   itemsToPick,
//   filters,
//   (parts, pageFilters) => {
//     if (!parts || parts.length === 0 || !pageFilters.part) {
//       return 'All Parts';
//     }
//     return parts.find((part) => part.no === pageFilters.part)?.name || 'All Parts';
//   }
// );

export const filteredItems = createSelector(
  allOrderItemsList,
  filters,
  (items, filtersTemp) => {
    return items.filter((item: OrderItem) => {
      let matchesOrderId = true;
      let matchesCategory = true;
      let matchesCondition = true;
      let matchesPickedStatus = true;
      let matchesPackedStatus = true;
      let matchesPart = true;
      let matchesColor = true;

      if (filtersTemp.orders && filtersTemp.orders.length > 0) {
        matchesOrderId = filtersTemp.orders.includes(item.order_id);
      }
      if (filtersTemp.categories && filtersTemp.categories.length > 0) {
        matchesCategory = filtersTemp.categories.includes(item.category_name);
      }
      // Filter by new/used status
      if (filtersTemp.condition) {
        matchesCondition = filtersTemp.condition === item.condition;
      }
      if (!filtersTemp.showPicked) {
        matchesPickedStatus = item.total_quantity != item.picked_quantity;
      }
      if (!filtersTemp.showPacked) {
        matchesPackedStatus = !item.is_packed;
      }
      if (filtersTemp.part) {
        console.log('Filtering by part:', filtersTemp.part, item.name);
        console.log('matchesPart', matchesPart);
        matchesPart = item.name.toLowerCase().replace(/\s/g, "").includes(filtersTemp.part.toLowerCase());
      }
      if (filtersTemp.color) {
        console.log('Filtering by color:', filtersTemp.color, item.color_name);
        matchesColor = item.color_name.toLowerCase().includes(filtersTemp.color.toLowerCase());
      }
      return matchesOrderId && matchesCategory && matchesPickedStatus && matchesCondition && matchesPackedStatus && matchesPart && matchesColor;
    });
  }
);
