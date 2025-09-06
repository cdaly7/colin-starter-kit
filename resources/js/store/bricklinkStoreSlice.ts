import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BrickLinkStoreState {
  inventories: any[];
}

const defaultInventories: any[] = [];
const initialState: BrickLinkStoreState = {
  inventories: defaultInventories,
};

const bricklinkStoreSlice = createSlice({
  name: "bricklinkStore",
  initialState,
  reducers: {
    setInventories(state, action: PayloadAction<any[]>) {
      state.inventories = action.payload ? action.payload : defaultInventories;
    }
  },
});



export const { setInventories} = bricklinkStoreSlice.actions;
export default bricklinkStoreSlice.reducer;