const express = require("express")
const router = express.Router()
const { Op } = require("sequelize")
const { Podcast } = require("../db")
const auth = require("../middleware/auth")
const validate = require("../middleware/validate")
const { createEpisodeSchema } = require("../validations/episode")
const TranscriptService = require("../services/transcriptService")
const geminiService = require("../services/geminiService")

// GET /episodes/metadata - Get video metadata
router.get("/metadata", async (req, res, next) => {
  try {
    const { url } = req.query
    if (!url) {
      return res.status(400).json({ message: "URL is required" })
    }

    const metadata = await TranscriptService.getVideoMetadata(url)
    res.json(metadata)
  } catch (error) {
    next(error)
  }
})

// GET /episodes - Fetch all episodes with pagination and search
router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = 15 // Episodes per page
    const search = req.query.search || ""

    const offset = (page - 1) * limit

    const { count, rows: episodes } = await Podcast.findAndCountAll({
      where: search
        ? {
            title: {
              [Op.iLike]: `%${search}%`, // Case-insensitive search
            },
          }
        : {},
      order: [["created_at", "DESC"]],
      limit,
      offset,
      include: ["user"], // Include user data
    })

    const totalPages = Math.ceil(count / limit)

    res.json({
      episodes,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        hasMore: page < totalPages,
      },
    })
  } catch (error) {
    next(error)
  }
})

// GET /episodes/:id - Fetch one episode
router.get("/:id", async (req, res, next) => {
  try {
    const episode = await Podcast.findByPk(req.params.id, {
      include: ["user"],
    })

    if (!episode) {
      return res.status(404).json({ message: "Episode not found" })
    }

    res.json(episode)
  } catch (error) {
    next(error)
  }
})

// POST /episodes - Create a new episode
router.post(
  "/",
  auth,
  validate(createEpisodeSchema),
  async (req, res, next) => {
    try {
      // Ensure the authenticated user can only create episodes for themselves
      // if (req.user.id !== req.body.userId) {
      //   return res.status(403).json({ message: "Forbidden" })
      // }

      // Create initial episode record with pending status
      const episode = await Podcast.create({
        ...req.body,
        status: "processing",
        userId: req.user.id,
      })

      // Process the episode asynchronously
      try {
        // Get transcript from YouTube
        const transcript = await TranscriptService.getTranscript(
          req.body.sourceUrl
        )

        // Analyze transcript with Gemini
        const analysis = await geminiService.analyzeTranscript(transcript)

        // Update episode with transcript and analysis
        await episode.update({
          transcript,
          summary: analysis.summary,
          businessIdeas: analysis.businessIdeas,
          frameworks: analysis.frameworks,
          founderStories: analysis.founderStories,
          aiAnalysis: analysis.aiAnalysis,
          status: "completed",
        })
      } catch (error) {
        // Update episode status to failed if processing fails
        console.log(error)
        await episode.update({
          status: "failed",
          aiAnalysis: { error: error.message },
        })
        console.error("Episode processing failed:", error)
      }

      // Fetch the created episode with user data
      const episodeWithUser = await Podcast.findByPk(episode.id, {
        include: ["user"],
      })

      res.status(201).json(episodeWithUser)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
)

// DELETE /episodes/:id - Delete an episode
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const episode = await Podcast.findByPk(req.params.id)

    if (!episode) {
      return res.status(404).json({ message: "Episode not found" })
    }

    // Ensure users can only delete their own episodes
    if (episode.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" })
    }

    await episode.destroy()
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router
