# Podcast Summarizer

A full-stack application that summarizes podcast episodes using AI, extracting key insights, business ideas, frameworks, and founder stories.

## Tech Stack

- Backend: Node.js + Express.js
- Database: Supabase PostgreSQL with Sequelize ORM
- Frontend: Vite + React + TailwindCSS
- State Management: Redux Toolkit
- Authentication: Google OAuth
- Testing: Jest + Supertest (backend), React Testing Library (frontend)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL database (via Supabase)

### Environment Variables

1. Backend (.env):

```
PORT=3000
NODE_ENV=development
DATABASE_URL=your_supabase_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
OPENAI_API_KEY=your_openai_api_key
TRANSCRIPT_API_KEY=your_transcript_api_key
```

2. Frontend (.env):

```
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development servers:

```bash
npm start
```

This will start both the backend server (port 3000) and frontend development server (port 5173).

### Testing

Run all tests:

```bash
npm test
```

Or run tests separately:

```bash
npm run test:backend
npm run test:frontend
```

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── App.jsx
│   └── package.json
└── package.json
```

## Deployment

- Backend: AWS Elastic Beanstalk/ECS
- Frontend: AWS S3 + CloudFront
- Database: Supabase

## License

This project is licensed under the MIT License - see the LICENSE file for details.
