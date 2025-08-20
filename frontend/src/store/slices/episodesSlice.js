import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { episodesAPI } from "../../services/episodesAPI"

// Async thunks
export const fetchEpisodes = createAsyncThunk(
  "episodes/fetchEpisodes",
  async (params, { rejectWithValue }) => {
    try {
      const response = await episodesAPI.getEpisodes(params)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || "Failed to fetch episodes"
      )
    }
  }
)

export const fetchEpisodeById = createAsyncThunk(
  "episodes/fetchEpisodeById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await episodesAPI.getEpisodeById(id)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || "Failed to fetch episode"
      )
    }
  }
)

export const createEpisode = createAsyncThunk(
  "episodes/createEpisode",
  async (episodeData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token")
      if (!token) {
        throw new Error("No token available")
      }
      const response = await episodesAPI.createEpisode(episodeData, token)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || "Failed to create episode"
      )
    }
  }
)

export const updateEpisode = createAsyncThunk(
  "episodes/updateEpisode",
  async ({ id, updateData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token")
      if (!token) {
        throw new Error("No token available")
      }
      const response = await episodesAPI.updateEpisode(id, updateData, token)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || "Failed to update episode"
      )
    }
  }
)

export const deleteEpisode = createAsyncThunk(
  "episodes/deleteEpisode",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token")
      if (!token) {
        throw new Error("No token available")
      }
      await episodesAPI.deleteEpisode(id, token)
      return id
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || "Failed to delete episode"
      )
    }
  }
)

export const getProcessingStatus = createAsyncThunk(
  "episodes/getProcessingStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await episodesAPI.getProcessingStatus(id)
      return { id, ...response.data }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message ||
          "Failed to get processing status"
      )
    }
  }
)

// Initial state
const initialState = {
  episodes: [],
  currentEpisode: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalEpisodes: 0,
    episodesPerPage: 12,
  },
  filters: {
    search: "",
    category: "",
    sourceType: "",
    sortBy: "publishedAt",
    sortOrder: "DESC",
  },
  processingEpisodes: {}, // Track processing status of episodes
}

// Episodes slice
const episodesSlice = createSlice({
  name: "episodes",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
        search: "",
        category: "",
        sourceType: "",
        sortBy: "publishedAt",
        sortOrder: "DESC",
      }
    },
    setCurrentEpisode: (state, action) => {
      state.currentEpisode = action.payload
    },
    clearCurrentEpisode: (state) => {
      state.currentEpisode = null
    },
    updateProcessingStatus: (state, action) => {
      const { id, status, error } = action.payload
      state.processingEpisodes[id] = { status, error }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Episodes
      .addCase(fetchEpisodes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEpisodes.fulfilled, (state, action) => {
        state.loading = false
        state.episodes = action.payload.episodes
        state.pagination = action.payload.pagination
        state.error = null
      })
      .addCase(fetchEpisodes.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch Episode by ID
      .addCase(fetchEpisodeById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEpisodeById.fulfilled, (state, action) => {
        state.loading = false
        state.currentEpisode = action.payload.episode
        state.error = null
      })
      .addCase(fetchEpisodeById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Create Episode
      .addCase(createEpisode.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createEpisode.fulfilled, (state, action) => {
        state.loading = false
        // Add new episode to the beginning of the list
        state.episodes.unshift(action.payload.episode)
        state.pagination.totalEpisodes += 1
        state.error = null

        // Track processing status
        state.processingEpisodes[action.payload.episode.id] = {
          status: "processing",
          error: null,
        }
      })
      .addCase(createEpisode.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Update Episode
      .addCase(updateEpisode.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateEpisode.fulfilled, (state, action) => {
        state.loading = false
        const updatedEpisode = action.payload.episode

        // Update in episodes list
        const index = state.episodes.findIndex(
          (ep) => ep.id === updatedEpisode.id
        )
        if (index !== -1) {
          state.episodes[index] = updatedEpisode
        }

        // Update current episode if it's the same
        if (
          state.currentEpisode &&
          state.currentEpisode.id === updatedEpisode.id
        ) {
          state.currentEpisode = updatedEpisode
        }

        state.error = null
      })
      .addCase(updateEpisode.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Delete Episode
      .addCase(deleteEpisode.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteEpisode.fulfilled, (state, action) => {
        state.loading = false
        const deletedId = action.payload

        // Remove from episodes list
        state.episodes = state.episodes.filter((ep) => ep.id !== deletedId)

        // Clear current episode if it was deleted
        if (state.currentEpisode && state.currentEpisode.id === deletedId) {
          state.currentEpisode = null
        }

        // Remove from processing episodes
        delete state.processingEpisodes[deletedId]

        state.pagination.totalEpisodes -= 1
        state.error = null
      })
      .addCase(deleteEpisode.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Get Processing Status
      .addCase(getProcessingStatus.fulfilled, (state, action) => {
        const { id, processingStatus, processingError } = action.payload
        state.processingEpisodes[id] = {
          status: processingStatus,
          error: processingError,
        }
      })
  },
})

export const {
  clearError,
  setFilters,
  clearFilters,
  setCurrentEpisode,
  clearCurrentEpisode,
  updateProcessingStatus,
} = episodesSlice.actions

// Selectors
export const selectEpisodes = (state) => state.episodes.episodes
export const selectCurrentEpisode = (state) => state.episodes.currentEpisode
export const selectEpisodesLoading = (state) => state.episodes.loading
export const selectEpisodesError = (state) => state.episodes.error
export const selectEpisodesPagination = (state) => state.episodes.pagination
export const selectEpisodesFilters = (state) => state.episodes.filters
export const selectProcessingEpisodes = (state) =>
  state.episodes.processingEpisodes
export const selectEpisodeProcessingStatus = (id) => (state) =>
  state.episodes.processingEpisodes[id] || { status: "unknown", error: null }

export default episodesSlice.reducer
