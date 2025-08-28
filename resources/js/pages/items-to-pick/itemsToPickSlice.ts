import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ItemsToPickState {
    inventoryId?: string,
    inventoryItemModalOpen: boolean
}

const initialState: ItemsToPickState = {
    inventoryId: undefined,
    inventoryItemModalOpen: false
};

const itemsToPickSlice = createSlice({
  name: "itemsToPick",
  initialState,
  reducers: {
    setInventoryItem(state, action: PayloadAction<string>) {
      state.inventoryId = action.payload;
      state.inventoryItemModalOpen = action.payload != null
    }
  },
});

export const { setInventoryItem} = itemsToPickSlice.actions;
export default itemsToPickSlice.reducer;