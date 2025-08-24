// Mock for youtube-transcript-plus module
class InMemoryCache {
  constructor(ttl) {
    this.cache = new Map()
    this.ttl = ttl
  }

  get(key) {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + this.ttl,
    })
  }
}

const fetchTranscript = jest.fn().mockResolvedValue([
  {
    text: "This is a mock transcript",
    duration: 1000,
    offset: 0,
  },
])

module.exports = {
  fetchTranscript,
  InMemoryCache,
}
