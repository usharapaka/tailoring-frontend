import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TailorDashboard.css";

function TailorDashboard() {
  const navigate = useNavigate();

  const [tailor, setTailor] = useState({});
const [appointments, setAppointments] = useState([]);
const [tailorStatus, setTailorStatus] = useState("Available");
  const [measurements, setMeasurements] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
const [editStatus, setEditStatus] = useState("");
const [editPrice, setEditPrice] = useState("");

  const [loading, setLoading] = useState(true);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [editProfile, setEditProfile] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
  });

  // =====================================================
  // LOAD TAILOR
  // =====================================================

  useEffect(() => {
    const savedTailor =
      JSON.parse(localStorage.getItem("stitchoraTailor")) || {};

    if (!savedTailor.id) {
      navigate("/tailor-login");
      return;
    }

    setTailor(savedTailor);

    setTailorStatus(savedTailor.status || "Available");

    setProfileForm({
      name: savedTailor.name || "",
      email: savedTailor.email || "",
      phone: savedTailor.phone || "",
      specialization: savedTailor.specialization || "",
      experience: savedTailor.experience || "",
    });

    loadTailorData(savedTailor.id);
  }, [navigate]);


  // =====================================================
  // LOAD ALL DATA FOR THIS TAILOR
  // =====================================================

  const loadTailorData = async (tailorId) => {
    try {

        // =================================================
        // LOAD APPOINTMENTS
        // =================================================

        const appointmentResponse = await axios.get(
            `http://localhost:8080/api/appointments/tailor/${tailorId}`
        );

        const allTailorAppointments = appointmentResponse.data;

        // Customer IDs must include hidden appointments also.
        // This keeps their measurements and orders assigned to this tailor.
        const assignedCustomerIds = allTailorAppointments
            .map(
                (appointment) =>
                    appointment.customer?.id
            )
            .filter(Boolean)
            .map(Number);

        // Only hide deleted appointments from Tailor Dashboard
        const visibleTailorAppointments =
            allTailorAppointments.filter(
                (appointment) =>
                    !appointment.hiddenFromTailor
            );

        setAppointments(visibleTailorAppointments);


        // =================================================
        // LOAD MEASUREMENTS
        // =================================================

        const measurementResponse = await axios.get(
            "http://localhost:8080/api/measurements"
        );

        const tailorMeasurements =
            measurementResponse.data.filter(
                (measurement) =>
                    assignedCustomerIds.includes(
                        Number(measurement.customer?.id)
                    ) &&
                    !measurement.hiddenFromTailor
            );

        setMeasurements(tailorMeasurements);


        // =================================================
        // LOAD ORDERS
        // =================================================

        const orderResponse = await axios.get(
            "http://localhost:8080/api/orders"
        );

        const tailorOrders =
            orderResponse.data.filter(
                (order) =>
                    Number(order.tailor?.id) === Number(tailorId) &&
                    assignedCustomerIds.includes(
                        Number(order.customer?.id)
                    ) &&
                    !order.hiddenFromTailor
            );

        setOrders(tailorOrders);

        // =================================================
// LOAD CUSTOMER RATINGS
// =================================================

const ratingResponse = await axios.get(
  `http://localhost:8080/api/ratings/tailor/${tailorId}`
);

setRatings(ratingResponse.data);

const freshRatings = ratingResponse.data;

setRatings(freshRatings);

if (freshRatings.length > 0) {
  const totalRating = freshRatings.reduce(
    (sum, item) => sum + Number(item.rating || 0),
    0
  );

  const averageRating = totalRating / freshRatings.length;

  setTailor((prev) => ({
    ...prev,
    rating: Number(averageRating.toFixed(1)),
    ratingCount: freshRatings.length,
  }));
} else {
  setTailor((prev) => ({
    ...prev,
    rating: 0,
    ratingCount: 0,
  }));
}


    } catch (error) {

        console.error(
            "Error loading tailor data:",
            error
        );

    } finally {

        setLoading(false);
    }
};

  // =====================================================
  // PROFILE
  // =====================================================

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };


  const handleEditProfile = () => {

    setShowProfileMenu(false);

    setProfileForm({
      name: tailor.name || "",
      email: tailor.email || "",
      phone: tailor.phone || "",
      specialization: tailor.specialization || "",
      experience: tailor.experience || "",
    });

    setEditProfile(true);
  };


  const handleSaveProfile = async (e) => {

    e.preventDefault();

    if (
      !profileForm.name.trim() ||
      !profileForm.email.trim() ||
      !profileForm.phone.trim() ||
      !profileForm.specialization.trim() ||
      !profileForm.experience.trim()
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
        `http://localhost:8080/api/tailors/${tailor.id}`,
        {
          name: profileForm.name.trim(),
          email: profileForm.email.trim().toLowerCase(),
          phone: profileForm.phone.trim(),
          specialization:
            profileForm.specialization.trim(),
          experience:
            profileForm.experience.trim(),
        }
      );


      const updatedTailor = response.data;


      const updatedLocalTailor = {
        id: updatedTailor.id,
        name: updatedTailor.name,
        email: updatedTailor.email,
        phone: updatedTailor.phone,
        specialization:
          updatedTailor.specialization,
        experience:
          updatedTailor.experience,
      };


      setTailor(updatedLocalTailor);


      localStorage.setItem(
        "stitchoraTailor",
        JSON.stringify(updatedLocalTailor)
      );


      setEditProfile(false);

      alert("Profile updated successfully!");


    } catch (error) {

      console.error(
        "Profile update error:",
        error
      );

      alert(
        "Unable to update profile. Please try again."
      );
    }
  };


