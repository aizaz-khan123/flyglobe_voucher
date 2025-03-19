import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist/es/constants";
import authReducer from "./Features/authslice";  
import commonReducer from "./Features/commonSlice";  
import { EndPointsApis } from "./services/EndPointsApis";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "common"],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    common: commonReducer,
    [EndPointsApis.reducerPath]: EndPointsApis.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(EndPointsApis.middleware),
});

export const persistor = persistStore(store);
