const request = require('supertest')
const app = require('../../server')
const { sequelize } = require('../../config/database')
const Episode = require('../../models/Episode')

// Mock the transcript service
jest.mock('../../services/transcriptService', () => ({
  processEpisode: jest.fn()
}))

describe('Episodes API', () => {
  beforeAll(async () => {
    // Connect to test database
    await sequelize.authenticate()
  })

  beforeEach(async () => {
    // Clear database before each test
    await Episode.destroy({ where: {} })
  })

  afterAll(async () => {
    // Close database connection
    await sequelize.close()
  })

  describe('GET /api/episodes', () => {
    test('should return empty episodes list when no episodes exist', async () => {
      const response = await request(app)
        .get('/api/episodes')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.episodes).toEqual([])
      expect(response.body.data.pagination.totalEpisodes).toBe(0)
    })

    test('should return episodes with pagination', async () => {
      // Create test episodes
      await Episode.bulkCreate([
        {
          title: 'Episode 1',
          sourceUrl: 'https://youtube.com/watch?v=1',
          sourceType: 'youtube',
          isPublished: true
        },
        {
          title: 'Episode 2',
          sourceUrl: 'https://youtube.com/watch?v=2',
          sourceType: 'youtube',
          isPublished: true
        }
      ])

      const response = await request(app)
        .get('/api/episodes?page=1&limit=1')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.episodes).toHaveLength(1)
      expect(response.body.data.pagination.totalEpisodes).toBe(2)
      expect(response.body.data.pagination.currentPage).toBe(1)
      expect(response.body.data.pagination.episodesPerPage).toBe(1)
    })

    test('should filter episodes by search term', async () => {
      await Episode.bulkCreate([
        {
          title: 'Business Strategy Episode',
          sourceUrl: 'https://youtube.com/watch?v=1',
          sourceType: 'youtube',
          isPublished: true
        },
        {
          title: 'Marketing Tips Episode',
          sourceUrl: 'https://youtube.com/watch?v=2',
          sourceType: 'youtube',
          isPublished: true
        }
      ])

      const response = await request(app)
        .get('/api/episodes?search=Business')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.episodes).toHaveLength(1)
      expect(response.body.data.episodes[0].title).toBe('Business Strategy Episode')
    })

    test('should filter episodes by category', async () => {
      await Episode.bulkCreate([
        {
          title: 'Episode 1',
          sourceUrl: 'https://youtube.com/watch?v=1',
          sourceType: 'youtube',
          category: 'Business Strategy',
          isPublished: true
        },
        {
          title: 'Episode 2',
          sourceUrl: 'https://youtube.com/watch?v=2',
          sourceType: 'youtube',
          category: 'Marketing',
          isPublished: true
        }
      ])

      const response = await request(app)
        .get('/api/episodes?category=Business Strategy')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.episodes).toHaveLength(1)
      expect(response.body.data.episodes[0].category).toBe('Business Strategy')
    })

    test('should filter episodes by source type', async () => {
      await Episode.bulkCreate([
        {
          title: 'Episode 1',
          sourceUrl: 'https://youtube.com/watch?v=1',
          sourceType: 'youtube',
          isPublished: true
        },
        {
          title: 'Episode 2',
          sourceUrl: 'https://spotify.com/episode/2',
          sourceType: 'spotify',
          isPublished: true
        }
      ])

      const response = await request(app)
        .get('/api/episodes?sourceType=youtube')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.episodes).toHaveLength(1)
      expect(response.body.data.episodes[0].sourceType).toBe('youtube')
    })
  })

  describe('GET /api/episodes/:id', () => {
    test('should return episode by ID', async () => {
      const episode = await Episode.create({
        title: 'Test Episode',
        sourceUrl: 'https://youtube.com/watch?v=test',
        sourceType: 'youtube',
        isPublished: true
      })

      const response = await request(app)
        .get(`/api/episodes/${episode.id}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.episode.id).toBe(episode.id)
      expect(response.body.data.episode.title).toBe('Test Episode')
    })

    test('should return 404 for non-existent episode', async () => {
      const response = await request(app)
        .get('/api/episodes/non-existent-id')
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.error.message).toBe('Episode not found')
    })

    test('should return 404 for unpublished episode', async () => {
      const episode = await Episode.create({
        title: 'Unpublished Episode',
        sourceUrl: 'https://youtube.com/watch?v=test',
        sourceType: 'youtube',
        isPublished: false
      })

      const response = await request(app)
        .get(`/api/episodes/${episode.id}`)
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.error.message).toBe('Episode not found')
    })

    test('should increment view count', async () => {
      const episode = await Episode.create({
        title: 'Test Episode',
        sourceUrl: 'https://youtube.com/watch?v=test',
        sourceType: 'youtube',
        isPublished: true,
        viewCount: 0
      })

      await request(app)
        .get(`/api/episodes/${episode.id}`)
        .expect(200)

      // Check if view count was incremented
      const updatedEpisode = await Episode.findByPk(episode.id)
      expect(updatedEpisode.viewCount).toBe(1)
    })
  })

  describe('POST /api/episodes', () => {
    test('should create new episode with valid data', async () => {
      const episodeData = {
        sourceUrl: 'https://youtube.com/watch?v=new',
        sourceType: 'youtube',
        title: 'New Episode',
        category: 'Business Strategy'
      }

      const response = await request(app)
        .post('/api/episodes')
        .send(episodeData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.episode.title).toBe('New Episode')
      expect(response.body.data.episode.processingStatus).toBe('processing')
    })

    test('should return 400 for invalid source URL', async () => {
      const episodeData = {
        sourceUrl: 'invalid-url',
        sourceType: 'youtube'
      }

      const response = await request(app)
        .post('/api/episodes')
        .send(episodeData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error.message).toContain('valid source URL')
    })

    test('should return 400 for invalid source type', async () => {
      const episodeData = {
        sourceUrl: 'https://youtube.com/watch?v=test',
        sourceType: 'invalid-type'
      }

      const response = await request(app)
        .post('/api/episodes')
        .send(episodeData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error.message).toContain('Invalid source type')
    })
  })

  describe('PUT /api/episodes/:id', () => {
    test('should update episode with valid data', async () => {
      const episode = await Episode.create({
        title: 'Original Title',
        sourceUrl: 'https://youtube.com/watch?v=test',
        sourceType: 'youtube',
        isPublished: true
      })

      const updateData = {
        title: 'Updated Title',
        category: 'Marketing'
      }

      const response = await request(app)
        .put(`/api/episodes/${episode.id}`)
        .send(updateData)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.episode.title).toBe('Updated Title')
      expect(response.body.data.episode.category).toBe('Marketing')
    })

    test('should return 404 for non-existent episode', async () => {
      const response = await request(app)
        .put('/api/episodes/non-existent-id')
        .send({ title: 'Updated Title' })
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.error.message).toBe('Episode not found')
    })
  })

  describe('DELETE /api/episodes/:id', () => {
    test('should delete episode', async () => {
      const episode = await Episode.create({
        title: 'Episode to Delete',
        sourceUrl: 'https://youtube.com/watch?v=test',
        sourceType: 'youtube',
        isPublished: true
      })

      const response = await request(app)
        .delete(`/api/episodes/${episode.id}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.message).toBe('Episode deleted successfully')

      // Verify episode was deleted
      const deletedEpisode = await Episode.findByPk(episode.id)
      expect(deletedEpisode).toBeNull()
    })

    test('should return 404 for non-existent episode', async () => {
      const response = await request(app)
        .delete('/api/episodes/non-existent-id')
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.error.message).toBe('Episode not found')
    })
  })

  describe('GET /api/episodes/:id/processing-status', () => {
    test('should return processing status', async () => {
      const episode = await Episode.create({
        title: 'Test Episode',
        sourceUrl: 'https://youtube.com/watch?v=test',
        sourceType: 'youtube',
        isPublished: true,
        processingStatus: 'completed'
      })

      const response = await request(app)
        .get(`/api/episodes/${episode.id}/processing-status`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.processingStatus).toBe('completed')
    })

    test('should return 404 for non-existent episode', async () => {
      const response = await request(app)
        .get('/api/episodes/non-existent-id/processing-status')
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.error.message).toBe('Episode not found')
    })
  })
})