// =====================================================
// TAILOR AVAILABILITY STATUS
// =====================================================

const handleStatusChange = async (e) => {
  const newStatus = e.target.value;

  try {
    const response = await axios.put(
      `http://localhost:8080/api/tailors/${tailor.id}/status?status=${encodeURIComponent(newStatus)}`
    );

    const updatedTailor = response.data;

    setTailorStatus(updatedTailor.status);

    const updatedLocalTailor = {
      ...tailor,
      status: updatedTailor.status,
    };

    setTailor(updatedLocalTailor);

    localStorage.setItem(
      "stitchoraTailor",
      JSON.stringify(updatedLocalTailor)
    );

    alert("Availability status updated successfully!");
  } catch (error) {
    console.error("Status update error:", error);
    alert("Unable to update availability status.");
  }
};



// =====================================================
// EDIT ORDER
// =====================================================

const openEditOrder = (order) => {

  setEditingOrder(order);

  setEditStatus(
    order.status || "Order Placed"
  );

  setEditPrice(
    order.price ?? ""
  );
};


const closeEditOrder = () => {

  setEditingOrder(null);

  setEditStatus("");

  setEditPrice("");
};


const updateTailorOrder = async () => {

  if (!editingOrder) {
    return;
  }

  if (!editStatus) {
    alert("Please select order status.");
    return;
  }

  if (editPrice === "") {
    alert("Please enter order price.");
    return;
  }

  try {

    await axios.put(
      `http://localhost:8080/api/orders/${editingOrder.id}`,
      {
        customer: editingOrder.customer
          ? {
              id: editingOrder.customer.id,
            }
          : undefined,

        tailor: editingOrder.tailor
          ? {
              id: editingOrder.tailor.id,
            }
          : {
              id: tailor.id,
            },

        dressType: editingOrder.dressType,

        status: editStatus,

        price: Number(editPrice),
      }
    );

    alert("Order updated successfully!");

    closeEditOrder();

    // Reload orders
    const response = await axios.get(
      "http://localhost:8080/api/orders"
    );

    const tailorOrders =
      response.data.filter(
        (order) =>
          Number(order.tailor?.id) ===
            Number(tailor.id)
      );

    setOrders(tailorOrders);

  } catch (error) {

    console.error(
      "Unable to update order:",
      error
    );

    alert(
      "Unable to update order. Please try again."
    );
  }
};


// =====================================================
// DELETE MEASUREMENT
// =====================================================

