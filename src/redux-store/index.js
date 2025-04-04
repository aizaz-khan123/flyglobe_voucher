import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
 persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { combineReducers } from "redux";

import { api } from "./services/api";
import authReducer from "./Features/authslice"; // ✅ Import the reducer, not the slice

// Persist Config
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

// Combine Reducers
const rootReducer = combineReducers({
  auth: authReducer, // ✅ Ensure correct key and reducer
  [api.reducerPath]: api.reducer, // ✅ Include API reducer here
});

// Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store Configuration
export const store = configureStore({
  reducer: persistedReducer, // ✅ Use persistedReducer directly
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

// Persistor
export const persistor = persistStore(store);
