# Multi-Model AI Chat Platform

A full-stack web application designed to provide a seamless interface for interacting with multiple Large Language Models (LLMs) via the Groq API. This project features a robust authentication system, persistent chat history, and a specialized temporary chat mode for enhanced privacy.

## Project Structure

The project is organized as a monorepo to separate concerns between the server-side logic and the user interface while maintaining a unified development environment.

### Monorepo Overview
- `backend/`: Node.js/Express server with TypeScript.
- `frontend/`: React application with Vite and TypeScript.

---

## Technology Stack

### Frontend
- **Framework**: React 19 with Vite (TypeScript)
- **Styling**: Tailwind CSS v4
- **State Management**: Context API (Auth and Chat providers)
- **Icons**: React Icons (Heroicons)
- **Animations**: Framer Motion (Transitions and UI feedback)
- **Tools**: emoji-picker-react for input enhancements

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Object modeling via Mongoose)
- **Security**: JSON Web Tokens (JWT) for session management and Bcrypt.js for credential hashing
- **Deployment**: Configured for Render

---

## Key Features

### Multi-Model Integration
- Integration with external AI providers (Groq) to support models like Llama 3.3 and Mixtral.
- Model selector in the navigation bar allows users to switch between different AI architectures on the fly.

### Persistent Communication
- **Authenticated Sessions**: Secure login and registration.
- **Chat History**: Messages and conversations are stored in MongoDB, allowing users to resume past sessions.
- **Auto-scroll**: Intelligent scrolling behavior to maintain focus on the newest messages.

### Temporary Chat Mode
- Privacy-focused mode accessible via a toggle in the navigation bar.
- Conversations in this mode are not persisted in the database or local storage.
- Specialized UI alerts the user that the training data and history are not tracked.

### Interface Enhancements
- **Dark/Light Mode**: Dynamic theme switching with persistence.
- **Message Input**: Support for emojis and multi-file attachment previews.
- **Responsive Design**: Collapsible sidebar and optimized layouts for mobile and desktop viewports.

---

## Directory Architecture

### Backend
```text
backend/
├── src/
│   ├── config/         # Database connection and environment setup
│   ├── controllers/    # Request handlers for Auth and Chat
│   ├── middleware/     # JWT authentication and error handling
│   ├── models/         # Mongoose schemas (User, Conversation, Message)
│   ├── routes/         # Express API endpoints
│   └── index.ts        # Application entry point
├── dist/               # Compiled JavaScript (production)
└── tsconfig.json       # TypeScript configuration
```

### Frontend
```text
frontend/
├── src/
│   ├── components/
│   │   ├── auth/       # Authentication modals and forms
│   │   ├── chat/       # ChatArea, MessageInput, and Suggestion Cards
│   │   └── layout/     # Navbar, Sidebar, and common UI elements
│   ├── context/        # Auth, Chat, and Theme Context Providers
│   ├── hooks/          # Custom hooks for accessing global state
│   ├── layouts/        # MainLayout wrapper for page structure
│   ├── services/       # External API service (AI integration)
│   ├── types/          # TypeScript interfaces and type definitions
│   └── App.tsx         # Main application component
├── .env                # Client-side environment variables
└── vite.config.ts      # Vite build configuration
```

---

## Installation and Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB account (URI string)
- Groq Cloud API Key

### Backend Setup
1. Navigate to the `backend/` directory.
2. Install dependencies: `npm install`
3. Create a `.env` file with: `PORT`, `MONGO_URI`, and `JWT_SECRET`.
4. Start development server: `npm run dev`

### Frontend Setup
1. Navigate to the `frontend/` directory.
2. Install dependencies: `npm install`
3. Create a `.env` file with: `VITE_API_URL` and `VITE_GROQ_API_KEY`.
4. Start development server: `npm run dev`

## Deployment

The application is architected for deployment on platforms like Render:
- **Backend Build**: `npm install && npm run build` (Targeting `backend/`)
- **Backend Start**: `npm start`
- **Frontend Build**: `npm run build` (Standard Vite build)
