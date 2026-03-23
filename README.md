# Glimpse

Glimpse is a full-stack visual sharing platform inspired by Pinterest, built with a modern React frontend and a MERN backend. Users can discover visual ideas, create and save pins, comment on posts, manage profiles, and explore content through a clean responsive interface.

## Live Demo

- Frontend: [glimpse-v-isual-sharing-app.vercel.app](https://glimpse-v-isual-sharing-app.vercel.app)
- Backend: [glimpse-visual-sharing-app.onrender.com](https://glimpse-visual-sharing-app.onrender.com/api/health)
- Repository: [Glimpse-Visual-Sharing-App](https://github.com/Rituraj379/Glimpse-VIsual-Sharing-App-)

## Highlights

- Google authentication with optional guest mode
- Guest users can browse but cannot save, comment, or post
- Create, save, delete, and explore pins
- Pin detail pages with comments and related content
- Search and category-based discovery
- User profiles with created and saved boards
- AI assistant integration for content ideas
- Responsive layout for desktop and mobile

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | Google OAuth |
| AI | Google Gemini API |
| File Uploads | Multer |
| Deployment | Vercel, Render, MongoDB Atlas |

## Project Structure

```bash
Glimpse/
├── Glimpse_backend/
└── Glimpse_frontend/
```

## Features in Detail

### Authentication

- Google sign-in for full access
- Guest mode for read-only browsing
- Session-aware restrictions for guest users

### Content

- Upload image-based pins
- Add title, category, description, and destination link
- Save pins for later
- Comment on pin details
- Delete your own pins and comments

### Discovery

- Browse the home feed
- Filter by categories
- Search by keyword
- Explore creator profiles

### AI Assistant

- Helps with titles, categories, and post ideas
- Designed to support content creation directly inside the app

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Rituraj379/Glimpse-VIsual-Sharing-App-.git
cd Glimpse
```

### 2. Backend setup

```bash
cd Glimpse_backend
npm install
```

Create a `.env` file in `Glimpse_backend`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/glimpse
CLIENT_URL=http://localhost:5181
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
```

Run the backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd ../Glimpse_frontend
npm install
```

Create a `.env` file in `Glimpse_frontend`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Run the frontend:

```bash
npm run dev
```

## Local Development URLs

- Frontend: `http://localhost:5181`
- Backend API: `http://localhost:5000/api`
- Backend health route: `http://localhost:5000/api/health`
- MongoDB: `mongodb://127.0.0.1:27017/glimpse`

## Deployment

### Production Stack

- Frontend deployed on Vercel
- Backend deployed on Render
- Database hosted on MongoDB Atlas

### Frontend Environment Variables

```env
VITE_API_BASE_URL=https://glimpse-visual-sharing-app.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Backend Environment Variables

```env
PORT=10000
MONGODB_URI=your_mongodb_atlas_uri
CLIENT_URL=http://localhost:5181,https://glimpse-v-isual-sharing-app.vercel.app
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
```

## Notes

- The backend root URL is an API service, so opening `/` directly on Render may show `Cannot GET /`, which is expected.
- For production Google login, add your Vercel domain to Google OAuth authorized origins.
- Uploaded files are currently handled by the backend server, so production file persistence should be planned carefully for long-term scaling.

## Future Improvements

- Cloud storage for uploads
- Better AI-powered suggestions and chat memory
- Notifications and richer social interactions
- Better analytics and pin recommendations

## Author

Rituraj Singh

- GitHub: [Rituraj379](https://github.com/Rituraj379)
- LinkedIn: [riturajsingh1](https://www.linkedin.com/in/riturajsingh1)
