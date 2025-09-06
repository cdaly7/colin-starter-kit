import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InventoryState {
    categories?: any[];
    filters: {
        categories: string[],
        part?: string,
        condition?: string,
        color?: string
    }
}

const initialState: InventoryState = {
  categories: [],  
  filters: {
        categories: [],
        part: undefined,
        condition: undefined,
        color: undefined
    }
};

const inventorySlice = createSlice({
  name: "inventorySlice",
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<any[]>) {
      state.categories = action.payload;
    },
    setFilters(
      state, 
      action: PayloadAction<{ categories: string[], part?: string, condition?: string, color?: string }>
    ) {
      state.filters = action.payload;
    }
  },
});

export const { setCategories, setFilters } = inventorySlice.actions;
export default inventorySlice.reducer;