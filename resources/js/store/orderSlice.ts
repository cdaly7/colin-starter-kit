import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderState {
  items: any[];
  viewAll: boolean;
  selectedCatergory?: string;
  viewUsed: boolean;
  viewNew: boolean;
}

const initialState: OrderState = {
  items: [],
  viewAll: true,
  selectedCatergory: undefined,
  viewUsed: true,
  viewNew: true,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<any[]>) {
      state.items = action.payload;
    },
    setOrderItem(state, action: PayloadAction<any[]>) {
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
  },
});



export const { setOrders, setOrderItem, setViewAll, setSelectedCategory, setViewNew, setViewUsed} = orderSlice.actions;
export default orderSlice.reducer;