# IP-RMT64 Full-Stack Application

A modern, production-ready full-stack web application built with cutting-edge technologies.

## 🚀 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Sequelize** - ORM for database management
- **PostgreSQL** - Relational database (hosted on Supabase)
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hook Form** - Form handling

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **Supabase** - Database hosting

## 📁 Project Structure

```
IP-RMT64/
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Sequelize models
│   │   ├── routes/         # API routes
│   │   └── server.js       # Main server file
│   ├── package.json
│   └── .sequelizerc
├── frontend/                # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── vercel.json             # Vercel deployment config
├── render.yaml             # Render deployment config
├── package.json            # Root package.json
└── README.md
```

## 🛠️ Features

- **User Authentication**
  - JWT-based authentication
  - User registration and login
  - Password hashing with bcrypt
  - Role-based access control

- **User Management**
  - User profiles with avatar support
  - Profile editing capabilities
  - Admin user management
  - User search and pagination

- **Security Features**
  - CORS configuration
  - Helmet security headers
  - Input validation
  - Rate limiting ready

- **Modern UI/UX**
  - Responsive design
  - Dark/light theme support
  - Loading states and animations
  - Toast notifications

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database (or Supabase account)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd IP-RMT64
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   
   **Backend (.env)**
   ```bash
   cd backend
   cp env.example .env
   # Edit .env with your database credentials
   ```
   
   **Frontend**
   ```bash
   cd frontend
   # Frontend will use proxy to backend in development
   ```

4. **Database Setup**
   ```bash
   cd backend
   npm run db:migrate
   npm run db:seed
   ```

5. **Start Development Servers**
   ```bash
   # From root directory
   npm run dev
   
   # Or start separately
   npm run dev:backend    # Backend on port 5000
   npm run dev:frontend   # Frontend on port 5173
   ```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Users (Admin Only)
- `GET /api/users` - Get all users with pagination
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Health Check
- `GET /api/health` - API health status

## 🎨 Frontend Components

### Layout Components
- `Header` - Navigation and user menu
- `Footer` - Project information and links
- `Layout` - Main layout wrapper

### UI Components
- `LoadingSpinner` - Reusable loading indicator
- `Button` - Styled button components
- `Input` - Form input components

### Auth Components
- `ProtectedRoute` - Route protection wrapper
- `Login` - User login form
- `Register` - User registration form

## 📱 Responsive Design

The application is built with a mobile-first approach using TailwindCSS:

- **Mobile**: Optimized for small screens
- **Tablet**: Responsive grid layouts
- **Desktop**: Full-featured interface
- **Accessibility**: ARIA labels and keyboard navigation

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/dist`
4. Configure environment variables

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set build command: `cd backend && npm install`
3. Set start command: `cd backend && npm start`
4. Configure environment variables

### Database (Supabase)
1. Create a new Supabase project
2. Get connection details from project settings
3. Update backend environment variables
4. Run database migrations

## 🔧 Development Scripts

### Root Directory
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build both applications
- `npm run install:all` - Install all dependencies

### Backend
- `npm run dev` - Start development server
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset database completely

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🧪 Testing

The project includes testing setup with Jest:

```bash
# Backend tests
cd backend
npm test

# Frontend tests (when implemented)
cd frontend
npm test
```

## 📊 Performance

- **Frontend**: Vite for fast development and optimized builds
- **Backend**: Express with compression and caching
- **Database**: Connection pooling and query optimization
- **Assets**: Optimized images and CSS

## 🔒 Security

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Security headers with Helmet
- Rate limiting ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🎯 Roadmap

- [ ] Add more user roles and permissions
- [ ] Implement file upload functionality
- [ ] Add real-time features with WebSockets
- [ ] Create admin dashboard
- [ ] Add analytics and monitoring
- [ ] Implement caching layer
- [ ] Add comprehensive testing suite

---

**Built with ❤️ using modern web technologies**
