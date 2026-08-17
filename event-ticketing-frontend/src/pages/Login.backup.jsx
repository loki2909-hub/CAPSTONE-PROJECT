import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ticket,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight
} from "lucide-react";

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
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Invalid email or password.");
        return;
      }

      const token =
        data.token ||
        data.accessToken ||
        data.data?.token ||
        data.data?.accessToken;

      if (!token) {
        console.log("Backend login response:", data);
        alert("Login successful, but token was not received.");
        return;
      }

      localStorage.setItem("token", token);

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      navigate("/home", { replace: true });

    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to the server.");
    }
  };

  return (
    <div>
      <div className="login-decoration decoration-one"></div>
      <div className="login-decoration decoration-two"></div>

      <div className="login-wrapper">

        <button
          className="back-home"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={17} />
          Back to Home
        </button>

        <div className="login-card">

          <div className="login-brand">

            <div className="login-brand-icon">
              <Ticket size={25} />
            </div>

            <span>
              Event<span>ly</span>
            </span>

          </div>

          <div className="login-heading">

            <h1>
              Welcome Back
            </h1>

            <p>
              Sign in to discover and book
              unforgettable experiences.
            </p>

          </div>

          <form onSubmit={handleLogin}>

            <div className="login-form-group">

              <label>
                Email Address
              </label>

              <div className="login-input">

                <Mail size={18} />

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

              </div>

            </div>

            <div className="login-form-group">

              <div className="password-header">

                <label>
                  Password
                </label>

                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "Password reset feature coming soon."
                    )
                  }
                >
                  Forgot password?
                </button>

              </div>

              <div className="login-input">

                <Lock size={18} />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="show-password"
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

            <div className="remember-row">

              <label className="remember">

                <input type="checkbox" />

                <span>
                  Remember me
                </span>

              </label>

            </div>

            <button
              type="submit"
              className="login-main-button"
            >
              Sign In
              <ArrowRight size={18} />
            </button>

          </form>

          <div className="login-or">

            <span></span>

            <p>
              OR
            </p>

            <span></span>

          </div>

          <button
            className="guest-login"
            onClick={() => navigate("/")}
          >
            Continue as Guest
          </button>

          <div className="create-account">

            <span>
              Don't have an account?
            </span>

            <button
              onClick={() =>
                navigate("/register")
              }
            >
              Create Account
            </button>

          </div>

        </div>

        <p className="login-copyright">
          © 2026 Evently · Secure event ticketing platform
        </p>

      </div>
    </div>
  );
}

export default Login;