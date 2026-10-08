import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/login?email=${encodeURIComponent(
          email.trim().toLowerCase()
        )}&password=${encodeURIComponent(password)}`,
        {
          method: "POST",
        }
      );

      const result = await response.text();

      if (result === "Login successful") {
        localStorage.setItem(
          "stitchoraAdmin",
          JSON.stringify({
            email: email.trim().toLowerCase(),
            role: "ADMIN",
          })
        );

        navigate("/admin");
      } else {
        setError("Invalid admin credentials.");
      }
    } catch (error) {
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">

      {/* LEFT SIDE */}
      <div className="admin-login-left">

        <div className="admin-login-brand">
          STITCH<span>ORA</span>
        </div>

        <div className="admin-login-decoration">
          <span>✦</span>
          <span>✧</span>
          <span>✦</span>
        </div>

        <div className="admin-login-quote">
          <p>
            "Every beautiful garment begins
            with precision."
          </p>

          <span>
            — STITCHORA WORKROOM
          </span>
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="admin-login-right">

        <div className="admin-login-box">

          {/* BACK BUTTON */}
          <button
            className="admin-back-button"
            onClick={() => navigate("/login-selection")}
          >
            ← Back
          </button>

          {/* HEADING */}
          <div className="admin-login-heading">

            <p>
              STITCHORA WORKROOM
            </p>

            <h1>
              Admin
              <br />
              <span>Access.</span>
            </h1>

            <div className="admin-login-line"></div>

            <p className="admin-login-description">
              Sign in to manage your tailoring
              studio, customers and orders.
            </p>

          </div>

          {/* LOGIN FORM */}
          <form onSubmit={handleLogin}>

            {/* EMAIL */}
            <div className="admin-form-group">

              <label>
                ADMIN EMAIL
              </label>

              <input
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />

            </div>

            {/* PASSWORD */}
            <div className="admin-form-group">

              <label>
                PASSWORD
              </label>

              <div className="admin-password-wrapper">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="admin-login-error">
                {error}
              </div>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="admin-login-button"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Enter Workroom →"}
            </button>

          </form>

          {/* SIGNUP LINK */}
          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                color: "#76665d",
              }}
            >
              New administrator?
            </span>

            <button
              type="button"
              onClick={() => navigate("/admin-signup")}
              style={{
                border: "none",
                background: "none",
                color: "#a2764f",
                fontWeight: "600",
                cursor: "pointer",
                marginLeft: "6px",
                fontSize: "13px",
              }}
            >
              Create Account
            </button>
          </div>

          {/* NOTE */}
          <div className="admin-login-note">

            <span>✦</span>

            <p>
              Authorized STITCHORA administrators
              and tailoring staff only.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;