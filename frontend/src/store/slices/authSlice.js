import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import * as authAPI from "../../services/authAPI"

// Async thunk to restore auth state from stored token
export const restoreAuthState = createAsyncThunk(
  "auth/restoreAuthState",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No token found")
      }

      const response = await authAPI.verifyToken(token)
      return response.user
    } catch (error) {
      // Remove invalid token
      localStorage.removeItem("token")
      throw error
    }
  }
)

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  isRestoring: false, // New state for auth restoration
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true
      state.user = action.payload
      state.loading = false
      state.error = null
    },
    loginFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreAuthState.pending, (state) => {
        state.isRestoring = true
        state.error = null
      })
      .addCase(restoreAuthState.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.user = action.payload
        state.isRestoring = false
        state.error = null
      })
      .addCase(restoreAuthState.rejected, (state, action) => {
        state.isAuthenticated = false
        state.user = null
        state.isRestoring = false
        state.error = action.error.message
      })
  },
})

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions

export default authSlice.reducer
