import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CatergoryState {
  data: any[];
}

const initialState: CatergoryState = {
  data: [],
};

const categorySlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setCatergories(state, action: PayloadAction<any[]>) {
      state.data = action.payload;
    }
  },
});



export const { setCatergories} = categorySlice.actions;
export default categorySlice.reducer;