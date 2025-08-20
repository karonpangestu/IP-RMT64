import { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'

const FilterModal = ({ isOpen, onClose, currentFilters, onApplyFilters }) => {
  const [filters, setFilters] = useState(currentFilters)

  useEffect(() => {
    setFilters(currentFilters)
  }, [currentFilters])

  if (!isOpen) return null

  const handleApply = () => {
    onApplyFilters(filters)
  }

  const handleReset = () => {
    const resetFilters = {
      search: '',
      category: '',
      sourceType: '',
      sortBy: 'publishedAt',
      sortOrder: 'DESC'
    }
    setFilters(resetFilters)
    onApplyFilters(resetFilters)
  }

  const categories = [
    'Business Strategy',
    'Startup',
    'Marketing',
    'Finance',
    'Leadership',
    'Technology',
    'Sales',
    'Product Development',
    'Customer Success',
    'Operations'
  ]

  const sourceTypes = [
    { value: 'youtube', label: 'YouTube' },
    { value: 'spotify', label: 'Spotify' },
    { value: 'apple', label: 'Apple Podcasts' },
    { value: 'other', label: 'Other' }
  ]

  const sortOptions = [
    { value: 'publishedAt', label: 'Publication Date' },
    { value: 'createdAt', label: 'Added Date' },
    { value: 'title', label: 'Title' },
    { value: 'viewCount', label: 'Views' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Filters & Sort</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Categories */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Category</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={filters.category === ''}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="mr-3 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-700">All Categories</span>
              </label>
              {categories.map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={filters.category === category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="mr-3 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Source Type */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Source Type</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sourceType"
                  value=""
                  checked={filters.sourceType === ''}
                  onChange={(e) => setFilters({ ...filters, sourceType: e.target.value })}
                  className="mr-3 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-700">All Sources</span>
              </label>
              {sourceTypes.map((source) => (
                <label key={source.value} className="flex items-center">
                  <input
                    type="radio"
                    name="sourceType"
                    value={source.value}
                    checked={filters.sourceType === source.value}
                    onChange={(e) => setFilters({ ...filters, sourceType: e.target.value })}
                    className="mr-3 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-gray-700">{source.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Sort By</h3>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="sortBy"
                    value={option.value}
                    checked={filters.sortBy === option.value}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="mr-3 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort Order */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Sort Order</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sortOrder"
                  value="DESC"
                  checked={filters.sortOrder === 'DESC'}
                  onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
                  className="mr-3 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-700">Newest First</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sortOrder"
                  value="ASC"
                  checked={filters.sortOrder === 'ASC'}
                  onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
                  className="mr-3 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-700">Oldest First</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Reset All
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterModal
