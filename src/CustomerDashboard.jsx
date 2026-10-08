import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./CustomerDashboard.css";

function CustomerDashboard() {
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [measurements, setMeasurements] = useState([]);

  const [hiddenOrderIds, setHiddenOrderIds] = useState([]);
const [hiddenAppointmentIds, setHiddenAppointmentIds] = useState([]);
const [hiddenMeasurementIds, setHiddenMeasurementIds] = useState([]);

  // ================= PLACE ORDER =================

const [showPlaceOrder, setShowPlaceOrder] = useState(false);

const [orderDressType, setOrderDressType] = useState("");

const [selectedTailor, setSelectedTailor] = useState(
  JSON.parse(
    localStorage.getItem("stitchoraSelectedTailor")
  ) || {}
);

  const [tailors, setTailors] = useState([]);
  const [ratingTailor, setRatingTailor] = useState(null);
const [customerRating, setCustomerRating] = useState(0);
const [ratingComment, setRatingComment] = useState("");

  // =====================================================
  // CUSTOMER ID
  // Temporary customer ID
  // =====================================================

  const savedCustomer =
  JSON.parse(localStorage.getItem("stitchoraCustomer")) || {};

const customerId = savedCustomer.id;
const [showProfile, setShowProfile] = useState(false);
const [editProfile, setEditProfile] = useState(false);

const [profileForm, setProfileForm] = useState({
  name: savedCustomer.name || "",
  email: savedCustomer.email || "",
  phone: savedCustomer.phone || "",
  address: savedCustomer.address || "",
});

const handleProfileChange = (e) => {
  setProfileForm({
    ...profileForm,
    [e.target.name]: e.target.value,
  });
};

const handleSaveProfile = async () => {
  if (
    !profileForm.name.trim() ||
    !profileForm.email.trim() ||
    !profileForm.phone.trim() ||
    !profileForm.address.trim()
  ) {
    alert("Please fill all profile details.");
    return;
  }

  if (!/^[0-9]{10}$/.test(profileForm.phone.trim())) {
    alert("Phone number must contain exactly 10 digits.");
    return;
  }

  try {
    const response = await axios.put(
      `http://localhost:8080/api/customers/${customerId}`,
      {
        name: profileForm.name.trim(),
        email: profileForm.email.trim(),
        phone: profileForm.phone.trim(),
        address: profileForm.address.trim(),
      }
    );

    const updatedCustomer = response.data;

    localStorage.setItem(
      "stitchoraCustomer",
      JSON.stringify({
        id: updatedCustomer.id,
        name: updatedCustomer.name,
        email: updatedCustomer.email,
        phone: updatedCustomer.phone,
        address: updatedCustomer.address,
      })
    );

    setEditProfile(false);
    setShowProfile(true);

    alert("Profile updated successfully!");

    window.location.reload();
  } catch (error) {
    console.error("Profile update error:", error);
    alert("Unable to update profile. Please try again.");
  }
};

  // =====================================================
  // ORDER PROGRESS
  // =====================================================

  const getOrderProgress = (status) => {
    const stages = [
  "Order Placed",
  "Confirmed",
  "Stitching",
  "Quality Check",
  "Completed",
];

    const current = status?.toLowerCase() || "order placed";

    const index = stages.indexOf(current);

    return index >= 0 ? index : 0;
  };

  // =====================================================
  // LOAD ALL DATA
  // =====================================================

  useEffect(() => {
    loadOrders();
    loadAppointments();
    loadMeasurements();
     loadTailors();
  }, []);

  // =====================================================
  // LOAD ORDERS
  // =====================================================

 const loadOrders = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/api/orders"
    );

    const customerOrders = response.data.filter(
    (order) =>
        Number(order.customer?.id) === Number(customerId) &&
        !hiddenOrderIds.includes(Number(order.id))
);

