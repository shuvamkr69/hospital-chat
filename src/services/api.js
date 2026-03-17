import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor — attach auth token
api.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem("hc_user");
    if (stored) {
      const user = JSON.parse(stored);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("hc_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
};

// Messages endpoints
export const messagesApi = {
  getByDepartment: (department) => api.get(`/messages/${department}`),
  send: (payload) => api.post("/messages", payload),
};

// Staff endpoints
export const staffApi = {
  getByDepartment: (department) => api.get(`/staff/${department}`),
};

export default api;