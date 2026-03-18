import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // ✅ Hydrate from localStorage on initial render (was buggy before)
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("hc_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (userData, accessToken) => {
    // ✅ Normalize backend shape (_id, fullName) → consistent shape
    const normalized = {
      id: userData._id,
      name: userData.fullName,
      email: userData.email,
      profilePic: userData.profilePic || null,
    };
    setUser(normalized);
    localStorage.setItem("hc_user", JSON.stringify(normalized));
    
    // ✅ Store access token for Authorization header
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Intentionally swallow network/logout endpoint errors;
      // client-side auth state must still be cleared.
    } finally {
      setUser(null);
      localStorage.removeItem("hc_user");
      localStorage.removeItem("accessToken");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
