import { configureStore } from "@reduxjs/toolkit";
import bricklinkStoreReducer from './bricklinkStoreSlice';
import categoryReducer from './categorySlice';
import orderReducer from './orderSlice';
import orderItemsReducer from './orderItemsSlice';
import itemsToPickReducer from '../pages/items-to-pick/itemsToPickSlice';
import inventoryReducer from '../pages/foo/inventorySlice';

export const store = configureStore({
  reducer: {
    bricklinkStore: bricklinkStoreReducer,
    categories: categoryReducer,
    inventory: inventoryReducer,
    itemsToPick: itemsToPickReducer,
    orders: orderReducer,
    orderItems: orderItemsReducer
  },
});

// Types for use in your app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;