setOrders(customerOrders);
  } catch (error) {
    console.error("Unable to load orders:", error);
  }
};

  // =====================================================
  // LOAD APPOINTMENTS
  // =====================================================

  const loadAppointments = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/api/appointments"
    );

    const customerAppointments = response.data.filter(
    (appointment) =>
        Number(appointment.customer?.id) === Number(customerId) &&
        !hiddenAppointmentIds.includes(Number(appointment.id))
);

setAppointments(customerAppointments);
  } catch (error) {
    console.error("Unable to load appointments:", error);
  }
};

  // =====================================================
  // LOAD MEASUREMENTS
  // =====================================================

 const loadMeasurements = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/api/measurements"
    );

    const customerMeasurements = response.data.filter(
    (measurement) =>
        Number(measurement.customer?.id) === Number(customerId) &&
        !hiddenMeasurementIds.includes(Number(measurement.id))
);

setMeasurements(customerMeasurements);
  } catch (error) {
    console.error("Unable to load measurements:", error);
  }
};


const handleCustomerDeleteOrder = (order) => {
    if (!window.confirm("Remove this order from your dashboard?")) return;

    const currentHidden =
        JSON.parse(
            localStorage.getItem(`stitchoraHiddenOrders_${customerId}`)
        ) || [];

    const updatedHidden = [
        ...new Set([...currentHidden, Number(order.id)])
    ];

    localStorage.setItem(
        `stitchoraHiddenOrders_${customerId}`,
        JSON.stringify(updatedHidden)
    );

    setHiddenOrderIds(updatedHidden);

    setOrders((current) =>
        current.filter((item) => Number(item.id) !== Number(order.id))
    );
};

const handleCustomerDeleteMeasurement = (measurement) => {
    if (!window.confirm("Remove this measurement from your dashboard?")) return;

    const currentHidden =
        JSON.parse(
            localStorage.getItem(`stitchoraHiddenMeasurements_${customerId}`)
        ) || [];

    const updatedHidden = [
        ...new Set([...currentHidden, Number(measurement.id)])
    ];

    localStorage.setItem(
        `stitchoraHiddenMeasurements_${customerId}`,
        JSON.stringify(updatedHidden)
    );

    setHiddenMeasurementIds(updatedHidden);

    setMeasurements((current) =>
        current.filter(
            (item) => Number(item.id) !== Number(measurement.id)
        )
    );
};

const handleCustomerDeleteAppointment = (appointment) => {
    if (!window.confirm("Remove this appointment from your dashboard?")) return;

    const currentHidden =
        JSON.parse(
            localStorage.getItem(`stitchoraHiddenAppointments_${customerId}`)
        ) || [];

    const updatedHidden = [
        ...new Set([...currentHidden, Number(appointment.id)])
    ];

    localStorage.setItem(
        `stitchoraHiddenAppointments_${customerId}`,
        JSON.stringify(updatedHidden)
    );

    setHiddenAppointmentIds(updatedHidden);

    setAppointments((current) =>
        current.filter(
            (item) => Number(item.id) !== Number(appointment.id)
        )
    );
};


const handlePlaceOrder = async () => {

  // Customer check
  if (!customerId) {
    alert("Customer information not found. Please login again.");
    return;
  }

  // Tailor check
  if (!selectedTailor.id) {
    alert(
      "Please select a tailor from your Customer Dashboard first."
    );
    return;
  }

  // Dress type check
  if (!orderDressType) {
    alert("Please select a dress type.");
    return;
  }

  try {

    await axios.post(
      "http://localhost:8080/api/orders",
      {
        customer: {
          id: Number(customerId),
        },

        tailor: {
          id: Number(selectedTailor.id),
        },

        dressType: orderDressType,

        status: "Order Placed",

        price: null,
      }
    );

    alert("Order placed successfully!");

    setOrderDressType("");
    setShowPlaceOrder(false);

    // Reload orders
    const response = await axios.get(
      "http://localhost:8080/api/orders"
    );

    const customerOrders = response.data.filter(
      (order) =>
        Number(order.customer?.id) ===
        Number(customerId)
    );

    setOrders(customerOrders);

  } catch (error) {

    console.error(
      "Unable to place order:",
      error
    );

    alert(
      "Unable to place order. Please try again."
    );
  }
};

