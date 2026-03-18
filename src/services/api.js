import axios from "axios";

// ✅ Aligned with .env: VITE_API_BASE_URL (was using wrong VITE_API_URL)
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
  withCredentials: true, // ✅ required for cookie-based refresh token
});

// Track if we're currently refreshing token to avoid multiple refresh requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor — add access token to Authorization header
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for token refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            // Refresh failed, redirect to login
            localStorage.removeItem("accessToken");
            localStorage.removeItem("hc_user");
            window.location.href = "/login";
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the access token using refresh token
        const response = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);

        // Update default authorization header
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        isRefreshing = false;
        processQueue(null, accessToken);

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token expired or invalid
        localStorage.removeItem("accessToken");
        localStorage.removeItem("hc_user");
        isRefreshing = false;
        processQueue(refreshError, null);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// ── Auth endpoints ─────────────────────────────────────────────────────────
export const authApi = {
  signup: (fullName, email, password) =>
    api.post("/auth/signup", { fullName, email, password }),
  login: (email, password) => api.post("/auth/login", { email, password }),
  logout: () => api.post("/auth/logout"),
  checkAuth: () => api.get("/auth/check"),
  refresh: () => api.post("/auth/refresh"),
};

// ── Messages endpoints ─────────────────────────────────────────────────────
// ✅ Aligned with new backend routes (department-based)
export const messagesApi = {
  getByDepartment: (department) =>
    api.get(`/messages/department/${department}`),
  send: (payload) => api.post("/messages", payload), // { text, department, image? }
};

// ── Staff/Users endpoints ──────────────────────────────────────────────────
export const staffApi = {
  getAll: () => api.get("/messages/users"),
};

export default api;
