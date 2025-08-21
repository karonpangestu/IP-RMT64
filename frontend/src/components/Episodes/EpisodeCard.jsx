import { Link } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import ReactPlayer from "react-player"
import { useState } from "react"

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

function EpisodeCard({ episode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoId = getYouTubeVideoId(episode.sourceUrl)

  const handleVideoClick = (e) => {
    e.preventDefault()
    setIsPlaying(true)
  }

  return (
    <Link
      to={`/episode/${episode.id}`}
      className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
    >
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
            <>
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
            </>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {episode.title}
          </h2>
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
    </Link>
  )
}

export default EpisodeCard
