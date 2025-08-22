import { Link } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import ReactPlayer from "react-player"
import { useState } from "react"
import { useSelector } from "react-redux"
import { updateEpisode, deleteEpisode } from "../../services/episodesAPI"

// Helper function to extract YouTube video ID from URL
const getYouTubeVideoId = (url) => {
  try {
    const urlObj = new URL(url)
    if (urlObj.hostname.includes("youtube.com")) {
      return urlObj.searchParams.get("v")
    } else if (urlObj.hostname.includes("youtu.be")) {
      return urlObj.pathname.slice(1)
    }
  } catch (e) {
    console.error("Invalid URL:", url)
  }
  return ""
}

function EpisodeCard({ episode, onEpisodeUpdate, onEpisodeDelete }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(episode.title)
  const [isDeleting, setIsDeleting] = useState(false)
  const { user } = useSelector((state) => state.auth)
  const videoId = getYouTubeVideoId(episode.sourceUrl)

  // Check ownership - user can edit/delete if they created the episode
  const isOwner = user && user.id === episode.userId

  const handleVideoClick = (e) => {
    e.preventDefault()
    setIsPlaying(true)
  }

  const handleEditClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const updatedEpisode = await updateEpisode(episode.id, {
        title: editTitle,
      })
      setIsEditing(false)
      if (onEpisodeUpdate) {
        onEpisodeUpdate(updatedEpisode)
      }
    } catch (error) {
      console.error("Failed to update episode:", error)
      setEditTitle(episode.title) // Reset on error
    }
  }

  const handleCancelEdit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsEditing(false)
    setEditTitle(episode.title)
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (window.confirm("Are you sure you want to delete this episode?")) {
      setIsDeleting(true)
      try {
        await deleteEpisode(episode.id)
        if (onEpisodeDelete) {
          onEpisodeDelete(episode.id)
        }
      } catch (error) {
        console.error("Failed to delete episode:", error)
        setIsDeleting(false)
      }
    }
  }

  return (
    <div className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
      <div className="flex items-start gap-4">
        {/* Video/Thumbnail Container */}
        <div className="w-32 h-20 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden relative group">
          {isPlaying ? (
            <div className="absolute inset-0">
              <ReactPlayer
                url={episode.sourceUrl}
                width="100%"
                height="100%"
                playing={true}
                controls={true}
                onClick={(e) => e.preventDefault()}
              />
            </div>
          ) : (
            <Link to={`/episode/${episode.id}`}>
              <img
                src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                alt={episode.title}
                className="w-full h-full object-cover rounded-lg"
                onClick={handleVideoClick}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-30">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Title with edit functionality */}
          <div className="flex items-center gap-2 mb-2">
            {isEditing ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-xl font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1 flex-1"
                  autoFocus
                />
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <Link to={`/episode/${episode.id}`} className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                    {episode.title}
                  </h2>
                </Link>
                {isOwner && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleEditClick}
                      className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit title"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                      title="Delete episode"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {episode.description}
          </p>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                {formatDistanceToNow(new Date(episode.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>

            {episode.duration && (
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072M12 18.364a7 7 0 010-12.728M8.464 15.536a5 5 0 010-7.072"
                  />
                </svg>
                <span>{episode.duration}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EpisodeCard