// =====================================================
// LOAD ALL TAILORS
// =====================================================

const loadTailors = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/api/tailors"
    );

    setTailors(response.data);

  } catch (error) {
    console.error("Unable to load tailors:", error);
  }
};


const handleSubmitRating = async () => {
  if (!ratingTailor) {
    return;
  }

  if (!customerRating) {
    alert("Please select a rating.");
    return;
  }

  try {
    await axios.post(
      "http://localhost:8080/api/ratings",
      null,
      {
        params: {
          customerId: customerId,
          tailorId: ratingTailor.id,
          rating: customerRating,
          comment: ratingComment.trim() || null,
        },
      }
    );

    alert("Rating submitted successfully!");

    setRatingTailor(null);
    setCustomerRating(0);
    setRatingComment("");

    await loadTailors();

  } catch (error) {
    console.error("Rating submission error:", error);

   const errorData = error.response?.data;

let errorMessage = "Unable to submit rating.";

if (typeof errorData === "string") {
  errorMessage = errorData;
} else if (errorData?.message) {
  errorMessage = errorData.message;
} else if (errorData?.error) {
  errorMessage = errorData.error;
}

alert(errorMessage);
  }
};

  // =====================================================
  // LATEST APPOINTMENT
  // =====================================================

  const latestAppointment =
    appointments.length > 0
      ? appointments[appointments.length - 1]
      : null;

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "—";

    const appointmentDate = new Date(
      `${date}T00:00:00`
    );

    return appointmentDate
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="customer-dashboard">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="customer-navbar">

        <div className="customer-brand">
          STITCH<span>ORA</span>
        </div>

        <nav>
          <Link to="/customer">
            Home
          </Link>

          <a href="#collections">
            Collections
          </a>

          <a href="#orders">
            My Orders
          </a>

          <a href="#appointments">
            Appointments
          </a>
        </nav>

        <div className="customer-actions">

  <button
    className="customer-profile-button"
    onClick={() => setShowProfile(!showProfile)}
  >
    <span className="profile-icon">♙</span>
    {savedCustomer.name || "Profile"}
  </button>

  <button
    className="customer-logout"
    onClick={() => {
      localStorage.removeItem("stitchoraCustomer");
      navigate("/login");
    }}
  >
    Logout
  </button>

