import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ticket,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Check
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

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

      alert("Account created successfully!");
      navigate("/login");

    } catch (error) {
      alert("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-glow register-glow-one"></div>
      <div className="register-glow register-glow-two"></div>

      <div className="register-wrapper">

        <button
          className="register-back"
          onClick={() => navigate("/login")}
        >
          <ArrowLeft size={17} />
          Back to Login
        </button>

        <div className="register-card">

          <div className="register-top">

            <div className="register-brand">
              <div className="register-logo">
                <Ticket size={23} />
              </div>

              <span>
                Event<span>ly</span>
              </span>
            </div>

            <div className="register-badge">
              <Check size={14} />
              Free to join
            </div>

          </div>

          <div className="register-heading">

            <h1>Create your account</h1>

            <p>
              Join Evently and discover concerts, sports,
              festivals and unforgettable experiences.
            </p>

          </div>

          <form onSubmit={handleRegister}>

            <div className="register-group">

              <label>Full Name</label>

              <div className="register-field">
                <User size={18} />

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

            </div>

            <div className="register-group">

              <label>Email Address</label>

              <div className="register-field">
                <Mail size={18} />

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

            </div>

            <div className="register-group">

              <label>Password</label>

              <div className="register-field">

                <Lock size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="register-eye"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            <div className="register-group">

              <label>Confirm Password</label>

              <div className="register-field">

                <Lock size={18} />

                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="register-eye"
                  onClick={() =>
                    setShowConfirm(!showConfirm)
                  }
                >
                  {showConfirm ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}

              {!loading && <ArrowRight size={18} />}
            </button>

          </form>

          <div className="register-footer">

            <span>Already have an account?</span>

            <button onClick={() => navigate("/login")}>
              Sign in
            </button>

          </div>

        </div>

        <p className="register-security">
          <Lock size={13} />
          Your information is securely protected
        </p>

        <p className="register-copy">
          © 2026 Evently · Event Ticketing & Seat Booking Platform
        </p>

      </div>

    </div>
  );
}

export default Register;