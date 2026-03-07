#  HospitalChat

A real-time hospital department communication dashboard — similar to Slack or Microsoft Teams — where departments (ICU, Lab, Pharmacy, etc.) can communicate in real time.

---

##  Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Architecture Notes](#architecture-notes)

---

## Overview

HospitalChat is a React frontend (backed by a separate Node.js server) that provides:

- **Login Page** — authenticates hospital staff
- **Dashboard** — main view with department sidebar, chat area, and message input
- **Real-time messaging** — via Socket.IO
- **REST API communication** — via Axios

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev) | UI framework |
| [Vite](https://vite.dev) | Build tool & dev server |
| [React Router v7](https://reactrouter.com) | Client-side routing |
| [Axios](https://axios-http.com) | HTTP requests to the backend REST API |
| [Socket.IO Client](https://socket.io/docs/v4/client-api/) | Real-time WebSocket communication |
| Plain CSS (per-component `.css` files) | Styling |

---

## Project Structure

```
src/
 main.jsx                  # Entry point — mounts app with AuthProvider
 App.jsx                   # Root component — renders AppRoutes
 index.css                 # Global CSS reset & design tokens (:root variables)

 routes/
    AppRoutes.jsx         # All route definitions + root redirect logic

 pages/
    LoginPage.jsx         # Public login page
    LoginPage.css
    Dashboard.jsx         # Main authenticated dashboard
    Dashboard.css

 layouts/
    DashboardLayout.jsx   # Shell layout (Sidebar + Chat area + Input)
    DashboardLayout.css

 components/
    sidebar/
       Sidebar.jsx       # Department list navigation
       Sidebar.css
    chat/
       ChatHeader.jsx    # Active channel title bar
       ChatHeader.css
       ChatArea.jsx      # Scrollable message list
       ChatArea.css
       MessageInput.jsx  # Text input + send button
       MessageInput.css
    common/               # Shared reusable components (buttons, modals, avatars)

 contexts/
    AuthContext.jsx       # Global auth state — user, setUser
    SocketContext.jsx     # Global socket instance

 hooks/
    useSocket.js          # Custom hook for Socket.IO connection lifecycle

 services/
     api.js                # Axios instance — base URL + interceptors
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/shuvamkr69/hospital-chat.git
cd hospital-chat

# 2. Install dependencies
npm install

# 3. Create your environment file (see Environment Variables below)
cp .env.example .env

# 4. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite development server with HMR |
| `npm run build` | Bundle the app for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## Environment Variables

Create a `.env` file in the project root (never commit this file):

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

> All client-side env variables must be prefixed with `VITE_` to be exposed by Vite.

---

## Architecture Notes

### Auth & Routing

`AppRoutes.jsx` reads `user` from `AuthContext`:

- `user === null` (not logged in)  `/` redirects to `/login`
- `user !== null` (logged in)  `/` redirects to `/dashboard`

**To implement login:** call `setUser(userData)` from `AuthContext` after a successful API response.
**To implement logout:** call `setUser(null)`.

### Adding a New Page

1. Create `src/pages/MyPage.jsx` and a matching `MyPage.css`
2. Add a route in `src/routes/AppRoutes.jsx`:

```jsx
<Route path="/my-page" element={<MyPage />} />
```

### Adding a New Component

1. Create a folder under `src/components/` (e.g. `src/components/common/Avatar.jsx`)
2. Create a matching `.css` file next to it
3. Import the CSS inside the component: `import './Avatar.css'`

### API Calls

All HTTP calls go through `src/services/api.js`. Add functions there (e.g. `getMessages`, `sendMessage`) and import them into components or hooks as needed.

### Real-time (Socket.IO)

Use `src/hooks/useSocket.js` to manage the socket connection. The server URL is read from `VITE_SOCKET_URL` in `.env`.

---

> **Backend repository:** _add link here_