</div>

      </header>

      {showProfile && (
  <div className="customer-profile-overlay">

    <div className="customer-profile-card">

      <button
        className="customer-profile-close"
        onClick={() => setShowProfile(false)}
      >
        ×
      </button>

      <p className="customer-profile-eyebrow">
        STITCHORA CUSTOMER
      </p>

      <h2>
        My <span>Profile</span>
      </h2>

      <div className="customer-profile-line"></div>

      {!editProfile ? (
  <>
    <div className="customer-profile-details">
      <div>
        <span>NAME</span>
        <strong>{savedCustomer.name || "—"}</strong>
      </div>

      <div>
        <span>EMAIL</span>
        <strong>{savedCustomer.email || "—"}</strong>
      </div>

      <div>
        <span>PHONE</span>
        <strong>{savedCustomer.phone || "—"}</strong>
      </div>

      <div>
        <span>ADDRESS</span>
        <strong>{savedCustomer.address || "—"}</strong>
      </div>

      <div>
        <span>CUSTOMER ID</span>
        <strong>#{savedCustomer.id || "—"}</strong>
      </div>
    </div>

    <button
      className="customer-profile-edit-button"
      onClick={() => {
        setProfileForm({
          name: savedCustomer.name || "",
          email: savedCustomer.email || "",
          phone: savedCustomer.phone || "",
          address: savedCustomer.address || "",
        });

        setEditProfile(true);
      }}
    >
      Edit Profile
    </button>

    <button
      className="customer-profile-close-bottom"
      onClick={() => setShowProfile(false)}
    >
      Close Profile
    </button>
  </>
) : (
  <>
    <div className="customer-profile-edit-form">

      <label>NAME</label>
      <input
        type="text"
        name="name"
        value={profileForm.name}
        onChange={handleProfileChange}
      />

      <label>EMAIL</label>
      <input
        type="email"
        name="email"
        value={profileForm.email}
        onChange={handleProfileChange}
      />

      <label>PHONE</label>
      <input
        type="tel"
        name="phone"
        value={profileForm.phone}
        onChange={handleProfileChange}
        maxLength="10"
      />

      <label>ADDRESS</label>
      <textarea
        name="address"
        value={profileForm.address}
        onChange={handleProfileChange}
        rows="3"
      />

    </div>

    <button
      className="customer-profile-save-button"
      onClick={handleSaveProfile}
    >
      Save Changes
    </button>

    <button
      className="customer-profile-cancel-button"
      onClick={() => setEditProfile(false)}
    >
      Cancel
    </button>
  </>
)}
</div>
  </div>
)}


      {/* =================================================
          HERO
      ================================================= */}

      <section className="customer-hero">

        <div className="customer-hero-content">

          <p className="customer-eyebrow">
            THE STITCHORA EXPERIENCE
          </p>

          <h1>
            Your style.
            <br />
            <span>Your perfect fit.</span>
          </h1>

          <p>
            Discover personalised tailoring designed around
            your measurements, your preferences and your style.
          </p>

          <div className="customer-hero-buttons">

            <Link
              to="/appointment"
              state={{ customerId }}
              className="customer-primary-btn"
            >
              Book an Appointment →
            </Link>

            <a href="#collections">
              <button className="customer-secondary-btn">
                Explore Collections
              </button>
            </a>

          </div>

        </div>


        <div className="customer-hero-decoration">

          <span>STITCH</span>

          <strong>
            ORA
          </strong>

        </div>

      </section>


      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <section className="quick-section">

        <div className="dashboard-section-heading">

          <p>
            YOUR STITCHORA
          </p>

          <h2>
            What would you like to do?
          </h2>

        </div>


        <div className="quick-grid">

          {/* APPOINTMENT */}

          <div className="quick-card">

            <div className="quick-icon">
              ✦
            </div>

            <h3>
              Book Appointment
            </h3>

            <p>
              Schedule a personal consultation with our
              tailoring team.
            </p>

            <Link
              to="/appointment"
              state={{ customerId }}
            >
              Book Now →
            </Link>

          </div>


          {/* MEASUREMENTS */}

          <div className="quick-card measurement-quick-card">

            <div className="quick-icon">
              ◈
            </div>

            <span className="quick-card-label">
              FIT & FORM
            </span>

            <h3>
              My Measurements
            </h3>

            <p>
              View and manage your personalised body
              measurements.
            </p>

            <Link
              to="/measurement"
              state={{ customerId }}
            >
              View Measurements →
            </Link>

          </div>


          {/* ORDERS */}

          <div className="quick-card">

            <div className="quick-icon">
              ◇
            </div>

            <h3>
              My Orders
            </h3>

            <p>
              Track your current stitching orders and status.
            </p>

            <a href="#orders">
              Track Orders →
            </a>

          </div>

        </div>

      </section>


      {/* =================================================
          COLLECTIONS
      ================================================= */}

      <section
        className="customer-collections"
        id="collections"
      >

        <div className="dashboard-section-heading">

          <p>
            EXPLORE OUR STYLE
          </p>

          <h2>
            Find your
            <span> signature look.</span>
          </h2>

        </div>


        <div className="customer-collection-grid">

          <div className="customer-collection saree">

            <div>
              <span>01</span>

              <h3>
                Elegant Sarees
              </h3>

              <p>
                Graceful. Timeless. Personal.
              </p>
            </div>

          </div>


          <div className="customer-collection blouse">

            <div>
              <span>02</span>

              <h3>
                Designer Blouses
              </h3>

              <p>
                Made for your silhouette.
              </p>
            </div>

          </div>


          <div className="customer-collection dress">

            <div>
              <span>03</span>

              <h3>
                Custom Dresses
              </h3>

              <p>
                Designed around you.
              </p>
            </div>

          </div>


          <div className="customer-collection formal">

            <div>
              <span>04</span>

              <h3>
                Formal Wear
              </h3>

              <p>
                Sharp. Elegant. Refined.
              </p>
            </div>

          </div>

        </div>

      </section>


            {/* =================================================
          TAILOR TEAM
      ================================================= */}

      <section className="customer-tailors-section">

        <div className="dashboard-section-heading">

          <p>
            OUR TAILORING TEAM
          </p>

          <h2>
            Choose your <span>tailor.</span>
          </h2>

        </div>


        <div className="customer-tailor-grid">

          {tailors.length === 0 ? (

            <div className="customer-tailor-empty">

              <span>STITCHORA</span>

              <h3>
                No tailors available
              </h3>

              <p>
                Our tailoring team will appear here.
              </p>

            </div>

          ) : (

            tailors.map((tailor) => (

              <div
                className={`customer-tailor-card ${
                  selectedTailor?.id === tailor.id
                    ? "selected"
                    : ""
                }`}
                key={tailor.id}
              >

                <div className="tailor-card-top">

                  <div className="tailor-avatar">
                    {tailor.name
                      ? tailor.name
                          .charAt(0)
                          .toUpperCase()
                      : "T"}
                  </div>

                  {selectedTailor?.id === tailor.id && (
                    <span className="selected-tailor-badge">
                      SELECTED
                    </span>
                  )}

                </div>


                <div className="tailor-card-content">

                  <p className="tailor-card-label">
                    STITCHORA TAILOR
                  </p>

                  <h3>
                    {tailor.name || "Tailor"}
                  </h3>

                  <p className="tailor-specialization">
                    {tailor.specialization ||
                      "General Tailoring"}
                  </p>
                     
                 
                 <div
  className={`tailor-availability ${
    (tailor.status || "Available").toLowerCase()
  }`}
>
  <span className="availability-dot"></span>

  <span>
    {tailor.status || "Available"}
  </span>
</div>
                
                  <div className="tailor-card-details">

                    <span>
                      {tailor.experience ||
                        "Experienced"}
                    </span>

                    <span>
                      •
                    </span>

                    <span>
                      {tailor.phone || "Contact available"}
                    </span>

                  </div>


                 <div className="tailor-rating">
  <span>★</span>

  <strong>
    {tailor.rating > 0 ? tailor.rating.toFixed(1) : "New"}
  </strong>

  {tailor.ratingCount > 0 && (
    <small>
      ({tailor.ratingCount} reviews)
    </small>
  )}
</div>


                  <button
                    className="select-tailor-button"
                    onClick={() => {
                      setSelectedTailor(tailor);

                      localStorage.setItem(
                        "stitchoraSelectedTailor",
                        JSON.stringify({
                          id: tailor.id,
                          name: tailor.name,
                          email: tailor.email,
                          specialization:
                            tailor.specialization,
                        })
                      );

                      alert(
                        `${tailor.name} selected as your tailor.`
                      );
                    }}
                  >
                    {selectedTailor?.id === tailor.id
                      ? "✓ Selected Tailor"
                      : "Select Tailor →"}
                  </button>

                  <button
  type="button"
  className="rate-tailor-button"
  onClick={() => {
    setRatingTailor(tailor);
    setCustomerRating(0);
    setRatingComment("");
  }}
>
  ★ Rate Tailor
</button>

                </div>

              </div>

            ))

          )}

        </div>

      </section>

      {/* =================================================
    RATE TAILOR POPUP
================================================= */}

