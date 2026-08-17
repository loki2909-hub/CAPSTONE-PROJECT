import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

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
    <div className="login-wrapper">
      <button
        className="back-home"
        onClick={() => navigate("/login")}
      >
        ← Back to Login
      </button>

      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand-icon">
            🎟
          </div>
          <span>Evently</span>
        </div>

        <div className="login-heading">
          <h1>Create Account</h1>
          <p>
            Create your Evently account and start
            booking unforgettable experiences.
          </p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="login-form-group">
            <label>Full Name</label>

            <div className="login-input">
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="login-form-group">
            <label>Email Address</label>

            <div className="login-input">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="login-form-group">
            <label>Password</label>

            <div className="login-input">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="login-form-group">
            <label>Confirm Password</label>

            <div className="login-input">
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />
            </div>
          </div>

          <button
            type="submit"
            className="login-main-button"
          >
            Create Account →
          </button>
        </form>

        <div className="create-account">
          <span>Already have an account?</span>

          <button onClick={() => navigate("/login")}>
            Sign In
          </button>
        </div>
      </div>

      <p className="login-copyright">
        © 2026 Evently · Secure event ticketing platform
      </p>
    </div>
  );
}

export default Register;