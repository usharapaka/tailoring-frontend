import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("signin");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");

  const switchMode = (newMode) => {
    setMode(newMode);
    setMessage("");
    setPassword("");
    setConfirmPassword("");
  };

  // =====================================================
  // SIGN IN
  // =====================================================

  const handleSignIn = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        null,
        {
          params: {
            email: email.trim(),
            password: password,
          },
        }
      );

      if (response.data === "Login successful") {
        const customersResponse = await axios.get(
          "http://localhost:8080/api/customers"
        );

        const customer = customersResponse.data.find(
          (item) =>
            item.email?.toLowerCase() ===
            email.trim().toLowerCase()
        );

        if (!customer) {
          setMessage("Customer account was not found.");
          return;
        }

        localStorage.setItem(
          "stitchoraCustomer",
          JSON.stringify({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
          })
        );

        setMessage("Login successful!");

        setTimeout(() => {
          navigate("/customer");
        }, 700);

        return;
      }

      setMessage("Invalid email or password");

    } catch (error) {
      console.error("Login error:", error);
      setMessage("Invalid email or password");
    }
  };

  // =====================================================
  // SIGN UP
  // =====================================================

  const handleSignUp = async (e) => {
    e.preventDefault();

    setMessage("");

    // Confirm password
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    // Phone validation
    if (!/^[0-9]{10}$/.test(phone)) {
      setMessage("Phone number must contain exactly 10 digits.");
      return;
    }

    try {
      // Check if email already exists
      const customersResponse = await axios.get(
        "http://localhost:8080/api/customers"
      );

      const existingCustomer = customersResponse.data.find(
        (customer) =>
          customer.email?.toLowerCase() ===
          email.trim().toLowerCase()
      );

      if (existingCustomer) {
        setMessage(
          "Account already exists. Please use Sign In."
        );
        return;
      }

      // Create new customer
      const response = await axios.post(
        "http://localhost:8080/api/customers",
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          address: address.trim(),
          password: password,
        }
      );

      const customer = response.data;

      // Save logged-in customer
      localStorage.setItem(
        "stitchoraCustomer",
        JSON.stringify({
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
        })
      );

      setMessage("Account created successfully!");

      setTimeout(() => {
        navigate("/customer");
      }, 800);

    } catch (error) {
      console.error("Sign up error:", error);

      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage(
          "Unable to create account. Please try again."
        );
      }
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* BRAND */}

        <div className="login-brand">
          STITCH<span>ORA</span>
        </div>

        <p className="login-label">
          WELCOME TO STITCHORA
        </p>

        <h1>
          {mode === "signin"
            ? "Sign in to your account"
            : "Create your account"}
        </h1>

        <p className="login-subtitle">
          {mode === "signin"
            ? "Continue your personalised tailoring experience."
            : "Create your personalised tailoring profile."}
        </p>

        {/* MODE SWITCH */}

        <div className="login-mode-switch">

          <button
            type="button"
            className={
              mode === "signin"
                ? "login-mode-active"
                : ""
            }
            onClick={() => switchMode("signin")}
          >
            Sign In
          </button>

          <button
            type="button"
            className={
              mode === "signup"
                ? "login-mode-active"
                : ""
            }
            onClick={() => switchMode("signup")}
          >
            Sign Up
          </button>

        </div>

        {/* SIGN IN FORM */}

        {mode === "signin" && (
          <form onSubmit={handleSignIn}>

            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>
              Password
            </label>

            <div className="login-password-wrapper">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

              <button
                type="button"
                className="login-password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

            <button
              type="submit"
              className="login-submit"
            >
              Sign In →
            </button>

          </form>
        )}

        {/* SIGN UP FORM */}

        {mode === "signup" && (
          <form onSubmit={handleSignUp}>

            <label>
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>
              Password
            </label>

            <div className="login-password-wrapper">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

              <button
                type="button"
                className="login-password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

            <label>
              Confirm Password
            </label>

            <div className="login-password-wrapper">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />

              <button
                type="button"
                className="login-password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

            <label>
              Phone Number
            </label>

            <input
              type="tel"
              placeholder="Enter 10 digit phone number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              pattern="[0-9]{10}"
              maxLength="10"
              required
            />

            <label>
              Address
            </label>

            <textarea
              placeholder="Enter your address"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              rows="3"
              required
            />

            <button
              type="submit"
              className="login-submit"
            >
              Create Account →
            </button>

          </form>
        )}

        {/* PASSWORD HINT */}

        <p className="login-hint">
          {mode === "signup"
            ? "Create a password of your choice."
            : "Use your registered email and password."}
        </p>

        {/* MESSAGE */}

        {message && (
          <p className="login-message">
            {message}
          </p>
        )}

        {/* BACK HOME */}

        <button
          className="back-home"
          onClick={() => navigate("/")}
        >
          ← Back to STITCHORA
        </button>

      </div>

    </div>
  );
}

export default Login;