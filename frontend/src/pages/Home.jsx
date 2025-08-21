import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import EpisodeCard from "../components/Episodes/EpisodeCard"
import LoadingSpinner from "../components/UI/LoadingSpinner"
import { fetchEpisodes } from "../store/slices/episodesSlice"

function Home() {
  const dispatch = useDispatch()
  const { episodes, loading } = useSelector((state) => state.episodes)
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchEpisodes())
  }, [dispatch])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">MFM Episodes</h1>
        {isAuthenticated && (
          <Link
            to="/episode/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Episode
          </Link>
        )}
      </div>

      {/* Episodes Grid */}
      <div className="grid gap-6">
        {episodes.map((episode) => (
          <EpisodeCard key={episode.id} episode={episode} />
        ))}
      </div>

      {episodes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No episodes found</p>
        </div>
      )}
    </div>
  )
}

export default Home
