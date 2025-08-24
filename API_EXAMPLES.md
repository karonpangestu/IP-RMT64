# API Examples & Usage Guide

## Quick Start Examples

### 1. User Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**JavaScript/Fetch:**

```javascript
const response = await fetch("http://localhost:3000/api/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    username: "john_doe",
    email: "john@example.com",
    password: "securepassword123",
  }),
})

const data = await response.json()
console.log("Token:", data.token)
```

### 2. User Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**JavaScript/Fetch:**

```javascript
const response = await fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "john@example.com",
    password: "securepassword123",
  }),
})

const data = await response.json()
localStorage.setItem("token", data.token)
```

### 3. Create Episode (with Authentication)

```bash
curl -X POST http://localhost:3000/api/episodes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "How to Build a Startup",
    "sourceUrl": "https://www.youtube.com/watch?v=example",
    "description": "Learn the fundamentals of building a successful startup"
  }'
```

**JavaScript/Fetch:**

```javascript
const token = localStorage.getItem("token")

const response = await fetch("http://localhost:3000/api/episodes", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: "How to Build a Startup",
    sourceUrl: "https://www.youtube.com/watch?v=example",
    description: "Learn the fundamentals of building a successful startup",
  }),
})

const episode = await response.json()
console.log("Episode created:", episode)
```

### 4. Get All Episodes

```bash
curl -X GET "http://localhost:3000/api/episodes?page=1&search=business" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**JavaScript/Fetch:**

```javascript
const token = localStorage.getItem("token")

const response = await fetch(
  "http://localhost:3000/api/episodes?page=1&search=business",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
)

const data = await response.json()
console.log("Episodes:", data.episodes)
console.log("Pagination:", data.pagination)
```

### 5. Get Episode by ID

```bash
curl -X GET http://localhost:3000/api/episodes/EPISODE_UUID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**JavaScript/Fetch:**

```javascript
const token = localStorage.getItem("token")
const episodeId = "your-episode-uuid"

const response = await fetch(
  `http://localhost:3000/api/episodes/${episodeId}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
)

const episode = await response.json()
console.log("Episode details:", episode)
```

### 6. Update Episode Title

```bash
curl -X PUT http://localhost:3000/api/episodes/EPISODE_UUID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Updated Episode Title"
  }'
```

**JavaScript/Fetch:**

```javascript
const token = localStorage.getItem("token")
const episodeId = "your-episode-uuid"

const response = await fetch(
  `http://localhost:3000/api/episodes/${episodeId}`,
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: "Updated Episode Title",
    }),
  }
)

const updatedEpisode = await response.json()
console.log("Updated episode:", updatedEpisode)
```

### 7. Delete Episode

```bash
curl -X DELETE http://localhost:3000/api/episodes/EPISODE_UUID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**JavaScript/Fetch:**

```javascript
const token = localStorage.getItem("token")
const episodeId = "your-episode-uuid"

const response = await fetch(
  `http://localhost:3000/api/episodes/${episodeId}`,
  {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
)

if (response.status === 204) {
  console.log("Episode deleted successfully")
}
```

### 8. Get Video Metadata (No Auth Required)

```bash
curl -X GET "http://localhost:3000/api/episodes/metadata?url=https://www.youtube.com/watch?v=example"
```

**JavaScript/Fetch:**

```javascript
const response = await fetch(
  "http://localhost:3000/api/episodes/metadata?url=https://www.youtube.com/watch?v=example"
)

const metadata = await response.json()
console.log("Video metadata:", metadata)
```

## Frontend Integration Examples

### React Hook for API Calls

```javascript
import { useState, useEffect } from "react"

const useApi = (url, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")

        const response = await fetch(url, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
            ...options.headers,
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, loading, error }
}

