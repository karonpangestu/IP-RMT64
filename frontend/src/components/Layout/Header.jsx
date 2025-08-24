import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { signOut } from "../../services/authAPI"
import { logout } from "../../store/slices/authSlice"

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  const handleLogout = async () => {
    try {
      await signOut()
      dispatch(logout())
      navigate("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Podcast Summarizer
        </Link>
        <nav className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span>Welcome, {user.username}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
