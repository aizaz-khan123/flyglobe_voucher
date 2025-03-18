import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { EndPointsApis } from '../services/EndPointsApis';



const initialState = {
  isLoggedIn: false,
  status: 'idle',
  lastApiCall: undefined,
  token:""
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.expiresAt = action.payload.expiresAt;
      state.userDetail = action.payload;
    },
    setPermissionsState:(state,action)=>{
      state.permissions=action.payload;
    },
    setTheme:(state,action)=>{
      state.theme=action.payload;
    },
    logout: () => initialState,
    setApiData: (state, action) => {
      state.apiData = action.payload;      
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

const persistConfig = {
  key: 'authSlice',
  storage,
};

const persistedReducer = persistReducer(persistConfig, authSlice.reducer);

export const { setUser, setApiData,setPermissionsState, setStatus,logout,setTheme } = authSlice.actions;
export default persistedReducer;
