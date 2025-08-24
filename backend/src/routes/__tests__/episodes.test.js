const request = require("supertest")
const app = require("../../server")

describe("Episodes API", () => {
  describe("GET /api/episodes", () => {
    it("should return all episodes", async () => {
      const res = await request(app).get("/api/episodes")
      expect(res.statusCode).toBe(501) // Will be 200 when implemented
    })
  })

  describe("GET /api/episodes/:id", () => {
    it("should return a single episode", async () => {
      const res = await request(app).get("/api/episodes/123")
      expect(res.statusCode).toBe(501) // Will be 200 when implemented
    })
  })
})
