import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { 
  fetchEpisodes, 
  setFilters, 
  clearFilters,
  selectEpisodes,
  selectEpisodesLoading,
  selectEpisodesError,
  selectEpisodesPagination,
  selectEpisodesFilters
} from '../store/slices/episodesSlice'
import { 
  Search, 
  Filter, 
  Play, 
  Clock, 
  Eye,
  Lightbulb,
  Target,
  BookOpen,
  Users,
  X
} from 'lucide-react'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import EpisodeCard from '../components/Episodes/EpisodeCard'
import FilterModal from '../components/Episodes/FilterModal'

const PodcastHome = () => {
  const dispatch = useDispatch()
  const episodes = useSelector(selectEpisodes)
  const loading = useSelector(selectEpisodesLoading)
  const error = useSelector(selectEpisodesError)
  const pagination = useSelector(selectEpisodesPagination)
  const filters = useSelector(selectEpisodesFilters)
  
  const [searchTerm, setSearchTerm] = useState(filters.search)
  const [showFilters, setShowFilters] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch episodes when filters change
  useEffect(() => {
    dispatch(fetchEpisodes({
      page: 1,
      limit: 12,
      search: debouncedSearch,
      category: filters.category,
      sourceType: filters.sourceType,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder
    }))
  }, [dispatch, debouncedSearch, filters.category, filters.sourceType, filters.sortBy, filters.sortOrder])

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(setFilters({ search: debouncedSearch, page: 1 }))
  }

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    dispatch(setFilters({ ...newFilters, page: 1 }))
    setShowFilters(false)
  }

  // Handle pagination
  const handlePageChange = (page) => {
    dispatch(setFilters({ page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Clear all filters
  const handleClearFilters = () => {
    dispatch(clearFilters())
    setSearchTerm('')
  }

  // Check if any filters are active
  const hasActiveFilters = filters.search || filters.category || filters.sourceType || filters.sortBy !== 'publishedAt' || filters.sortOrder !== 'DESC'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Business Podcast Insights
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Discover actionable business ideas, frameworks, and founder stories from the world's top business podcasts. 
            AI-powered insights extracted from every episode.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search episodes, topics, or insights..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-700 hover:bg-primary-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
              
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>
                {pagination.totalEpisodes} episodes
              </span>
              <span>•</span>
              <span>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              {filters.search && (
                <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                  Search: "{filters.search}"
                </span>
              )}
              {filters.category && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Category: {filters.category}
                </span>
              )}
              {filters.sourceType && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Source: {filters.sourceType}
                </span>
              )}
              {filters.sortBy !== 'publishedAt' && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  Sort: {filters.sortBy} ({filters.sortOrder})
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Episodes Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-red-600 text-lg mb-4">Error loading episodes</div>
              <div className="text-gray-600">{error}</div>
              <button
                onClick={() => dispatch(fetchEpisodes(filters))}
                className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : episodes.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-600 text-lg mb-4">No episodes found</div>
              <div className="text-gray-500">
                {hasActiveFilters 
                  ? "Try adjusting your filters or search terms"
                  : "Check back later for new episodes"
                }
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Episodes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {episodes.map((episode) => (
                  <EpisodeCard key={episode.id} episode={episode} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          page === pagination.currentPage
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        currentFilters={filters}
        onApplyFilters={handleFilterChange}
      />
    </div>
  )
}

export default PodcastHome
