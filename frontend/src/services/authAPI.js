import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear it
      localStorage.removeItem('token')
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth API methods
export const authAPI = {
  // Register a new user
  register: async (userData) => {
    return await api.post('/auth/register', userData)
  },

  // Login user
  login: async (credentials) => {
    return await api.post('/auth/login', credentials)
  },

  // Get current user profile
  getProfile: async (token) => {
    return await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
  },

  // Update user profile
  updateProfile: async (profileData, token) => {
    return await api.put('/auth/profile', profileData, {
      headers: { Authorization: `Bearer ${token}` }
    })
  },

  // Health check
  healthCheck: async () => {
    return await api.get('/health')
  }
}

// Users API methods
export const usersAPI = {
  // Get all users (admin only)
  getAllUsers: async (params = {}) => {
    return await api.get('/users', { params })
  },

  // Get user by ID
  getUserById: async (id) => {
    return await api.get(`/users/${id}`)
  },

  // Update user by ID
  updateUser: async (id, userData) => {
    return await api.put(`/users/${id}`, userData)
  },

  // Delete user by ID (admin only)
  deleteUser: async (id) => {
    return await api.delete(`/users/${id}`)
  }
}

export default api
