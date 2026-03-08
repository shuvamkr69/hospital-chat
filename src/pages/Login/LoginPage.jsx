import './LoginPage.css';
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function LoginPage() {
  const[email, setEmail] = useState("");
  const[password, setPassword]= useState("");

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleLogin = () => {
    setUser({ email });
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
    <h1>Hospital Chat</h1>
    <input 
    type="email" 
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    />

    <input 
    type="password" 
    placeholder="Password" 
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    />
    <button onClick={handleLogin}>Sign In</button>
    </div>
  );
}

export default LoginPage;