{ratingTailor && (
  <div className="rating-popup-overlay">

    <div className="rating-popup">

      <button
        type="button"
        className="rating-popup-close"
        onClick={() => {
          setRatingTailor(null);
          setCustomerRating(0);
          setRatingComment("");
        }}
      >
        ×
      </button>

      <p className="rating-popup-label">
        STITCHORA TAILOR
      </p>

      <h2>
        Rate {ratingTailor.name}
      </h2>

      <p className="rating-popup-text">
        How was your tailoring experience?
      </p>

      <div className="rating-stars">

        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={
              star <= customerRating
                ? "rating-star active"
                : "rating-star"
            }
            onClick={() => setCustomerRating(star)}
          >
            ★
          </button>
        ))}

      </div>

      <p className="rating-selected-text">
        {customerRating === 0
          ? "Select your rating"
          : `${customerRating} out of 5`}
      </p>

      <textarea
        className="rating-comment"
        placeholder="Write a comment (optional)"
        value={ratingComment}
        onChange={(e) =>
          setRatingComment(e.target.value)
        }
        rows="4"
      />

      <div className="rating-popup-actions">

        <button
          type="button"
          className="rating-cancel-button"
          onClick={() => {
            setRatingTailor(null);
            setCustomerRating(0);
            setRatingComment("");
          }}
        >
          Cancel
        </button>

        <button
          type="button"
          className="rating-submit-button"
          onClick={handleSubmitRating}
        >
          Submit Rating
        </button>

      </div>

    </div>

  </div>
)}



      {/* =================================================
    ORDERS
================================================= */}

