import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import * as episodesAPI from "../../services/episodesAPI"

// Async thunks
export const fetchEpisodes = createAsyncThunk(
  "episodes/fetchEpisodes",
  async () => {
    const response = await episodesAPI.getAllEpisodes()
    return response.episodes
  }
)

export const fetchEpisodeById = createAsyncThunk(
  "episodes/fetchEpisodeById",
  async (id) => {
    const response = await episodesAPI.getEpisodeById(id)
    return response
  }
)

export const deleteEpisode = createAsyncThunk(
  "episodes/deleteEpisode",
  async (id) => {
    await episodesAPI.deleteEpisode(id)
    return id
  }
)

const initialState = {
  episodes: [],
  currentEpisode: null,
  loading: false,
  error: null,
}

const episodesSlice = createSlice({
  name: "episodes",
  initialState,
  reducers: {
    updateEpisodeInStore: (state, action) => {
      const index = state.episodes.findIndex(
        (episode) => episode.id === action.payload.id
      )
      if (index !== -1) {
        state.episodes[index] = action.payload
      }
      if (
        state.currentEpisode &&
        state.currentEpisode.id === action.payload.id
      ) {
        state.currentEpisode = action.payload
      }
    },
    removeEpisodeFromStore: (state, action) => {
      state.episodes = state.episodes.filter(
        (episode) => episode.id !== action.payload
      )
      if (state.currentEpisode && state.currentEpisode.id === action.payload) {
        state.currentEpisode = null
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch episodes
      .addCase(fetchEpisodes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEpisodes.fulfilled, (state, action) => {
        state.episodes = action.payload
        state.loading = false
      })
      .addCase(fetchEpisodes.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Fetch single episode
      .addCase(fetchEpisodeById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEpisodeById.fulfilled, (state, action) => {
        state.currentEpisode = action.payload
        state.loading = false
      })
      .addCase(fetchEpisodeById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Delete episode
      .addCase(deleteEpisode.fulfilled, (state, action) => {
        state.episodes = state.episodes.filter(
          (episode) => episode.id !== action.payload
        )
        state.currentEpisode = null
      })
  },
})

export const { updateEpisodeInStore, removeEpisodeFromStore } =
  episodesSlice.actions

export default episodesSlice.reducer