const handleDeleteMeasurement = async (measurement) => {

  const confirmed = window.confirm(
    `Are you sure you want to delete Measurement #${measurement.id}?`
  );

  if (!confirmed) {
    return;
  }

  try {

    await axios.delete(
      `http://localhost:8080/api/measurements/${measurement.id}`
    );

    alert("Measurement deleted successfully.");

    setMeasurements((currentMeasurements) =>
      currentMeasurements.filter(
        (item) => item.id !== measurement.id
      )
    );

  } catch (error) {

    console.error(
      "Unable to delete measurement:",
      error
    );

    alert(
      "Unable to delete measurement. Please try again."
    );
  }
};





const handleDeleteOrder = async (order) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete Order #${order.id}?`
  );

  if (!confirmed) return;

  try {
    await axios.delete(
      `http://localhost:8080/api/orders/${order.id}`
    );

    alert("Order deleted successfully.");

    setOrders((currentOrders) =>
      currentOrders.filter(
        (item) => item.id !== order.id
      )
    );
  } catch (error) {
    console.error("Unable to delete order:", error);
    alert("Unable to delete order. Please try again.");
  }
};



const handleRejectOrder = async (order) => {
  const confirmed = window.confirm(
    `Are you sure you want to reject Order #${order.id}?`
  );

  if (!confirmed) return;

  try {
    await axios.post(
      `http://localhost:8080/api/orders/${order.id}/reject`
    );

    alert("Order rejected successfully.");

    setOrders((currentOrders) =>
      currentOrders.map((item) =>
        item.id === order.id
          ? { ...item, status: "Rejected" }
          : item
      )
    );
  } catch (error) {
    console.error("Unable to reject order:", error);
    alert("Unable to reject order. Please try again.");
  }
};



