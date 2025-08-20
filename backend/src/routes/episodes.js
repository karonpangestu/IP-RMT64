const express = require('express');
const { body, validationResult } = require('express-validator');
const Episode = require('../models/Episode');
const { auth, authorize } = require('../middleware/auth');
const transcriptService = require('../services/transcriptService');

const router = express.Router();

// @route   GET /api/episodes
// @desc    Get all published episodes with pagination and search
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      search, 
      category, 
      sourceType,
      sortBy = 'publishedAt',
      sortOrder = 'DESC'
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build where clause
    const whereClause = { isPublished: true };
    
    if (search) {
      whereClause[require('sequelize').Op.or] = [
        { title: { [require('sequelize').Op.iLike]: `%${search}%` } },
        { description: { [require('sequelize').Op.iLike]: `%${search}%` } },
        { tags: { [require('sequelize').Op.overlap]: [search] } }
      ];
    }
    
    if (category) {
      whereClause.category = category;
    }
    
    if (sourceType) {
      whereClause.sourceType = sourceType;
    }

    // Build order clause
    const orderClause = [[sortBy, sortOrder.toUpperCase()]];
    if (sortBy === 'publishedAt') {
      orderClause.push(['createdAt', 'DESC']); // Secondary sort by creation date
    }

    const { count, rows: episodes } = await Episode.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: orderClause,
      attributes: [
        'id', 'title', 'description', 'sourceUrl', 'sourceType', 
        'duration', 'publishedAt', 'thumbnail', 'transcriptSummary',
        'businessIdeas', 'frameworks', 'timelessInsights', 'founderStories',
        'tags', 'category', 'viewCount', 'createdAt'
      ]
    });

    // Process episodes to add formatted data
    const processedEpisodes = episodes.map(episode => {
      const episodeData = episode.toJSON();
      episodeData.formattedDuration = episode.getFormattedDuration();
      episodeData.excerpt = episode.getExcerpt();
      episodeData.businessIdeasCount = episode.businessIdeas?.length || 0;
      episodeData.frameworksCount = episode.frameworks?.length || 0;
      episodeData.insightsCount = episode.timelessInsights?.length || 0;
      episodeData.storiesCount = episode.founderStories?.length || 0;
      return episodeData;
    });

    res.json({
      success: true,
      data: {
        episodes: processedEpisodes,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalEpisodes: count,
          episodesPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get episodes error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while fetching episodes' }
    });
  }
});

// @route   GET /api/episodes/:id
// @desc    Get episode by ID and increment view count
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const episode = await Episode.findByPk(id);
    
    if (!episode || !episode.isPublished) {
      return res.status(404).json({
        success: false,
        error: { message: 'Episode not found' }
      });
    }

    // Increment view count
    await episode.incrementViewCount();

    const episodeData = episode.toJSON();
    episodeData.formattedDuration = episode.getFormattedDuration();

    res.json({
      success: true,
      data: { episode: episodeData }
    });
  } catch (error) {
    console.error('Get episode error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while fetching episode' }
    });
  }
});

// @route   POST /api/episodes
// @desc    Create a new episode and process transcript
// @access  Private (Admin only)
router.post('/', auth, authorize('admin'), [
  body('sourceUrl')
    .isURL()
    .withMessage('Please provide a valid source URL'),
  body('sourceType')
    .isIn(['youtube', 'spotify', 'apple', 'other'])
    .withMessage('Invalid source type'),
  body('title')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Title must be less than 255 characters'),
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
  body('category')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Category must be less than 100 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: errors.array()[0].msg }
      });
    }

    const { 
      sourceUrl, 
      sourceType, 
      title, 
      description, 
      category, 
      tags = [] 
    } = req.body;

    // Create episode with initial data
    const episode = await Episode.create({
      sourceUrl,
      sourceType,
      title: title || 'Processing...',
      description: description || '',
      category,
      tags,
      processingStatus: 'processing'
    });

    // Process transcript asynchronously
    transcriptService.processEpisode(sourceUrl, sourceType)
      .then(async (processedData) => {
        try {
          await episode.update({
            title: processedData.metadata.title || title || 'Untitled Episode',
            description: processedData.metadata.description || description || '',
            thumbnail: processedData.metadata.thumbnail || '',
            duration: processedData.metadata.duration || null,
            publishedAt: processedData.metadata.publishedAt || new Date(),
            transcript: processedData.transcript,
            transcriptSummary: processedData.transcriptSummary,
            businessIdeas: processedData.businessIdeas,
            frameworks: processedData.frameworks,
            timelessInsights: processedData.timelessInsights,
            founderStories: processedData.founderStories,
            processingStatus: 'completed'
          });
        } catch (updateError) {
          console.error('Error updating episode after processing:', updateError);
          await episode.update({
            processingStatus: 'failed',
            processingError: updateError.message
          });
        }
      })
      .catch(async (processingError) => {
        console.error('Error processing transcript:', processingError);
        await episode.update({
          processingStatus: 'failed',
          processingError: processingError.message
        });
      });

    res.status(201).json({
      success: true,
      data: {
        episode: episode.toJSON(),
        message: 'Episode created and processing started. Check processing status for updates.'
      }
    });
  } catch (error) {
    console.error('Create episode error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while creating episode' }
    });
  }
});

// @route   PUT /api/episodes/:id
// @desc    Update episode by ID
// @access  Private (Admin only)
router.put('/:id', auth, authorize('admin'), [
  body('title')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Title must be less than 255 characters'),
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
  body('category')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Category must be less than 100 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: errors.array()[0].msg }
      });
    }

    const { id } = req.params;
    const { title, description, category, tags, isPublished } = req.body;

    const episode = await Episode.findByPk(id);
    if (!episode) {
      return res.status(404).json({
        success: false,
        error: { message: 'Episode not found' }
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    await episode.update(updateData);

    res.json({
      success: true,
      data: {
        episode: episode.toJSON()
      }
    });
  } catch (error) {
    console.error('Update episode error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while updating episode' }
    });
  }
});

// @route   DELETE /api/episodes/:id
// @desc    Delete episode by ID
// @access  Private (Admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const episode = await Episode.findByPk(id);
    if (!episode) {
      return res.status(404).json({
        success: false,
        error: { message: 'Episode not found' }
      });
    }

    await episode.destroy();

    res.json({
      success: true,
      data: { message: 'Episode deleted successfully' }
    });
  } catch (error) {
    console.error('Delete episode error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while deleting episode' }
    });
  }
});

// @route   GET /api/episodes/:id/processing-status
// @desc    Get episode processing status
// @access  Public
router.get('/:id/processing-status', async (req, res) => {
  try {
    const { id } = req.params;
    
    const episode = await Episode.findByPk(id, {
      attributes: ['id', 'processingStatus', 'processingError', 'title', 'thumbnail']
    });
    
    if (!episode) {
      return res.status(404).json({
        success: false,
        error: { message: 'Episode not found' }
      });
    }

    res.json({
      success: true,
      data: {
        processingStatus: episode.processingStatus,
        processingError: episode.processingError,
        title: episode.title,
        thumbnail: episode.thumbnail
      }
    });
  } catch (error) {
    console.error('Get processing status error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while fetching processing status' }
    });
  }
});

module.exports = router;
