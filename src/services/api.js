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
  withCredentials: true, // ✅ required for cookie-based JWT auth
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("hc_user");
      window.location.href = "/login";
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
