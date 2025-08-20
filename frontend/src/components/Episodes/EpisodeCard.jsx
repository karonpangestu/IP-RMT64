import { Link } from 'react-router-dom'
import { 
  Play, 
  Clock, 
  Eye, 
  Lightbulb, 
  Target, 
  BookOpen, 
  Users,
  Calendar
} from 'lucide-react'

const EpisodeCard = ({ episode }) => {
  const {
    id,
    title,
    description,
    thumbnail,
    sourceUrl,
    sourceType,
    formattedDuration,
    excerpt,
    transcriptSummary,
    businessIdeasCount,
    frameworksCount,
    insightsCount,
    storiesCount,
    tags = [],
    category,
    viewCount,
    publishedAt,
    createdAt
  } = episode

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Get source icon and color
  const getSourceInfo = (type) => {
    switch (type) {
      case 'youtube':
        return { color: 'bg-red-500', label: 'YouTube' }
      case 'spotify':
        return { color: 'bg-green-500', label: 'Spotify' }
      case 'apple':
        return { color: 'bg-black', label: 'Apple' }
      default:
        return { color: 'bg-gray-500', label: 'Other' }
    }
  }

  const sourceInfo = getSourceInfo(sourceType)

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-200 overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
            <Play className="w-12 h-12 text-primary-600" />
          </div>
        )}
        
        {/* Source Badge */}
        <div className="absolute top-3 left-3">
          <span className={`${sourceInfo.color} text-white text-xs px-2 py-1 rounded-full font-medium`}>
            {sourceInfo.label}
          </span>
        </div>
        
        {/* Duration */}
        {formattedDuration && (
          <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {formattedDuration}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
          <Link to={`/episode/${id}`}>
            {title}
          </Link>
        </h3>

        {/* Description */}
        {excerpt && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {excerpt}
          </p>
        )}

        {/* Transcript Summary */}
        {transcriptSummary && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-700 text-sm line-clamp-2">
              {transcriptSummary}
            </p>
          </div>
        )}

        {/* Insights Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {businessIdeasCount > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              <span>{businessIdeasCount} ideas</span>
            </div>
          )}
          
          {frameworksCount > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Target className="w-4 h-4 text-blue-500" />
              <span>{frameworksCount} frameworks</span>
            </div>
          )}
          
          {insightsCount > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <BookOpen className="w-4 h-4 text-green-500" />
              <span>{insightsCount} insights</span>
            </div>
          )}
          
          {storiesCount > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4 text-purple-500" />
              <span>{storiesCount} stories</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-gray-500 text-xs px-2 py-1">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(publishedAt || createdAt)}</span>
            </div>
            
            {viewCount > 0 && (
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{viewCount}</span>
              </div>
            )}
          </div>

          {/* Category */}
          {category && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
              {category}
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-4">
          <Link
            to={`/episode/${id}`}
            className="w-full bg-primary-600 text-white text-center py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            View Episode
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EpisodeCard
