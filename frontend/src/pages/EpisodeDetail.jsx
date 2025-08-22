import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { format } from "date-fns"
import LoadingSpinner from "../components/UI/LoadingSpinner"
import { fetchEpisodeById, deleteEpisode } from "../store/slices/episodesSlice"

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
  const { currentEpisode: episode, loading } = useSelector(
    (state) => state.episodes
  )
  const { user } = useSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState("Summary")

  useEffect(() => {
    dispatch(fetchEpisodeById(id))
  }, [dispatch, id])

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this episode?")) {
      await dispatch(deleteEpisode(id))
      navigate("/")
    }
  }

  // Debug episode data
  console.log("Episode data:", episode)
  console.log("Loading state:", loading)
  console.log("Summary data:", episode?.summary)
  console.log("Episode status:", episode?.status)

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
  // Only show delete button if user is authenticated and is the owner
  const isOwner = user?.id === episode?.userId

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Video Player */}
      <div className="w-full mb-8">
        <div className="aspect-video relative rounded-lg overflow-hidden shadow-lg">
          {episode?.sourceUrl ? (
            <>
              {console.log("Rendering video for URL:", episode.sourceUrl)}
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {episode.title}
        </h1>
        <div className="flex items-center justify-between">
          <div className="text-gray-600">
            {format(new Date(episode.createdAt), "MMMM d, yyyy")}
          </div>
          {isOwner && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Episode
            </button>
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