<section
  className="customer-orders-premium"
  id="orders"
>

  <div className="dashboard-section-heading customer-orders-heading">

    <div>

      <p>
        YOUR ORDERS
      </p>

      <h2>
        Recent stitching
      </h2>

    </div>

    <div className="customer-orders-heading-actions">

      <span>
        {orders.length} ORDERS
      </span>

      <button
        type="button"
        className="customer-place-order-button"
        onClick={() => setShowPlaceOrder(!showPlaceOrder)}
      >
        {showPlaceOrder
          ? "Close Order Form"
          : "+ Place New Order"}
      </button>

    </div>

  </div>


  {/* PLACE NEW ORDER FORM */}

  {showPlaceOrder && (

    <div className="customer-place-order-form">

      <span>
        NEW STITCHING ORDER
      </span>

      <h3>
        Choose your outfit
      </h3>

      <p>
        Your selected tailor:
        <strong>
          {" "}
          {selectedTailor.name || "No tailor selected"}
        </strong>
      </p>


      {!selectedTailor.id ? (

        <p>
          Please select a tailor from the Customer Dashboard first.
        </p>

      ) : (

        <>

          <select
            value={orderDressType}
            onChange={(e) =>
              setOrderDressType(e.target.value)
            }
          >

            <option value="">
              Select dress type
            </option>

            <option value="Blouse">
              Blouse
            </option>

            <option value="Saree Blouse">
              Saree Blouse
            </option>

            <option value="Dress">
              Dress
            </option>

            <option value="Salwar Suit">
              Salwar Suit
            </option>

            <option value="Kurti">
              Kurti
            </option>

            <option value="Other">
              Other
            </option>

          </select>


          <div className="customer-place-order-actions">

            <button
              type="button"
              className="customer-place-order-confirm"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>


            <button
              type="button"
              className="customer-place-order-cancel"
              onClick={() => {
                setShowPlaceOrder(false);
                setOrderDressType("");
              }}
            >
              Cancel
            </button>

          </div>

        </>

      )}

    </div>

  )}


  {/* EXISTING ORDERS */}

  {orders.length === 0 ? (

    <div className="customer-empty-order">

      <span>
        YOUR STITCHORA
      </span>

      <h3>
        No orders yet
      </h3>

      <p>
        Your stitching orders will appear here once
        you place an order.
      </p>

    </div>

  ) : (

    <div className="customer-order-list">

      {orders.map((order) => {

        const progress =
          getOrderProgress(order.status);

        const isRejected =
  order.status?.toLowerCase() === "rejected";

const stages = isRejected
  ? ["Order Rejected"]
  : [
      "Order Placed",
      "Confirmed",
      "Stitching",
      "Quality Check",
      "Completed",
    ];

        return (

          <div
            className="customer-order-card"
            key={order.id}
          >

            {/* HEADER */}

            <div className="customer-order-header">

              <div className="customer-order-id">

                <span>
                  ORDER
                </span>

                <strong>
                  #{order.id}
                </strong>

              </div>


              <div className="customer-order-outfit">

                <span>
                  OUTFIT
                </span>

                <h3>
                  {order.dressType || "Custom Outfit"}
                </h3>

              </div>


              <div className="customer-order-price">

                <span>
                  ORDER VALUE
                </span>

                <strong>
                  ₹{order.price ?? "—"}
                </strong>

              </div>


              <div
                className={`customer-order-status ${
                  order.status
                    ?.toLowerCase()
                    .replace(/\s+/g, "-")
                }`}
              >
                {order.status || "Pending"}
              </div>

            </div>


            {/* PROGRESS */}

            <div className="customer-order-progress">

              {stages.map((stage, index) => (

                <div
                  className={`customer-progress-stage ${
                    index < progress
                      ? "completed"
                      : index === progress
                      ? "current"
                      : ""
                  }`}
                  key={stage}
                >

                  <div className="customer-progress-dot">

                    {index < progress
                      ? "✓"
                      : index + 1}

                  </div>

                  <span>
                    {stage}
                  </span>

                  {index < stages.length - 1 && (

                    <div className="customer-progress-line"></div>

                  )}

                </div>

              ))}

            </div>


            {/* FOOTER */}

            <div className="customer-order-footer">

              <div>

                <span>
                  CURRENT STAGE
                </span>

                <strong>
                  {stages[progress]}
                </strong>

              </div>


              <button
                type="button"
                className="customer-track-button"
                onClick={() =>
                  navigate(
                    "/order-tracking",
                    {
                      state: { order },
                    }
                  )
                }
              >
                Track Order →
              </button>
    
              
              <button
    type="button"
    className="customer-delete-button"
    onClick={() => handleCustomerDeleteOrder(order)}
>
    Delete
</button>


            </div>

          </div>

        );

      })}

    </div>

  )}

