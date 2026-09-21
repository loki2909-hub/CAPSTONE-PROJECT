import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket, Mail, Lock, ArrowLeft, ArrowRight, UserRound, Sparkles } from "lucide-react";
import API_BASE_URL from "../config/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed.");
        return;
      }

      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Register error:", error);
      alert("Unable to connect to the server.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <button type="button" className="back-home" onClick={() => navigate("/login")}>
          <ArrowLeft size={17} />
          Back to Login
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
                Join the club
              </div>
              <h1>Reserve your seat for what matters most.</h1>
              <p>Create your account and unlock curated events, fast checkouts, and premium access.</p>
            </div>
          </div>

          <div className="auth-card">
            <div className="auth-header">
              <span className="eyebrow">Create account</span>
              <h2>Register</h2>
            </div>

            <form onSubmit={handleRegister} className="auth-form">
              <label className="auth-field">
                <span>Full Name</span>
                <div className="auth-input">
                  <UserRound size={18} />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </label>

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
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </label>

              <label className="auth-field">
                <span>Confirm Password</span>
                <div className="auth-input">
                  <Lock size={18} />
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </label>

              <button type="submit" className="auth-primary-button">
                Create Account
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="auth-footer">
              <span>Already have an account?</span>
              <button type="button" onClick={() => navigate("/login")}>Sign In</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;