const handleDeleteAppointment = async (appointment) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete this appointment?`
  );

  if (!confirmed) return;

  try {
    await axios.delete(
      `http://localhost:8080/api/appointments/${appointment.id}`
    );

    alert("Appointment deleted successfully.");

    setAppointments((currentAppointments) =>
      currentAppointments.filter(
        (item) => item.id !== appointment.id
      )
    );
  } catch (error) {
    console.error("Unable to delete appointment:", error);
    alert("Unable to delete appointment. Please try again.");
  }
};


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    localStorage.removeItem("stitchoraTailor");

    navigate("/tailor-login");
  };


  // =====================================================
  // INITIAL
  // =====================================================

  const getInitial = () => {

    if (!tailor.name) return "T";

    return tailor.name
      .charAt(0)
      .toUpperCase();
  };


  return (
    <div className="tailor-dashboard">


      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="tailor-navbar">

        <div className="tailor-brand">
          STITCH<span>ORA</span>
        </div>


        <div className="tailor-nav-right">

          <span className="tailor-name">
            {tailor.name || "Tailor"}
          </span>


          <div className="tailor-profile-wrapper">

            <button
              className="tailor-profile-icon"
              onClick={() =>
                setShowProfileMenu(
                  !showProfileMenu
                )
              }
            >
              {getInitial()}
            </button>


            {showProfileMenu && (

              <div className="tailor-profile-menu">

                <div className="profile-menu-header">

                  <div className="profile-menu-icon">
                    {getInitial()}
                  </div>


                  <div>

                    <strong>
                      {tailor.name || "Tailor"}
                    </strong>

                    <span>
                      {tailor.email || ""}
                    </span>

                  </div>

                </div>


                <button
                  className="profile-menu-edit"
                  onClick={handleEditProfile}
                >
                  ✎ Edit Profile
                </button>

              </div>

            )}

          </div>


          <button
            className="tailor-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>



      {/* =================================================
          MAIN
      ================================================= */}

      <main className="tailor-main">


        {/* =================================================
            WELCOME
        ================================================= */}

        <section className="tailor-welcome">

          <div>

            <p className="tailor-label">
              TAILOR WORKSPACE
            </p>


            <h1>
              Welcome,{" "}
              <span>
                {tailor.name || "Tailor"}
              </span>
            </h1>


            <p>
              Manage your appointments and customer
              tailoring requirements from one place.
            </p>

          </div>

        </section>



        {/* =================================================
            PROFILE
        ================================================= */}

        <section className="tailor-profile-section">

          <div className="section-heading">

            <p>
              MY PROFILE
            </p>


            <div className="profile-heading-row">

              <h2>
                Tailor Details
              </h2>


              <button
                className="edit-profile-button"
                onClick={handleEditProfile}
              >
                ✎ Edit Profile
              </button>

            </div>

          </div>


          <div className="tailor-profile-grid">

            <div className="profile-card">
              <span>Name</span>

              <strong>
                {tailor.name || "—"}
              </strong>
            </div>


            <div className="profile-card">
              <span>Email</span>

              <strong>
                {tailor.email || "—"}
              </strong>
            </div>


            <div className="profile-card">
              <span>Phone</span>

              <strong>
                {tailor.phone || "—"}
              </strong>
            </div>


            <div className="profile-card">
              <span>Specialization</span>

              <strong>
                {tailor.specialization ||
                  "General Tailoring"}
              </strong>
            </div>


            <div className="profile-card">
              <span>Experience</span>

              <strong>
                {tailor.experience || "—"}
              </strong>
            </div>

            <div className="profile-card">
  <span>Experience</span>

  <strong>
    {tailor.experience || "—"}
  </strong>
</div>

<div className="profile-card">
  <span>Availability</span>

  <select
    value={tailorStatus}
    onChange={handleStatusChange}
    className="tailor-status-select"
  >
    <option value="Available">Available</option>
    <option value="Busy">Busy</option>
    <option value="Offline">Offline</option>
  </select>
</div>

          </div>

        </section>



        {/* =================================================
            APPOINTMENTS
        ================================================= */}

        <section className="tailor-appointments-section">

          <div className="section-heading">

            <p>
              YOUR WORK
            </p>

            <h2>
              My Appointments
            </h2>

          </div>
            

          {loading ? (

            <div className="empty-tailor-state">
              Loading appointments...
            </div>

          ) : appointments.length === 0 ? (

            <div className="empty-tailor-state">

              <div className="empty-icon">
                ✂
              </div>

              <h3>
                No appointments yet
              </h3>

              <p>
                Customer appointments assigned to you
                will appear here.
              </p>

            </div>

          ) : (

            <div className="appointment-table-wrapper">

              <table className="tailor-appointment-table">

                <thead>

                  <tr>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>

                </thead>


                <tbody>

                  {appointments.map(
                    (appointment) => (

                      <tr key={appointment.id}>

                        <td>
                          {appointment.customer?.name ||
                            "Customer"}
                        </td>
                        
                        <td>
                          {appointment.appointmentDate ||
                            "—"}
                        </td>

                        <td>
                          {appointment.appointmentTime ||
                            "—"}
                        </td>

                        <td>
  <div className="appointment-status-actions">

    <span
      className={`appointment-status ${
        appointment.status
          ? appointment.status
              .toLowerCase()
              .replace(/\s+/g, "-")
          : ""
      }`}
    >
      {appointment.status || "Pending"}
    </span>

    <button
      type="button"
      className="tailor-delete-appointment-button"
      onClick={() => handleDeleteAppointment(appointment)}
    >
      Delete Appointment
    </button>

  </div>
</td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>


          
       {/* =================================================
    CUSTOMER REVIEWS
================================================= */}

<section className="tailor-reviews-section">
  <div className="section-heading">
    <p>CUSTOMER FEEDBACK</p>
    <h2>Customer Reviews</h2>
  </div>

  <div className="reviews-summary">
    <div className="reviews-average">
      <span className="reviews-big-rating">
        {tailor.rating > 0 ? tailor.rating.toFixed(1) : "0.0"}
      </span>

      <span className="reviews-stars">
        ★★★★★
      </span>

      <span className="reviews-count">
        {tailor.ratingCount || 0} reviews
      </span>
    </div>
  </div>

  {ratings.length === 0 ? (
    <div className="no-reviews">
      <div className="no-reviews-icon">★</div>
      <h3>No customer reviews yet</h3>
      <p>
        Customer ratings and comments will appear here after they review your work.
      </p>
    </div>
  ) : (
    <div className="reviews-list">
      {ratings.map((rating) => (
        <div className="review-card" key={rating.id}>
          
          <div className="review-card-top">
            <div className="review-customer">
              <div className="review-avatar">
                {(rating.customer?.name || "C").charAt(0).toUpperCase()}
              </div>

              <div>
                <h3>
                  {rating.customer?.name || "Customer"}
                </h3>

                <span>
                  Customer
                </span>
              </div>
            </div>

            <div className="review-rating">
              <span className="review-stars">
                {"★".repeat(rating.rating)}
                {"☆".repeat(5 - rating.rating)}
              </span>

              <span className="review-score">
                {rating.rating}/5
              </span>
            </div>
          </div>

          {rating.comment && (
            <p className="review-comment">
              “{rating.comment}”
            </p>
          )}
        </div>
      ))}
    </div>
  )}
</section>

        {/* =================================================
            CUSTOMER MEASUREMENTS
        ================================================= */}

        <section className="tailor-data-section">

          <div className="section-heading">

            <p>
              FIT & FORM
            </p>

            <div className="tailor-data-heading-row">

              <h2>
                Customer Measurements
              </h2>

              <span>
                {measurements.length} RECORDS
              </span>

            </div>

          </div>


          {measurements.length === 0 ? (

            <div className="tailor-data-empty">

              <div className="tailor-data-icon">
                ◈
              </div>

              <h3>
                No measurements yet
              </h3>

              <p>
                Measurements submitted by customers
                assigned to you will appear here.
              </p>

            </div>

          ) : (

            <div className="tailor-measurement-grid">

              {measurements.map(
                (measurement) => (

                  <div
                    className="tailor-measurement-card"
                    key={measurement.id}
                  >

                    <div className="tailor-measurement-header">

                      <div>

                        <span>
                          CUSTOMER
                        </span>

                        <h3>
                          {measurement.customer?.name ||
                            `Customer #${measurement.customer?.id}`}
                        </h3>

                      </div>


                      <span className="measurement-record">
                        #{measurement.id}
                      </span>

                    </div>


                    <div className="tailor-measurement-values">

                      <div>
                        <span>SHOULDER</span>
                        <strong>
                          {measurement.shoulder}
                        </strong>
                        <small>in</small>
                      </div>


                      <div>
                        <span>CHEST</span>
                        <strong>
                          {measurement.chest}
                        </strong>
                        <small>in</small>
                      </div>


                      <div>
                        <span>WAIST</span>
                        <strong>
                          {measurement.waist}
                        </strong>
                        <small>in</small>
                      </div>


                      <div>
                        <span>HIP</span>
                        <strong>
                          {measurement.hip}
                        </strong>
                        <small>in</small>
                      </div>


                      <div>
                        <span>SLEEVE</span>
                        <strong>
                          {measurement.sleeve}
                        </strong>
                        <small>in</small>
                      </div>


                      <div>
                        <span>LENGTH</span>
                        <strong>
                          {measurement.length}
                        </strong>
                        <small>in</small>
                      </div>

                      <button
  type="button"
  className="tailor-delete-measurement-button"
  onClick={() =>
    handleDeleteMeasurement(measurement)
  }
>
  Delete Measurement
</button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>



        {/* =================================================
            MY ORDERS
        ================================================= */}

        <section className="tailor-data-section">

          <div className="section-heading">

            <p>
              TAILORING WORK
            </p>

            <div className="tailor-data-heading-row">

              <h2>
                My Orders
              </h2>

              <span>
                {orders.length} ORDERS
              </span>

            </div>

          </div>


          {orders.length === 0 ? (

            <div className="tailor-data-empty">

              <div className="tailor-data-icon">
                ◇
              </div>

              <h3>
                No orders yet
              </h3>

              <p>
                Orders belonging to customers assigned
                to you will appear here.
              </p>

            </div>

          ) : (

            <div className="tailor-orders-list">

              {orders.map(
                (order) => (

                <div
  className="tailor-order-card"
  key={order.id}
>

  <div className="tailor-order-info">
    <span>ORDER</span>
    <h3>#{order.id}</h3>
  </div>

  <div className="tailor-order-info">
    <span>CUSTOMER</span>
    <strong>
      {order.customer?.name ||
        `Customer #${order.customer?.id}`}
    </strong>
  </div>

  <div className="tailor-order-info">
    <span>OUTFIT</span>
    <strong>
      {order.dressType ||
        "Custom Outfit"}
    </strong>
  </div>

  <div className="tailor-order-info">
    <span>STATUS</span>
    <strong className="tailor-order-status">
      {order.status ||
        "Pending"}
    </strong>
  </div>

  <div className="tailor-order-info">
    <span>PRICE</span>
    <strong>
      ₹{order.price ?? "—"}
    </strong>
  </div>

  <div className="tailor-order-actions">

    <button
      type="button"
      className="tailor-edit-order-button"
      onClick={() => openEditOrder(order)}
    >
      ✎ Edit Order
    </button>
  
   
   <button
  type="button"
  className="tailor-reject-order-button"
  onClick={() => handleRejectOrder(order)}
>
  Reject Order
</button>

    <button
      type="button"
      className="tailor-delete-order-button"
      onClick={() => handleDeleteOrder(order)}
    >
      Delete Order
    </button>

  </div>

</div>

                )
              )}

            </div>

          )}
           
              

             
          {editingOrder && (
  <div className="tailor-order-edit-form">

    <span className="tailor-order-edit-label">
      UPDATE ORDER #{editingOrder.id}
    </span>

    <h3>
      Update stitching details
    </h3>

    <div className="tailor-order-edit-fields">

      <div>
        <label>
          Order Status
        </label>

        <select
          value={editStatus}
          onChange={(e) =>
            setEditStatus(e.target.value)
          }
        >
          <option value="Order Placed">
            Order Placed
          </option>

          <option value="Confirmed">
            Confirmed
          </option>

          <option value="Stitching">
            Stitching
          </option>

          <option value="Quality Check">
            Quality Check
          </option>

          <option value="Completed">
            Completed
          </option>
        </select>
      </div>


      <div>
        <label>
          Order Price
        </label>

        <input
          type="number"
          min="0"
          value={editPrice}
          onChange={(e) =>
            setEditPrice(e.target.value)
          }
          placeholder="Enter price"
        />
      </div>

    </div>


    <div className="tailor-order-edit-actions">

      <button
        type="button"
        className="tailor-save-order-button"
        onClick={updateTailorOrder}
      >
        Save Changes
      </button>

      <button
        type="button"
        className="tailor-cancel-order-button"
        onClick={closeEditOrder}
      >
        Cancel
      </button>

    </div>

  </div>
)}




        </section>

      </main>



      {/* =================================================
          EDIT PROFILE MODAL
      ================================================= */}

      {editProfile && (

        <div className="edit-profile-overlay">

          <div className="edit-profile-modal">

            <div className="edit-modal-header">

              <div>

                <p>
                  MY PROFILE
                </p>

                <h2>
                  Edit Profile
                </h2>

              </div>


              <button
                className="edit-close-button"
                onClick={() =>
                  setEditProfile(false)
                }
              >
                ×
              </button>

            </div>


            <form
              onSubmit={handleSaveProfile}
              className="edit-profile-form"
            >

              <div className="edit-form-row">

                <div className="edit-field">

                  <label>
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                  />

                </div>


                <div className="edit-field">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                  />

                </div>

              </div>


              <div className="edit-form-row">

                <div className="edit-field">

                  <label>
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    maxLength="10"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                  />

                </div>


                <div className="edit-field">

                  <label>
                    Experience
                  </label>

                  <input
                    type="text"
                    name="experience"
                    value={profileForm.experience}
                    onChange={handleProfileChange}
                  />

                </div>

              </div>


              <div className="edit-field">

                <label>
                  Specialization
                </label>

                <input
                  type="text"
                  name="specialization"
                  value={profileForm.specialization}
                  onChange={handleProfileChange}
                />

              </div>


              <div className="edit-form-actions">

                <button
                  type="button"
                  className="cancel-edit"
                  onClick={() =>
                    setEditProfile(false)
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="save-profile"
                >
                  Save Changes
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default TailorDashboard;