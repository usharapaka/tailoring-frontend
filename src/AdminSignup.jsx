import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminSignup.css";

function AdminSignup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/admin/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password,
          }),
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Admin signup failed");
      }

      setSuccess("Admin account created successfully!");

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/admin-login");
      }, 1200);

    } catch (error) {
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-signup-page">

      {/* LEFT SIDE */}
      <div className="admin-signup-left">

        <div className="admin-signup-brand">
          STITCH<span>ORA</span>
        </div>

        <div className="admin-signup-decoration">
          <span>✦</span>
          <span>✧</span>
          <span>✦</span>
        </div>

        <div className="admin-signup-quote">
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
      <div className="admin-signup-right">

        <div className="admin-signup-box">

          {/* BACK BUTTON */}
          <button
            className="admin-signup-back-button"
            onClick={() => navigate("/admin-login")}
          >
            ← Back to Login
          </button>

          {/* HEADING */}
          <div className="admin-signup-heading">

            <p>
              STITCHORA WORKROOM
            </p>

            <h1>
              Create Admin
              <br />
              <span>Account.</span>
            </h1>

            <div className="admin-signup-line"></div>

            <p className="admin-signup-description">
              Create your administrator account
              to manage the tailoring studio.
            </p>

          </div>

          {/* SIGNUP FORM */}
          <form onSubmit={handleSignup}>

            {/* NAME */}
            <div className="admin-signup-form-group">

              <label>
                ADMIN NAME
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
              />

            </div>

            {/* EMAIL */}
            <div className="admin-signup-form-group">

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
            <div className="admin-signup-form-group">

              <label>
                PASSWORD
              </label>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
              />

            </div>

            {/* CONFIRM PASSWORD */}
            <div className="admin-signup-form-group">

              <label>
                CONFIRM PASSWORD
              </label>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
              />

            </div>

            {/* SHOW PASSWORD */}
            <div className="admin-show-password">

              <label>
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() =>
                    setShowPassword(!showPassword)
                  }
                />

                Show password
              </label>

            </div>

            {/* ERROR */}
            {error && (
              <div className="admin-signup-error">
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="admin-signup-success">
                {success}
              </div>
            )}

            {/* SIGNUP BUTTON */}
            <button
              type="submit"
              className="admin-signup-button"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create Admin Account →"}
            </button>

          </form>

          {/* LOGIN LINK */}
          <div className="admin-signup-login-link">

            <p>
              Already have an admin account?
            </p>

            <button
              type="button"
              onClick={() => navigate("/admin-login")}
            >
              Sign in here
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminSignup;