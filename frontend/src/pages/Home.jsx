import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectIsAuthenticated } from "../store/slices/authSlice"
import {
  Shield,
  Zap,
  Database,
  Smartphone,
  Code,
  Globe,
  ArrowRight,
  CheckCircle,
} from "lucide-react"

const Home = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const features = [
    {
      icon: Shield,
      title: "Secure Authentication",
      description:
        "JWT-based authentication with bcrypt password hashing and role-based access control.",
    },
    {
      icon: Database,
      title: "PostgreSQL Database",
      description:
        "Robust database with Sequelize ORM for efficient data management and relationships.",
    },
    {
      icon: Zap,
      title: "Fast & Responsive",
      description:
        "Built with Vite and React for lightning-fast development and optimal performance.",
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description:
        "Responsive design that works perfectly on all devices and screen sizes.",
    },
    {
      icon: Code,
      title: "Modern Stack",
      description:
        "Latest technologies including Node.js, Express, Redux Toolkit, and TailwindCSS.",
    },
    {
      icon: Globe,
      title: "Cloud Ready",
      description:
        "Deployment configurations for Vercel, Render, and Supabase cloud services.",
    },
  ]

  const techStack = [
    "Node.js & Express.js",
    "PostgreSQL & Sequelize",
    "React 18 & Vite",
    "Redux Toolkit",
    "TailwindCSS",
    "JWT Authentication",
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Full-Stack
            <span className="text-primary-600 block">Web Application</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            A modern, scalable web application built with cutting-edge
            technologies. Features user authentication, profile management, and
            a beautiful responsive interface.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center justify-center"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors border border-primary-200"
                >
                  Sign In
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center justify-center"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to build and deploy a production-ready web
              application
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Technology Stack
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with modern, battle-tested technologies for optimal
              performance and developer experience
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow"
              >
                <CheckCircle className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">{tech}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers building amazing applications with our
            modern tech stack
          </p>
          {!isAuthenticated ? (
            <Link
              to="/register"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
            >
              Start Building Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          ) : (
            <Link
              to="/dashboard"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
            >
              Explore Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
