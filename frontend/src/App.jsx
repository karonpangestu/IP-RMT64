import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout/Layout"
import Home from "./pages/Home"
import EpisodeDetail from "./pages/EpisodeDetail"
import Login from "./components/Auth/Login"
import Register from "./components/Auth/Register"
import ProtectedRoute from "./components/Auth/ProtectedRoute"
import NewEpisode from "./pages/NewEpisode"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="episode/:id" element={<EpisodeDetail />} />
        <Route
          path="episode/new"
          element={
            <ProtectedRoute>
              <NewEpisode />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
