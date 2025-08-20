import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEpisodeById, selectCurrentEpisode, selectEpisodesLoading, selectEpisodesError } from '../store/slices/episodesSlice'
import { 
  Play, 
  Clock, 
  Eye, 
  Calendar, 
  ExternalLink, 
  Lightbulb, 
  Target, 
  BookOpen, 
  Users,
  ArrowLeft,
  Share2
} from 'lucide-react'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import ReactPlayer from 'react-player'

const EpisodeDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const episode = useSelector(selectCurrentEpisode)
  const loading = useSelector(selectEpisodesLoading)
  const error = useSelector(selectEpisodesError)

  useEffect(() => {
    if (id) {
      dispatch(fetchEpisodeById(id))
    }
  }, [dispatch, id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !episode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">Error loading episode</div>
          <div className="text-gray-600 mb-6">{error || 'Episode not found'}</div>
          <Link
            to="/"
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Episodes
          </Link>
        </div>
      </div>
    )
  }

  const {
    title,
    description,
    sourceUrl,
    sourceType,
    thumbnail,
    formattedDuration,
    transcriptSummary,
    businessIdeas,
    frameworks,
    timelessInsights,
    founderStories,
    tags = [],
    category,
    viewCount,
    publishedAt,
    createdAt,
    transcript
  } = episode

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Get source info
  const getSourceInfo = (type) => {
    switch (type) {
      case 'youtube':
        return { color: 'bg-red-500', label: 'YouTube', icon: '▶️' }
      case 'spotify':
        return { color: 'bg-green-500', label: 'Spotify', icon: '🎵' }
      case 'apple':
        return { color: 'bg-black', label: 'Apple Podcasts', icon: '🍎' }
      default:
        return { color: 'bg-gray-500', label: 'Other', icon: '🔗' }
    }
  }

  const sourceInfo = getSourceInfo(sourceType)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Episodes
          </Link>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                {formattedDuration && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formattedDuration}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(publishedAt || createdAt)}</span>
                </div>
                
                {viewCount > 0 && (
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{viewCount} views</span>
                  </div>
                )}
                
                {category && (
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                    {category}
                  </span>
                )}
              </div>
            </div>
            
            <button className="bg-primary-600 text-white p-3 rounded-lg hover:bg-primary-700 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Media Player */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="aspect-video bg-gray-900">
                {sourceType === 'youtube' ? (
                  <ReactPlayer
                    url={sourceUrl}
                    width="100%"
                    height="100%"
                    controls
                    light={thumbnail}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-white">
                        <Play className="w-16 h-16 mx-auto mb-4" />
                        <p className="text-lg">Audio/Video Content</p>
                        <a
                          href={sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center mt-4 bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open in {sourceInfo.label}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`${sourceInfo.color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                    {sourceInfo.icon} {sourceInfo.label}
                  </span>
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                  >
                    Open Original
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
                
                {description && (
                  <p className="text-gray-700 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {/* Transcript Summary */}
            {transcriptSummary && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Episode Summary</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {transcriptSummary}
                </p>
              </div>
            )}

            {/* Business Ideas */}
            {businessIdeas && businessIdeas.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Lightbulb className="w-6 h-6 text-yellow-500 mr-3" />
                  Business Ideas
                </h2>
                <div className="space-y-4">
                  {businessIdeas.map((idea, index) => (
                    <div key={index} className="border-l-4 border-yellow-400 pl-4 py-3">
                      <h3 className="font-semibold text-gray-900 mb-2">{idea.title}</h3>
                      <p className="text-gray-700 mb-2">{idea.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          idea.potential === 'High' ? 'bg-green-100 text-green-800' :
                          idea.potential === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {idea.potential} Potential
                        </span>
                        <span className="text-gray-600">{idea.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Frameworks */}
            {frameworks && frameworks.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Target className="w-6 h-6 text-blue-500 mr-3" />
                  Business Frameworks
                </h2>
                <div className="space-y-4">
                  {frameworks.map((framework, index) => (
                    <div key={index} className="border-l-4 border-blue-400 pl-4 py-3">
                      <h3 className="font-semibold text-gray-900 mb-2">{framework.name}</h3>
                      <p className="text-gray-700 mb-2">{framework.description}</p>
                      <p className="text-gray-600 text-sm">
                        <strong>Application:</strong> {framework.application}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeless Insights */}
            {timelessInsights && timelessInsights.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <BookOpen className="w-6 h-6 text-green-500 mr-3" />
                  Timeless Insights
                </h2>
                <div className="space-y-4">
                  {timelessInsights.map((insight, index) => (
                    <div key={index} className="border-l-4 border-green-400 pl-4 py-3">
                      <p className="font-semibold text-gray-900 mb-2">{insight.insight}</p>
                      <p className="text-gray-700 mb-2">{insight.explanation}</p>
                      {insight.examples && (
                        <p className="text-gray-600 text-sm">
                          <strong>Examples:</strong> {insight.examples}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Founder Stories */}
            {founderStories && founderStories.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Users className="w-6 h-6 text-purple-500 mr-3" />
                  Founder Stories
                </h2>
                <div className="space-y-4">
                  {founderStories.map((story, index) => (
                    <div key={index} className="border-l-4 border-purple-400 pl-4 py-3">
                      <h3 className="font-semibold text-gray-900 mb-2">{story.founder}</h3>
                      <p className="text-gray-700 mb-2">{story.story}</p>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-600">
                          <strong>Lesson:</strong> {story.lesson}
                        </p>
                        {story.outcome && (
                          <p className="text-gray-600">
                            <strong>Outcome:</strong> {story.outcome}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            {tags.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Episode Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Episode Stats</h3>
              <div className="space-y-3">
                {businessIdeas && businessIdeas.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Business Ideas</span>
                    <span className="font-semibold text-gray-900">{businessIdeas.length}</span>
                  </div>
                )}
                
                {frameworks && frameworks.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Frameworks</span>
                    <span className="font-semibold text-gray-900">{frameworks.length}</span>
                  </div>
                )}
                
                {timelessInsights && timelessInsights.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Insights</span>
                    <span className="font-semibold text-gray-900">{timelessInsights.length}</span>
                  </div>
                )}
                
                {founderStories && founderStories.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Founder Stories</span>
                    <span className="font-semibold text-gray-900">{founderStories.length}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Full Transcript */}
            {transcript && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Full Transcript</h3>
                <div className="max-h-96 overflow-y-auto">
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {transcript}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EpisodeDetail
