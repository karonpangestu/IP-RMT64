import axios from "axios"

const API_URL = "/api/episodes"

// Add auth token to requests
// Only add auth token for protected endpoints
const addAuthToken = (config) => {
  // Skip auth for GET requests
  if (config.method === "get") return config

  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

axios.interceptors.request.use(addAuthToken)

export const getAllEpisodes = async () => {
  const response = await axios.get(API_URL)
  return response.data
}

export const getEpisodeById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`)
  return response.data
}

export const createEpisode = async (episodeData) => {
  const response = await axios.post(API_URL, episodeData)
  return response.data
}

export const deleteEpisode = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`)
  return response.data
}

export const getVideoMetadata = async (url) => {
  const response = await axios.get(
    `${API_URL}/metadata?url=${encodeURIComponent(url)}`
  )
  return response.data
}
