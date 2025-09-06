import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "@/types";

interface ItemsToPickState {
    categories: Category[],
    filters: {
        orderIds?: string[],
        part?: string,
        categories?: string[],
        condition?: string,
        color?: string,
        showPacked?: boolean,
        showPicked?: boolean
    },
    
    inventoryId?: string,
    inventoryItemModalOpen: boolean
}

const initialState: ItemsToPickState = {
    categories: [],
    filters: {
        orderIds: [],
        part: undefined,
        categories: [],
        condition: undefined,
        color: undefined,
        showPacked: true,
        showPicked: true
    },
    inventoryId: undefined,
    inventoryItemModalOpen: false
};

const itemsToPickSlice = createSlice({
  name: "itemsToPick",
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
    },
    setFilters(state, action: PayloadAction<Partial<ItemsToPickState>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setInventoryItem(state, action: PayloadAction<string>) {
      state.inventoryId = action.payload;
      state.inventoryItemModalOpen = action.payload != null
    }
  },
});

export const { setCategories, setFilters, setInventoryItem} = itemsToPickSlice.actions;
export default itemsToPickSlice.reducer;