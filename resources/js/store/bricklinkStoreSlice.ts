import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BrickLinkStoreState {
  inventories: any[];
}

const initialState: BrickLinkStoreState = {
  inventories: [],
};

const bricklinkStoreSlice = createSlice({
  name: "bricklinkStore",
  initialState,
  reducers: {
    setInventories(state, action: PayloadAction<any[]>) {
      state.inventories = action.payload;
    }
  },
});



export const { setInventories} = bricklinkStoreSlice.actions;
export default bricklinkStoreSlice.reducer;