</section>


      {/* =================================================
          MEASUREMENTS
      ================================================= */}

      <section
        className="customer-measurements-premium"
        id="measurements"
      >

        <div className="dashboard-section-heading">

          <div>

            <p>
              FIT & FORM
            </p>

            <h2>
              Your measurements
            </h2>

          </div>

          <span>
            {measurements.length} RECORDS
          </span>

        </div>


        {measurements.length === 0 ? (

          <div className="customer-measurement-empty">

            <span>
              PRECISION FIT
            </span>

            <h3>
              No measurements saved yet
            </h3>

            <p>
              Add your measurements to create a
              personalised fit.
            </p>

            <Link
              to="/measurement"
              state={{ customerId }}
            >
              Add Measurements →
            </Link>

          </div>

        ) : (

          <div className="customer-measurement-list">

            {measurements.map((measurement) => (

              <div
                className="customer-measurement-card"
                key={measurement.id}
              >

                {/* HEADER */}

                <div className="customer-measurement-header">

                  <div>

                    <span>
                      MEASUREMENT RECORD
                    </span>

                    <h3>
                      #{measurement.id}
                    </h3>

                  </div>


                  <div className="customer-measurement-badge">

                    <span>
                      CUSTOMER
                    </span>

                    <strong>
                      #{measurement.customer?.id || customerId}
                    </strong>

                  </div>

                </div>


                {/* VALUES */}

                <div className="customer-measurement-values">

                  <div>
                    <span>SHOULDER</span>
                    <strong>{measurement.shoulder}</strong>
                    <small>in</small>
                  </div>

                  <div>
                    <span>CHEST</span>
                    <strong>{measurement.chest}</strong>
                    <small>in</small>
                  </div>

                  <div>
                    <span>WAIST</span>
                    <strong>{measurement.waist}</strong>
                    <small>in</small>
                  </div>

                  <div>
                    <span>HIP</span>
                    <strong>{measurement.hip}</strong>
                    <small>in</small>
                  </div>

                  <div>
                    <span>SLEEVE</span>
                    <strong>{measurement.sleeve}</strong>
                    <small>in</small>
                  </div>

                  <div>
                    <span>LENGTH</span>
                    <strong>{measurement.length}</strong>
                    <small>in</small>
                  </div>

                </div>


                {/* FOOTER */}

                <div className="customer-measurement-footer">

                  <span>
                    PRECISION FIT • STITCHORA
                  </span>

                  <strong>
                    Customer #
                    {measurement.customer?.id || customerId}
                  </strong>

                 <button
    type="button"
    className="customer-edit-button"
    onClick={() => navigate("/measurement", {
        state: {
            customerId,
            measurementId: measurement.id,
            measurement
        }
    })}
>
    Edit
</button>

                 <button
    type="button"
    className="customer-delete-button"
    onClick={() => handleCustomerDeleteMeasurement(measurement)}
>
    Delete
</button>
                 
                </div>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* =================================================
          APPOINTMENT
      ================================================= */}

      <section
        className="customer-appointment-premium"
        id="appointments"
      >

        <div className="customer-appointment-intro">

          <p>
            UPCOMING APPOINTMENT
          </p>

          <h2>
            Your fitting
            <br />
            <span>awaits.</span>
          </h2>

          <div className="appointment-gold-line"></div>

          <small>
            A personalised fitting experience,
            prepared especially for you.
          </small>

        </div>


        {latestAppointment ? (

          <div className="customer-appointment-card">

            <div className="appointment-card-top">

              <span>
                STITCHORA FITTING
              </span>

              <strong>
                BOOKING #{latestAppointment.id}
              </strong>

            </div>


            <div className="appointment-details">

              <div className="appointment-detail">

                <span>
                  DATE
                </span>

                <strong>
                  {formatDate(
                    latestAppointment.appointmentDate
                  )}
                </strong>

              </div>


              <div className="appointment-detail">

                <span>
                  TIME
                </span>

                <strong>
                  {latestAppointment.appointmentTime}
                </strong>

              </div>


              <div className="appointment-detail">

                <span>
                  STATUS
                </span>

                <div className="customer-appointment-status">

                  <i></i>

                  {latestAppointment.status || "Booked"}

                </div>

              </div>

            </div>


            <div className="appointment-card-bottom">

              <span>
                YOUR PERSONAL FITTING
              </span>

              <button
                onClick={loadAppointments}
              >
                Refresh Appointment →
              </button>
             
            <button
    type="button"
    className="customer-delete-button"
    onClick={() =>
        handleCustomerDeleteAppointment(latestAppointment)
    }
>
    Delete
</button>

            </div>

          </div>

        ) : (

          <div className="customer-no-appointment">

            <div>

              <span>
                STITCHORA FITTING
              </span>

              <h3>
                No appointment booked
              </h3>

              <p>
                Schedule a personal consultation with
                our tailoring team.
              </p>

            </div>


            <Link
              to="/appointment"
              state={{ customerId }}
            >
              Book Appointment →
            </Link>

          </div>

        )}

      </section>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="customer-footer">

        <div className="customer-footer-brand">

          <div className="customer-brand">
            STITCH<span>ORA</span>
          </div>

          <p>
            Your style. Your measurements. Your perfect fit.
          </p>

        </div>


        <div>

          <h4>
            STITCHORA
          </h4>

          <p>
            Personal Tailoring
          </p>

          <p>
            Custom Designs
          </p>

          <p>
            Perfect Fits
          </p>

        </div>


        <div>

          <h4>
            CONTACT
          </h4>

          <p>
            Hyderabad, India
          </p>

          <p>
            hello@stitchora.com
          </p>

        </div>


        <div className="customer-footer-bottom">
          © 2026 STITCHORA · Crafted with precision.
        </div>

      </footer>

    </div>
  );
}

export default CustomerDashboard;