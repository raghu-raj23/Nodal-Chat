# Nodal Chat

[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/raghu-raj23/Nodal-Chat)

Nodal Chat is a real-time, cross-platform messaging application built with a modern technology stack. It features a robust backend, a feature-rich mobile application for iOS and Android, and a lightweight web client.

## Features

- **Real-Time Messaging:** Instantaneous message delivery using Socket.IO.
- **Cross-Platform:** Clients for both mobile (React Native) and web.
- **User Authentication:** Secure authentication handled by Clerk, supporting social logins (Google, Apple, GitHub).
- **User Presence:** Real-time online/offline status indicators.
- **Typing Indicators:** See when another user is typing a message.
- **1-on-1 Conversations:** Create or continue private chats with other users.
- **Chat & User Discovery:** Search for users to initiate new conversations.
- **Containerized:** Docker support for easy deployment and setup.

## Project Structure

This repository is a monorepo containing three main components:

- `./backend/`: The Node.js/Express backend server that handles API requests, database interactions, and WebSocket connections.
- `./mobile/`: A React Native application built with Expo for iOS and Android.
- `./web/`: A minimal React/Vite web client, primarily for demonstrating authentication.

```
.
├── backend/      # Express.js, TypeScript, Mongoose, Socket.IO API
├── mobile/       # React Native (Expo) mobile application
├── web/          # React (Vite) web application
└── Dockerfile    # Docker configuration for production
```

## Tech Stack

| Category    | Technology                                                                   |
| ----------- | ---------------------------------------------------------------------------- |
| **Backend** | Bun, Node.js, Express, TypeScript, MongoDB, Mongoose, Socket.IO, Clerk       |
| **Mobile**  | React Native, Expo, TypeScript, NativeWind, TanStack Query, Socket.IO Client |
| **Web**     | React, Vite, Clerk                                                           |
| **DevOps**  | Docker                                                                       |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/)
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/) (for containerized setup)
- A MongoDB database URI
- [Clerk](https://clerk.com/) API keys

### Environment Variables

Create a `.env` file in the `raghu-raj23-nodal-chat/backend` directory and add the following variables. You will also need separate `.env` files for the `mobile` and `web` directories for their respective keys.

**Backend (`backend/.env`):**

```env
# MongoDB Connection String
MONGODB_URI=your_mongodb_connection_string

# Clerk Credentials
CLERK_SECRET_KEY=your_clerk_secret_key

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173

# Port for the server
PORT=3000
```

**Mobile (`mobile/.env.local`):**

```env
# Clerk Publishable Key for Expo
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

**Web (`web/.env.local`):**

```env
# Clerk Publishable Key for Vite
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Backend API URL
VITE_API_URL=http://localhost:3000/api
```

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/raghu-raj23/Nodal-Chat.git
    cd Nodal-Chat
    ```

2.  **Backend Setup:**

    ```bash
    cd backend

    # Install dependencies
    bun install

    # (Optional) Seed the database with sample users
    # Ensure your MONGODB_URI is set in backend/.env
    bun src/scripts/seed.ts

    # Run the development server
    bun run dev
    ```

    The backend server will start on `http://localhost:3000`.

3.  **Mobile App Setup:**

    ```bash
    cd ../mobile

    # Install dependencies
    npm install

    # Start the Expo development server
    npx expo start
    ```

    Follow the instructions in the terminal to run the app on an emulator, a physical device, or the web.

4.  **Web App Setup:**

    ```bash
    cd ../web

    # Install dependencies
    bun install

    # Run the development server
    bun run dev
    ```

    The web client will be available at `http://localhost:5173`.

## Running with Docker

The `Dockerfile` in the root directory containerizes the backend and serves the built web application.

1.  **Build the Docker image:**
    Pass your Vite build-time arguments using `--build-arg`.

    ```bash
    docker build \
      --build-arg VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key \
      --build-arg VITE_API_URL=http://your_backend_url/api \
      -t nodal-chat .
    ```

2.  **Run the Docker container:**
    Pass your backend runtime environment variables using the `-e` flag.
    ```bash
    docker run -p 3000:3000 \
      -e PORT=3000 \
      -e MONGODB_URI="your_mongodb_connection_string" \
      -e CLERK_SECRET_KEY="your_clerk_secret_key" \
      -e NODE_ENV=production \
      nodal-chat
    ```
    The application will be accessible at `http://localhost:3000`.

## API Endpoints

The backend exposes the following RESTful API endpoints, protected via Clerk authentication.

| Method | Endpoint                         | Description                                                        |
| ------ | -------------------------------- | ------------------------------------------------------------------ |
| `POST` | `/api/auth/callback`             | Creates or syncs a user in the local DB after Clerk auth.          |
| `GET`  | `/api/auth/me`                   | Retrieves the current authenticated user's profile.                |
| `GET`  | `/api/chats`                     | Fetches all chats for the current user.                            |
| `POST` | `/api/chats/with/:participantId` | Creates a new chat or retrieves an existing one with another user. |
| `GET`  | `/api/messages/chat/:chatId`     | Fetches all messages for a specific chat.                          |
| `GET`  | `/api/users`                     | Retrieves a list of all users except the current one.              |

## WebSocket Events

Real-time functionality is handled through the following Socket.IO events.

### Emitted from Client

| Event          | Payload                                 | Description                                         |
| -------------- | --------------------------------------- | --------------------------------------------------- |
| `join-chat`    | `chatId: string`                        | Joins the socket room for a specific chat.          |
| `leave-chat`   | `chatId: string`                        | Leaves the socket room for a specific chat.         |
| `send-message` | `{ chatId: string, text: string }`      | Sends a new message to a chat.                      |
| `typing`       | `{ chatId: string, isTyping: boolean }` | Notifies the server about the user's typing status. |

### Emitted from Server

| Event          | Payload                        | Description                                                   |
| -------------- | ------------------------------ | ------------------------------------------------------------- |
| `new-message`  | `message: Message`             | Broadcasts a newly created message to chat participants.      |
| `typing`       | `{ userId, chatId, isTyping }` | Broadcasts a user's typing status to the chat room.           |
| `online-users` | `{ userIds: string[] }`        | Sends the list of all currently online users upon connection. |
| `user-online`  | `{ userId: string }`           | Notifies clients that a user has come online.                 |
| `user-offline` | `{ userId: string }`           | Notifies clients that a user has gone offline.                |
| `socket-error` | `{ message: string }`          | Emits an error message to the originating client.             |