// Usage
const { data: episodes, loading, error } = useApi("/api/episodes")
```

### Authentication Context

```javascript
import React, { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))

  const login = async (email, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) throw new Error("Login failed")

      const data = await response.json()
      setToken(data.token)
      setUser(data.user)
      localStorage.setItem("token", data.token)
      return data
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("token")
  }

  const verifyToken = async () => {
    if (!token) return

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        logout()
      }
    } catch (error) {
      logout()
    }
  }

  useEffect(() => {
    verifyToken()
  }, [token])

  return (
    <AuthContext.Provider value={{ user, token, login, logout, verifyToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

### Episode Service

```javascript
class EpisodeService {
  constructor() {
    this.baseUrl = "/api/episodes"
    this.token = localStorage.getItem("token")
  }

  getHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.token}`,
    }
  }

  async getAllEpisodes(page = 1, search = "") {
    const params = new URLSearchParams({ page, search })
    const response = await fetch(`${this.baseUrl}?${params}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) throw new Error("Failed to fetch episodes")
    return response.json()
  }

  async getEpisode(id) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) throw new Error("Episode not found")
    return response.json()
  }

  async createEpisode(episodeData) {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(episodeData),
    })

    if (!response.ok) throw new Error("Failed to create episode")
    return response.json()
  }

  async updateEpisode(id, title) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify({ title }),
    })

    if (!response.ok) throw new Error("Failed to update episode")
    return response.json()
  }

  async deleteEpisode(id) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    })

    if (!response.ok) throw new Error("Failed to delete episode")
    return response.status === 204
  }

  async getVideoMetadata(url) {
    const params = new URLSearchParams({ url })
    const response = await fetch(`${this.baseUrl}/metadata?${params}`)

    if (!response.ok) throw new Error("Failed to get video metadata")
    return response.json()
  }
}

export default new EpisodeService()
```

## Error Handling Examples

### Global Error Handler

```javascript
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response

    switch (status) {
      case 400:
        return `Validation error: ${data.message}`
      case 401:
        // Redirect to login
        window.location.href = "/login"
        return "Please log in to continue"
      case 403:
        return "You do not have permission to perform this action"
      case 404:
        return "Resource not found"
      case 500:
        return "Server error. Please try again later"
      default:
        return data.message || "An unexpected error occurred"
    }
  } else if (error.request) {
    // Network error
    return "Network error. Please check your connection"
  } else {
    // Other error
    return error.message || "An unexpected error occurred"
  }
}
```

### Retry Logic for Failed Requests

```javascript
const retryRequest = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error

      // Wait before retrying
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, i))
      )
    }
  }
}

// Usage
const createEpisodeWithRetry = (episodeData) => {
  return retryRequest(() => episodeService.createEpisode(episodeData))
}
```

## Testing Examples

### API Testing with Jest

```javascript
import request from "supertest"
import app from "../server"

describe("Auth API", () => {
  test("POST /auth/register - should create new user", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("token")
    expect(response.body.user).toHaveProperty("id")
    expect(response.body.user.email).toBe("test@example.com")
  })

  test("POST /auth/login - should authenticate user", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("token")
  })
})

describe("Episodes API", () => {
  let authToken
  let episodeId

  beforeAll(async () => {
    // Login to get token
    const response = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    })
    authToken = response.body.token
  })

  test("POST /episodes - should create new episode", async () => {
    const response = await request(app)
      .post("/api/episodes")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Test Episode",
        sourceUrl: "https://www.youtube.com/watch?v=test",
        description: "Test description",
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id")
    episodeId = response.body.id
  })

  test("GET /episodes/:id - should get episode by id", async () => {
    const response = await request(app)
      .get(`/api/episodes/${episodeId}`)
      .set("Authorization", `Bearer ${authToken}`)

    expect(response.status).toBe(200)
    expect(response.body.id).toBe(episodeId)
  })
})
```

## Performance Optimization Tips

### 1. Implement Caching

```javascript
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

const getCachedData = (key) => {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  return null
}

const setCachedData = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() })
}

// Usage in API calls
const getEpisodesWithCache = async (page, search) => {
  const cacheKey = `episodes_${page}_${search}`
  const cached = getCachedData(cacheKey)

  if (cached) return cached

  const data = await episodeService.getAllEpisodes(page, search)
  setCachedData(cacheKey, data)
  return data
}
```

### 2. Implement Pagination with Infinite Scroll

```javascript
const useInfiniteEpisodes = (search = "") => {
  const [episodes, setEpisodes] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const loadMore = async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const data = await episodeService.getAllEpisodes(page, search)

      if (page === 1) {
        setEpisodes(data.episodes)
      } else {
        setEpisodes((prev) => [...prev, ...data.episodes])
      }

      setHasMore(data.pagination.hasMore)
      setPage((prev) => prev + 1)
    } catch (error) {
      console.error("Failed to load episodes:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
    setHasMore(true)
    setEpisodes([])
    loadMore()
  }, [search])

  return { episodes, loading, hasMore, loadMore }
}
```

This comprehensive examples guide should help developers integrate with your API effectively!


