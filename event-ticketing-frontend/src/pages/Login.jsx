import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ticket,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CalendarDays,
  MapPin,
} from "lucide-react";
import API_BASE_URL from "../config/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Invalid email or password.");
        return;
      }

      const token = data.token || data.accessToken || data.data?.token || data.data?.accessToken;

      if (!token) {
        console.log("Backend login response:", data);
        alert("Login successful, but token was not received.");
        return;
      }

      localStorage.setItem("token", token);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate("/home", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to the server.");
    }
  };

  const handleGuest = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/home", { replace: true });
  };

  return (
    <div className="auth-page login-page">
      <div className="auth-shell">
        <button type="button" className="back-home" onClick={() => navigate("/")}>
          <ArrowLeft size={17} />
          Back to Home
        </button>

        <div className="auth-panel">
          <div className="auth-visual">
            <div className="auth-visual-overlay" />
            <div className="auth-brand">
              <div className="auth-brand-icon">
                <Ticket size={24} />
              </div>
              <span>Evently</span>
            </div>

            <div className="auth-visual-copy">
              <div className="pulse-badge">
                <Sparkles size={16} />
                Curated experiences
              </div>
              <h1>Find your next unforgettable night.</h1>
              <p>Book live music, sports, theatre, and festivals with a premium seamless experience.</p>
            </div>

            <div className="auth-mini-cards">
              <div>
                <CalendarDays size={16} />
                <span>120+ events</span>
              </div>
              <div>
                <MapPin size={16} />
                <span>Across 12 cities</span>
              </div>
            </div>
          </div>

          <div className="auth-card">
            <div className="auth-header">
              <span className="eyebrow">Welcome back</span>
              <h2>Sign In</h2>
            </div>

            <form onSubmit={handleLogin} className="auth-form">
              <label className="auth-field">
                <span>Email Address</span>
                <div className="auth-input">
                  <Mail size={18} />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </label>

              <label className="auth-field">
                <span>Password</span>
                <div className="auth-input">
                  <Lock size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" className="show-password" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              <div className="auth-actions-row">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>

                <button type="button" className="link-button" onClick={() => alert("Password reset feature coming soon.")}>
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="auth-primary-button">
                Sign In
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="auth-footer">
              <span>New here?</span>
              <button type="button" onClick={() => navigate("/register")}>Create account</button>
            </div>

            <button type="button" className="secondary-link" onClick={handleGuest}>Continue as guest</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;