import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { restoreAuthState } from "../../store/slices/authSlice"

function AuthProvider({ children }) {
  const dispatch = useDispatch()
  const { isRestoring } = useSelector((state) => state.auth)

  useEffect(() => {
    // Try to restore auth state from stored token
    dispatch(restoreAuthState())
  }, [dispatch])

  // Show loading while restoring auth state
  if (isRestoring) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return children
}

export default AuthProvider
