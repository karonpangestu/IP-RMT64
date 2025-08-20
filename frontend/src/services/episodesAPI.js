import api from "./authAPI"

// Episodes API methods
export const episodesAPI = {
  // Get all episodes with optional filters
  getEpisodes: async (params = {}) => {
    const queryParams = new URLSearchParams()

    if (params.page) queryParams.append("page", params.page)
    if (params.limit) queryParams.append("limit", params.limit)
    if (params.search) queryParams.append("search", params.search)
    if (params.category) queryParams.append("category", params.category)
    if (params.sourceType) queryParams.append("sourceType", params.sourceType)
    if (params.sortBy) queryParams.append("sortBy", params.sortBy)
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder)

    const queryString = queryParams.toString()
    const url = queryString ? `/episodes?${queryString}` : "/episodes"

    return await api.get(url)
  },

  // Get episode by ID
  getEpisodeById: async (id) => {
    return await api.get(`/episodes/${id}`)
  },

  // Create new episode
  createEpisode: async (episodeData, token) => {
    return await api.post("/episodes", episodeData, {
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  // Update episode
  updateEpisode: async (id, updateData, token) => {
    return await api.put(`/episodes/${id}`, updateData, {
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  // Delete episode
  deleteEpisode: async (id, token) => {
    return await api.delete(`/episodes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  // Get episode processing status
  getProcessingStatus: async (id) => {
    return await api.get(`/episodes/${id}/processing-status`)
  },
}

export default episodesAPI
