# Glimpse

**Glimpse** is a modern full-stack visual sharing web application built with a **React + Vite** frontend and a **MERN-based backend** using **Node.js, Express, MongoDB, and Mongoose**. It allows users to discover, create, save, and interact with visual content through a clean, responsive Pinterest-inspired experience.

Repository: [Glimpse-Visual-Sharing-App](https://github.com/Rituraj379/Glimpse-VIsual-Sharing-App-)

---

## Features

- Google login with optional guest browsing
- Guest mode with restricted actions
- Create, save, and comment on pins
- Search and filter content by category or keyword
- User profiles with created and saved pins
- Image upload support for pins
- AI chatbot integration
- Responsive UI for desktop and mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express, MongoDB, Mongoose |
| Auth | Google OAuth |
| AI | Google Gemini API |
| Uploads | Multer |

---

## Project Structure

```bash
Glimpse/
├── Glimpse_backend
└── Glimpse_frontend
```

---

## Getting Started

### Backend

1. Go to the backend folder:
```bash
cd Glimpse_backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file and add:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/glimpse
CLIENT_URL=http://localhost:5181
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
```

4. Start the backend:
```bash
npm run dev
```

### Frontend

1. Go to the frontend folder:
```bash
cd Glimpse_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file and add:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

4. Start the frontend:
```bash
npm run dev
```

---

## Local URLs

- Frontend: `http://localhost:5181`
- Backend API: `http://localhost:5000/api`
- MongoDB: `mongodb://127.0.0.1:27017/glimpse`

---

## Authentication

- Sign in with Google for full access
- Continue as guest for browse-only access
- Guests cannot save pins, post pins, or comment

---

## Deployment

Recommended setup:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

Make sure to update:

- frontend `VITE_API_BASE_URL`
- frontend `VITE_GOOGLE_CLIENT_ID`
- backend `CLIENT_URL`
- backend `MONGODB_URI`

---

## Author

- Rituraj Singh
- [LinkedIn](https://www.linkedin.com/in/riturajsingh1)
- [GitHub](https://github.com/Rituraj379)
