import axios from "axios"

const API_URL = "/api/auth"

// Add auth token to requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData)
  if (response.data.token) {
    localStorage.setItem("token", response.data.token)
  }
  return response.data
}

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials)
  if (response.data.token) {
    localStorage.setItem("token", response.data.token)
  }
  return response.data
}

export const loginWithGoogle = async (credential) => {
  const response = await axios.post(`${API_URL}/google`, { credential })
  if (response.data.token) {
    localStorage.setItem("token", response.data.token)
  }
  return response.data
}

export const verifyToken = async (token) => {
  const response = await axios.post(`${API_URL}/verify`, { token })
  return response.data
}

export const logout = () => {
  localStorage.removeItem("token")
}

export const signOut = () => {
  localStorage.removeItem("token")
}
