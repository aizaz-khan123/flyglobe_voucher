import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState = {
  darkMode: false,
};


const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setContactsData: (state, action) => {
      state.selectedContactData = action.payload;
    },
  },
});


export const {
  setContactsData,
} = commonSlice.actions;

export default commonSlice.reducer;
