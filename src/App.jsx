import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import Login from "./Login";
import LoginSelection from "./LoginSelection";
import CustomerDashboard from "./CustomerDashboard";
import Appointment from "./Appointment";
import Measurement from "./Measurement";
import OrderTracking from "./OrderTracking";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";
import AdminSignup from "./AdminSignup";
import TailorLogin from "./TailorLogin";
import TailorDashboard from "./TailorDashboard";


// =====================================================
// HOME PAGE
// =====================================================

function Home() {
  const navigate = useNavigate();

  // =====================================================
  // BOOK APPOINTMENT
  // Logged in → Appointment
  // Not logged → Login Selection
  // =====================================================

  const handleBookAppointment = () => {
    const savedCustomer =
      localStorage.getItem("stitchoraCustomer");

    if (savedCustomer) {
      navigate("/appointment");
    } else {
      navigate("/login-selection");
    }
  };

  return (
    <div className="stitchora">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="navbar">

        <div className="brand">
          STITCH<span>ORA</span>
        </div>

        <nav>

          <a href="#home">
            Home
          </a>

          <a href="#experience">
            Experience
          </a>

          <a href="#services">
            Services
          </a>

          <a href="#about">
            About
          </a>

        </nav>

        <div className="nav-buttons">

          <Link
            to="/login-selection"
            className="login-btn"
          >
            Login
          </Link>

          <button
            className="book-btn"
            onClick={handleBookAppointment}
          >
            Book Appointment
          </button>

        </div>

      </header>


      {/* =================================================
          HERO — GRAND FASHION BACKGROUND
      ================================================= */}

      <section
        className="hero"
        id="home"
      >

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <p className="eyebrow">
            BESPOKE WOMEN'S TAILORING • PERSONAL STYLE
          </p>

          <h1>
            Crafted
            <br />
            <span>For You.</span>
          </h1>

          <p className="hero-description">
            Elegant women's wear designed around
            your measurements, your preferences
            and your personal style.
          </p>

          <div className="hero-actions">

            <button
              className="gold-btn"
              onClick={handleBookAppointment}
            >
              Book Your Appointment
              <span>→</span>
            </button>

            <a
              href="#experience"
              className="discover-btn"
            >
              Discover STITCHORA
            </a>

          </div>


          {/* Fashion categories */}

          <div className="hero-fashion-types">

            <span>SAREE</span>
            <i>•</i>

            <span>LEHENGA</span>
            <i>•</i>

            <span>KURTI</span>
            <i>•</i>

            <span>DRESS</span>
            <i>•</i>

            <span>SALWAR</span>
            <i>•</i>

            <span>BLOUSE</span>

          </div>

        </div>


        <div className="hero-side-text">

          <span>
            EST.
          </span>

          <strong>
            2026
          </strong>

          <small>
            WOMEN'S
            <br />
            TAILORING
          </small>

        </div>

      </section>


      {/* =================================================
          EXPERIENCE
      ================================================= */}

      <section
        className="experience-section"
        id="experience"
      >

        <div className="experience-content">

          <p className="section-label">
            THE STITCHORA EXPERIENCE
          </p>

          <h2>
            Your style deserves
            <br />
            <em>
              a perfect fit.
            </em>
          </h2>

          <p className="experience-description">
            At STITCHORA, every outfit begins with
            understanding you. From the first
            measurement to the final stitch, we create
            women's clothing that feels as personal
            as it looks.
          </p>

          <div className="experience-highlight">

            <span>
              SAREES
            </span>

            <span>
              BLOUSES
            </span>

            <span>
              DRESSES
            </span>

            <span>
              KURTIS
            </span>

            <span>
              SALWAR
            </span>

            <span>
              LEHENGAS
            </span>

          </div>

        </div>

      </section>


      {/* =================================================
          HOW IT WORKS
      ================================================= */}

      <section
        className="process"
        id="services"
      >

        <div className="process-heading">

          <p className="section-label">
            HOW IT WORKS
          </p>

          <h2>
            From idea to
            <span>
              perfection.
            </span>
          </h2>

        </div>


        <div className="process-steps">

          <div className="step">

            <span>
              01
            </span>

            <h3>
              Consult
            </h3>

            <p>
              Tell us what you envision
              and choose your preferred style.
            </p>

          </div>


          <div className="step-line"></div>


          <div className="step">

            <span>
              02
            </span>

            <h3>
              Measure
            </h3>

            <p>
              We carefully record your
              measurements for your perfect fit.
            </p>

          </div>


          <div className="step-line"></div>


          <div className="step">

            <span>
              03
            </span>

            <h3>
              Craft
            </h3>

            <p>
              Our tailoring process brings
              your design to life.
            </p>

          </div>


          <div className="step-line"></div>


          <div className="step">

            <span>
              04
            </span>

            <h3>
              Deliver
            </h3>

            <p>
              Your finished outfit is ready
              to become part of your story.
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          FINAL CTA
      ================================================= */}

      <section
        className="final-cta"
        id="about"
      >

        <div>

          <p className="section-label">
            YOUR NEXT LOOK AWAITS
          </p>

          <h2>
            Let's create something
            <br />
            <span>
              uniquely yours.
            </span>
          </h2>

          <p>
            Begin your STITCHORA experience with
            a personalised women's tailoring appointment.
          </p>

        </div>


        <button
          className="gold-btn"
          onClick={handleBookAppointment}
        >
          Start Your STITCHORA Journey →
        </button>

      </section>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="footer">

        <div className="footer-brand">

          <div className="brand">
            STITCH<span>ORA</span>
          </div>

          <p>
            Bespoke women's tailoring crafted around you.
          </p>

        </div>


        <div className="footer-column">

          <h4>
            Explore
          </h4>

          <a href="#home">
            Home
          </a>

          <a href="#experience">
            Experience
          </a>

          <a href="#services">
            Services
          </a>

        </div>


        <div className="footer-column">

          <h4>
            Experience
          </h4>

          <a href="#about">
            Our Story
          </a>

          <a href="#services">
            How It Works
          </a>

          <button
            onClick={handleBookAppointment}
          >
            Appointments
          </button>

        </div>


        <div className="footer-column">

          <h4>
            Connect
          </h4>

          <p>
            Hyderabad, India
          </p>

          <p>
            hello@stitchora.com
          </p>

        </div>


        <div className="footer-bottom">

          <span>
            © 2026 STITCHORA
          </span>

          <span>
            Crafted with precision.
          </span>

        </div>

      </footer>

    </div>
  );
}


// =====================================================
// APP
// =====================================================

function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* MAIN PAGE */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* LOGIN SELECTION */}

        <Route
          path="/login-selection"
          element={<LoginSelection />}
        />


        {/* CUSTOMER LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* CUSTOMER DASHBOARD */}

        <Route
          path="/customer"
          element={<CustomerDashboard />}
        />


        {/* APPOINTMENT */}

        <Route
          path="/appointment"
          element={<Appointment />}
        />


        {/* MEASUREMENTS */}

        <Route
          path="/measurement"
          element={<Measurement />}
        />


        {/* ORDER TRACKING */}

        <Route
          path="/order-tracking"
          element={<OrderTracking />}
        />


        {/* TAILOR LOGIN */}

        <Route
          path="/tailor-login"
          element={<TailorLogin />}
        />
        
          <Route
  path="/tailor"
  element={<TailorDashboard />}
/>

        {/* ADMIN LOGIN */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />
         <Route
  path="/admin-signup"
  element={<AdminSignup />}
/>

        {/* ADMIN DASHBOARD */}

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;