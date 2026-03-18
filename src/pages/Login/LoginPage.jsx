import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../services/api";
import "./LoginPage.css";

function HeartbeatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await authApi.login(email, password);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Demo login (no backend needed)
  const handleDemoLogin = () => {
    login({
      id: "demo-001",
      name: "Dr. Sarah Jenkins",
      email: "dr.smith@hospital.com",
      role: "Doctor",
      department: "ICU",
      avatar: null,
      token: "demo-token",
    });
    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">
            <HeartbeatIcon />
          </div>
          <div style={{ textAlign: "center" }}>
            <div className="login-title">Hospital Chat</div>
            <div className="login-subtitle">Sign in to your account</div>
          </div>
        </div>

        {error && (
          <div className="login-error">
            <AlertIcon />
            <span>{error}</span>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="dr.smith@hospital.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <span className="login-btn-spinner" /> : null}
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="login-footer">
          Secured access for hospital staff only
        </div>
      </div>
    </div>
  );
}