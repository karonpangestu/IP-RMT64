import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import episodesReducer from "./slices/episodesSlice"
import uiReducer from "./slices/uiSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    episodes: episodesReducer,
    ui: uiReducer,
  },
})
