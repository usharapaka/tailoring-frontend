import { useNavigate } from "react-router-dom";
import "./LoginSelection.css";

function LoginSelection() {
  const navigate = useNavigate();

  return (
    <div className="login-selection">

      <div className="selection-overlay">

        {/* BRAND */}

        <div className="selection-brand">
          STITCH<span>ORA</span>
        </div>


        {/* CONTENT */}

        <div className="selection-content">

          <p className="selection-eyebrow">
            WELCOME TO STITCHORA
          </p>

          <h1>
            How would you like
            <br />
            to <span>continue?</span>
          </h1>

          <p className="selection-description">
            Choose your account type to continue to
            your personalized STITCHORA experience.
          </p>


          {/* LOGIN CARDS */}

          <div className="login-options">

            {/* CUSTOMER */}

            <div
              className="login-option customer-option"
              onClick={() => navigate("/login")}
            >

              <div className="option-icon">
                ♡
              </div>

              <div className="option-content">

                <p>
                  FOR CUSTOMERS
                </p>

                <h2>
                  Customer Login
                </h2>

                <span>
                  Book appointments, save measurements,
                  view orders and track your outfits.
                </span>

              </div>

              <div className="option-arrow">
                →
              </div>

            </div>


            {/* ADMIN */}

            <div
              className="login-option admin-option"
              onClick={() => navigate("/admin-login")}
            >

              <div className="option-icon">
                ✦
              </div>

              <div className="option-content">

                <p>
                  FOR ADMIN
                </p>

                <h2>
                  Admin Login
                </h2>

                <span>
                  Manage customers, measurements,
                  appointments and tailoring orders.
                </span>

              </div>

              <div className="option-arrow">
                →
              </div>

            </div>


            {/* TAILOR */}

            <div
              className="login-option tailor-option"
              onClick={() => navigate("/tailor-login")}
            >

              <div className="option-icon">
                ✂
              </div>

              <div className="option-content">

                <p>
                  FOR TAILORS
                </p>

                <h2>
                  Tailor Login
                </h2>

                <span>
                  Sign in or create your tailor account
                  and manage your tailoring work.
                </span>

              </div>

              <div className="option-arrow">
                →
              </div>

            </div>

          </div>


          <button
            className="back-home"
            onClick={() => navigate("/")}
          >
            ← Back to STITCHORA
          </button>

        </div>


        {/* FOOTER */}

        <div className="selection-footer">
          <span>
            PRIVATE TAILORING • PERSONAL FIT • TIMELESS STYLE
          </span>
        </div>

      </div>

    </div>
  );
}

export default LoginSelection;