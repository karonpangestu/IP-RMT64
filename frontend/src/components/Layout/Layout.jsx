import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated, selectUser } from '../../store/slices/authSlice'
import Header from './Header'
import Footer from './Footer'

const Layout = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectUser)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isAuthenticated={isAuthenticated} user={user} />
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  )
}

export default Layout
