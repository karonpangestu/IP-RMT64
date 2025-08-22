import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { format } from "date-fns"
import LoadingSpinner from "../components/UI/LoadingSpinner"
import { fetchEpisodeById, deleteEpisode } from "../store/slices/episodesSlice"
import { updateEpisode } from "../services/episodesAPI"

// Helper function to extract YouTube video ID from URL
const getYouTubeVideoId = (url) => {
  if (!url) return ""

  // Regular expressions for different YouTube URL formats
  const patterns = {
    // youtu.be URLs
    shortUrl: /youtu\.be\/([a-zA-Z0-9_-]+)/,
    // youtube.com URLs
    longUrl: /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    // youtube.com/v/ URLs
    alternateLongUrl: /youtube\.com\/v\/([a-zA-Z0-9_-]+)/,
    // youtube.com/embed/ URLs
    embedUrl: /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
  }

  try {
    // Try each pattern
    for (const [key, pattern] of Object.entries(patterns)) {
      const match = url.match(pattern)
      if (match) return match[1]
    }

    // If no pattern matches, try parsing as URL
    const urlObj = new URL(url)
    if (urlObj.hostname.includes("youtube.com")) {
      const searchParams = new URLSearchParams(urlObj.search)
      const videoId = searchParams.get("v")
      if (videoId) return videoId
    }
  } catch (e) {
    console.error("Error parsing YouTube URL:", url)
  }

  return ""
}
function EpisodeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {
    currentEpisode: episode,
    loading,
    error,
  } = useSelector((state) => state.episodes)
  const { user } = useSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState("Summary")
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState("")

  useEffect(() => {
    console.log("EpisodeDetail - Fetching episode with ID:", id)
    dispatch(fetchEpisodeById(id))
  }, [dispatch, id])

  useEffect(() => {
    if (episode) {
      console.log("EpisodeDetail - Episode loaded:", episode)
      setEditTitle(episode.title)
    }
  }, [episode])

  // Debug logging
  console.log("EpisodeDetail - Current state:", {
    id,
    episode,
    loading,
    error,
    user,
  })

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this episode?")) {
      await dispatch(deleteEpisode(id))
      navigate("/")
    }
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleSaveEdit = async () => {
    try {
      const updatedEpisode = await updateEpisode(episode.id, {
        title: editTitle,
      })
      // Update the episode in the store
      dispatch({
        type: "episodes/updateEpisodeInStore",
        payload: updatedEpisode,
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update episode:", error)
      setEditTitle(episode.title) // Reset on error
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditTitle(episode.title)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (!episode) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Episode not found</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading episode:</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  // Parse JSON strings into arrays, with fallback to empty array if parsing fails
  const parseJsonField = (field) => {
    try {
      if (!field) return []
      // If it's already an array, return it
      if (Array.isArray(field)) return field
      // Try parsing as JSON
      return JSON.parse(field)
    } catch (e) {
      // If it's a string but not JSON, parse the Gemini-style formatting
      if (typeof field === "string") {
        // Split by asterisk patterns (Gemini format: * **Title:** content)
        const items = field.split(/\*\s+/).filter((item) => item.trim())
        if (items.length > 1) {
          return items
            .map((item) => {
              // Clean up the item by removing markdown formatting
              return item
                .replace(/\*\*/g, "") // Remove **
                .replace(/^\s*:\s*/, "") // Remove leading : and spaces
                .trim()
            })
            .filter((item) => item.length > 0)
        }
        // Fallback: split by newlines and filter empty lines
        return field.split("\n").filter((line) => line.trim())
      }
      return []
    }
  }

  const businessIdeas = parseJsonField(episode.businessIdeas)
  const frameworks = parseJsonField(episode.frameworks)
  const founderStories = parseJsonField(episode.founderStories)
  const aiAnalysis = episode.aiAnalysis || {}

  // Check ownership - user can edit/delete if they created the episode
  const isOwner = user && user.id === episode.userId

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Video Player */}
      <div className="w-full mb-8">
        <div className="aspect-video relative rounded-lg overflow-hidden shadow-lg">
          {episode?.sourceUrl ? (
            <>
              <iframe
                className="w-full h-full absolute inset-0"
                src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                  episode.sourceUrl
                )}`}
                title={episode.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onError={(e) => console.error("iframe error:", e)}
              />
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500">
              <p>No video URL available</p>
              <p className="text-sm mt-2">
                Please check if you're logged in and have access to this episode
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-3xl font-bold text-gray-900 border border-gray-300 rounded px-3 py-2 flex-1"
                autoFocus
              />
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <h1 className="text-3xl font-bold text-gray-900">
              {episode.title}
            </h1>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-gray-600">
            {format(new Date(episode.createdAt), "MMMM d, yyyy")}
          </div>
          {isOwner && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleEditClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Title
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Episode
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {["Summary", "Business Ideas", "Frameworks", "Founder Stories"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab}
              </button>
            )
          )}
        </nav>
      </div>

      {/* Content Sections */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* Summary */}
        {activeTab === "Summary" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {episode.summary || "No summary available"}
            </p>
          </div>
        )}

        {/* Business Ideas */}
        {activeTab === "Business Ideas" && businessIdeas.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Business Ideas</h2>
            <div className="space-y-4">
              {businessIdeas.map((idea, index) => (
                <div key={index} className="text-gray-700">
                  <p className="whitespace-pre-wrap">- {idea}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Frameworks */}
        {activeTab === "Frameworks" && frameworks.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Frameworks</h2>
            <div className="space-y-4">
              {frameworks.map((framework, index) => (
                <div key={index} className="text-gray-700">
                  <p className="whitespace-pre-wrap">- {framework}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Founder Stories */}
        {activeTab === "Founder Stories" && founderStories.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Founder Stories</h2>
            <div className="space-y-4">
              {founderStories.map((story, index) => (
                <div key={index} className="text-gray-700">
                  <p className="whitespace-pre-wrap">- {story}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EpisodeDetail
