const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Project Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">IP</span>
              </div>
              <span className="text-xl font-bold text-gray-900">RMT64</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              A full-stack application built with modern technologies including Node.js, Express, 
              React, and PostgreSQL. Features user authentication, profile management, and a 
              responsive design system.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/login" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  Sign In
                </a>
              </li>
              <li>
                <a href="/register" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  Sign Up
                </a>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Tech Stack
            </h3>
            <ul className="space-y-2">
              <li className="text-gray-600 text-sm">Node.js + Express</li>
              <li className="text-gray-600 text-sm">React + Vite</li>
              <li className="text-gray-600 text-sm">PostgreSQL + Sequelize</li>
              <li className="text-gray-600 text-sm">TailwindCSS + Redux</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2024 IP-RMT64. Built with ❤️ using modern web technologies.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-gray-500 text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
