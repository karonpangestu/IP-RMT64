import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  notifications: [],
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.push(action.payload)
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      )
    },
  },
})

export const { addNotification, removeNotification } = uiSlice.actions

export default uiSlice.reducer
