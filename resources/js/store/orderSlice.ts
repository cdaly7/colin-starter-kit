import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderState {
  items: any[]
}

const initialState: OrderState = {
  items: []
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<any[]>) {
      state.items = action.payload;
    },
    setOrderItem(state, action: PayloadAction<any[]>) {
      for (const order of state.items) {
        const index = order.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          order.items[index] = action.payload;
        }
      }
    },
  },
});



export const { setOrders, setOrderItem, setViewAll, setSelectedCategory, setViewNew, setViewUsed} = orderSlice.actions;
export default orderSlice.reducer;