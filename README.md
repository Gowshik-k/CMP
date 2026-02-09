# CMP - University Conference Management System

A modern MERN stack application for managing university conferences.

## Project Structure

```
CMP/
├── server/          # Backend (Node.js + Express)
│   ├── index.js     # Server entry point
│   ├── package.json
│   └── .env         # Environment variables
│
└── client/          # Frontend (React + Vite)
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Getting Started

### Server Setup

```bash
cd server
npm install
npm start        # Production
npm run dev      # Development with nodemon
```

Server runs on: `http://localhost:5000`

### Client Setup

```bash
cd client
npm install
npm run dev      # Development server
```

Client runs on: `http://localhost:3000`

## Features

- ✨ Modern, premium UI with gradient animations
- 🎯 Responsive design for all devices
- 🔒 CORS-enabled backend
- 📊 MongoDB ready (connection commented out)
- ⚡ Vite for fast development
- 🎨 Glassmorphism and modern CSS effects

## Environment Variables

Server `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/conference_db
```

## API Endpoints

- `GET /api/status` - Health check endpoint
