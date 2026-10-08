import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TailorLogin.css";

function TailorLogin() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    specialization: "",
    experience: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SIGN IN =================

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      alert("Please enter email and password.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/tailor-login",
        null,
        {
          params: {
            email: formData.email.trim(),
            password: formData.password,
          },
        }
      );

      if (response.data === "Login successful") {
        const tailorResponse = await axios.get(
          "http://localhost:8080/api/tailors"
        );

        const tailor = tailorResponse.data.find(
          (item) =>
            item.email &&
            item.email.toLowerCase() ===
              formData.email.trim().toLowerCase()
        );

        if (!tailor) {
          alert("Tailor account not found.");
          return;
        }

        localStorage.setItem(
          "stitchoraTailor",
          JSON.stringify({
            id: tailor.id,
            name: tailor.name,
            email: tailor.email,
            phone: tailor.phone,
            specialization: tailor.specialization,
            experience: tailor.experience,
          })
        );

        alert("Welcome to STITCHORA!");

        navigate("/tailor");
      } else {
        alert("Invalid email or password.");
      }
    } catch (error) {
      console.error("Tailor login error:", error);
      alert("Unable to login. Please try again.");
    }
  };

  // ================= SIGN UP =================

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim() ||
      !formData.phone.trim() ||
      !formData.specialization.trim() ||
      !formData.experience.trim()
    ) {
      alert("Please fill all details.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      alert("Phone number must contain exactly 10 digits.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Password and Confirm Password do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/tailor-signup",
        {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          phone: formData.phone.trim(),
          specialization: formData.specialization.trim(),
          experience: formData.experience.trim(),
        }
      );

      const tailor = response.data;

      localStorage.setItem(
        "stitchoraTailor",
        JSON.stringify({
          id: tailor.id,
          name: tailor.name,
          email: tailor.email,
          phone: tailor.phone,
          specialization: tailor.specialization,
          experience: tailor.experience,
        })
      );

      alert("Tailor account created successfully!");

      navigate("/tailor");
    } catch (error) {
      console.error("Tailor signup error:", error);

      if (
        error.response &&
        error.response.data === "Email already registered"
      ) {
        alert("This email is already registered.");
      } else {
        alert("Unable to create account. Please try again.");
      }
    }
  };

  return (
    <div className="tailor-login-page">

      <div className="tailor-login-card">

        {/* BRAND */}

        <div className="tailor-login-brand">

          <div className="tailor-logo">
            STITCHORA
          </div>

          <p>
            WOMEN'S TAILORING STUDIO
          </p>

        </div>


        {/* HEADING */}

        <div className="tailor-login-heading">

          <h1>
            {isSignup
              ? "Join STITCHORA"
              : "Welcome Back"}
          </h1>

          <p>
            {isSignup
              ? "Create your tailor account"
              : "Sign in to your tailor workspace"}
          </p>

        </div>


        {/* SIGN IN / SIGN UP */}

        <div className="tailor-mode-switch">

          <button
            type="button"
            className={!isSignup ? "active" : ""}
            onClick={() => setIsSignup(false)}
          >
            Sign In
          </button>

          <button
            type="button"
            className={isSignup ? "active" : ""}
            onClick={() => setIsSignup(true)}
          >
            Sign Up
          </button>

        </div>


        {/* FORM */}

        <form
          onSubmit={isSignup ? handleSignUp : handleSignIn}
          className="tailor-login-form"
        >

          {/* NAME */}

          {isSignup && (
            <div className="tailor-field">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />

            </div>
          )}


          {/* EMAIL */}

          <div className="tailor-field">

            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />

          </div>


          {/* PHONE */}

          {isSignup && (
            <div className="tailor-field">

              <label>
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                placeholder="10-digit phone number"
                maxLength="10"
                value={formData.phone}
                onChange={handleChange}
              />

            </div>
          )}


          {/* PASSWORD */}

          <div className="tailor-field">

            <label>
              Password
            </label>

            <div className="password-wrapper">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

          </div>


          {/* CONFIRM PASSWORD */}

          {isSignup && (
            <div className="tailor-field">

              <label>
                Confirm Password
              </label>

              <div className="password-wrapper">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="password-toggle"
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

            </div>
          )}


          {/* SPECIALIZATION */}

          {isSignup && (
            <div className="tailor-field">

              <label>
                Specialization
              </label>

              <input
                type="text"
                name="specialization"
                placeholder="e.g. Blouse Stitching"
                value={formData.specialization}
                onChange={handleChange}
              />

            </div>
          )}


          {/* EXPERIENCE */}

          {isSignup && (
            <div className="tailor-field">

              <label>
                Experience
              </label>

              <input
                type="text"
                name="experience"
                placeholder="e.g. 5 years"
                value={formData.experience}
                onChange={handleChange}
              />

            </div>
          )}


          {/* SUBMIT */}

          <button
            type="submit"
            className="tailor-submit"
          >
            {isSignup
              ? "Create Tailor Account"
              : "Sign In"}
          </button>

        </form>


        {/* BACK */}

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

export default TailorLogin;