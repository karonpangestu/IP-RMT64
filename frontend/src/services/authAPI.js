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

export const loginWithGoogle = async (token) => {
  const response = await axios.post(`${API_URL}/google`, { token })
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

// Initialize Google OAuth
export const initializeGoogleAuth = () => {
  return new Promise((resolve) => {
    window.gapi.load("auth2", () => {
      window.gapi.auth2
        .init({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        })
        .then(resolve)
    })
  })
}

// Get Google Auth instance
export const getGoogleAuth = () => {
  return window.gapi.auth2.getAuthInstance()
}

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const googleAuth = getGoogleAuth()
    const googleUser = await googleAuth.signIn()
    const token = googleUser.getAuthResponse().id_token
    return await loginWithGoogle(token)
  } catch (error) {
    throw error
  }
}

// Sign out
export const signOut = async () => {
  const googleAuth = getGoogleAuth()
  await googleAuth.signOut()
  logout()
}
