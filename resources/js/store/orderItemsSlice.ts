import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderItemsState {
  items: any[];
  viewAll: boolean;
  selectedCatergory?: string;
  viewUsed: boolean;
  viewNew: boolean;
  filters: {
    order?: string;
    category?: string;
    condition?: string;
    packed: boolean;
    picked: boolean;
  }
}

const initialState: OrderItemsState = {
  items: [],
  viewAll: true,
  selectedCatergory: undefined,
  viewUsed: true,
  viewNew: true,
  filters: {
    order: undefined,
    category: undefined,
    condition: undefined,
    packed: true,
    picked: true
  }
};

const orderItemsSlice = createSlice({
  name: "orderItems",
  initialState,
  reducers: {
    setOrderItems(state, action: PayloadAction<any[]>) {
      state.items = action.payload;
    },
    updateOrderItem(state, action: PayloadAction<any[]>) {
      const index = state.items.findIndex(item => item.id === action.payload.id)
      state.items[index] = action.payload;
    },
    setViewAll(state, action: PayloadAction<boolean>) {
      state.viewAll = action.payload;
    },
    setSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCatergory = action.payload;
    },
    setViewUsed(state, action: PayloadAction<boolean>) {
      state.viewUsed = action.payload;
    },
    setViewNew(state, action: PayloadAction<boolean>) {
      state.viewNew = action.payload;
    },
    setFilteredOrder(state, action: PayloadAction<string>) {
      state.filters.order = action.payload;
    },
  },
});



export const {
  setOrderItems,
  updateOrderItem,
  setViewAll,
  setSelectedCategory,
  setViewNew,
  setViewUsed,
  setFilteredOrder
} = orderItemsSlice.actions;
export default orderItemsSlice.reducer;