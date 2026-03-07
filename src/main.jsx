/**
 * main.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Application entry point.
 *
 * Provider order (outermost → innermost):
 *   AuthProvider          — must wrap everything so all components can access auth state.
 *     NotificationProvider — depends on AuthProvider being present above it.
 *       App               — React Router tree.
 *
 * HOW TO EXTEND:
 *  - Add any future global providers (e.g. ThemeProvider, QueryClientProvider
 *    for React Query) inside this file, wrapping <App />.
 *  - If using React Query, add <QueryClientProvider client={queryClient}> as
 *    the outermost provider before AuthProvider.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AuthProvider from './contexts/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);

