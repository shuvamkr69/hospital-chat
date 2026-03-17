import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("hc_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hc_user");
  };

  // Restore session on mount
  const storedUser = localStorage.getItem("hc_user");
  const initialUser = user ?? (storedUser ? JSON.parse(storedUser) : null);

  return (
    <AuthContext.Provider value={{ user: initialUser, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}