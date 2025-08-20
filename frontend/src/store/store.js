import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import uiReducer from "./slices/uiSlice"
import episodesReducer from "./slices/episodesSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    episodes: episodesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
})
