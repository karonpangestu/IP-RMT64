const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Episode = sequelize.define('Episode', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sourceUrl: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      isUrl: true
    }
  },
  sourceType: {
    type: DataTypes.ENUM('youtube', 'spotify', 'apple', 'other'),
    allowNull: false,
    defaultValue: 'youtube'
  },
  duration: {
    type: DataTypes.INTEGER, // in seconds
    allowNull: true
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  thumbnail: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  // Transcript data
  transcript: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  transcriptSummary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // AI processed content
  businessIdeas: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Array of business ideas extracted from transcript'
  },
  frameworks: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Array of business frameworks mentioned'
  },
  timelessInsights: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Array of timeless business insights'
  },
  founderStories: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Array of founder stories and experiences'
  },
  // Processing status
  processingStatus: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
    defaultValue: 'pending'
  },
  processingError: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Metadata
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'episodes',
  timestamps: true,
  indexes: [
    {
      fields: ['title']
    },
    {
      fields: ['sourceType']
    },
    {
      fields: ['processingStatus']
    },
    {
      fields: ['isPublished']
    },
    {
      fields: ['publishedAt']
    }
  ]
});

// Instance methods
Episode.prototype.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

Episode.prototype.getFormattedDuration = function() {
  if (!this.duration) return null;
  
  const hours = Math.floor(this.duration / 3600);
  const minutes = Math.floor((this.duration % 3600) / 60);
  const seconds = this.duration % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

Episode.prototype.getExcerpt = function(length = 150) {
  if (!this.description) return null;
  return this.description.length > length 
    ? this.description.substring(0, length) + '...'
    : this.description;
};

module.exports = Episode;
