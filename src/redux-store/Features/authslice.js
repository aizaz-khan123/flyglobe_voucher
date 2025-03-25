import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  token: null,
  userDetail: null,
  connectors: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loggedIn: (state, action) => {
      state.isLoggedIn = true;
      state.token = action.payload.userDetail.token;
      state.userDetail = action.payload.userDetail.user;
    },
    connectors: (state, action) => {
      state.connectors = action.payload?.connectors || [];
    },       
    userLogout: (state) => {
      state.isLoggedIn = false;
      state.userDetail = null;
      state.connectors = null;
      state.token = null;
    },
  },
});

export const { loggedIn, connectors, userLogout } = authSlice.actions;
export default authSlice.reducer;
