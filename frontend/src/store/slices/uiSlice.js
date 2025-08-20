import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarOpen: false,
  theme: 'light',
  notifications: [],
  loadingStates: {},
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    setTheme: (state, action) => {
      state.theme = action.payload
      // Store theme preference in localStorage
      localStorage.setItem('theme', action.payload)
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      })
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      )
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
    setLoadingState: (state, action) => {
      const { key, isLoading } = action.payload
      state.loadingStates[key] = isLoading
    },
    clearLoadingStates: (state) => {
      state.loadingStates = {}
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  setLoadingState,
  clearLoadingStates,
} = uiSlice.actions

// Selectors
export const selectUI = (state) => state.ui
export const selectSidebarOpen = (state) => state.ui.sidebarOpen
export const selectTheme = (state) => state.ui.theme
export const selectNotifications = (state) => state.ui.notifications
export const selectLoadingStates = (state) => state.ui.loadingStates
export const selectIsLoading = (key) => (state) => state.ui.loadingStates[key] || false

export default uiSlice.reducer
