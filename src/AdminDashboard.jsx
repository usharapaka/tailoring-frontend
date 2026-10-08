import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

const API = "http://localhost:8080/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [tailors, setTailors] = useState([]);

  const [activeSection, setActiveSection] = useState("overview");
  const [loading, setLoading] = useState(false);

  const [editingOrder, setEditingOrder] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [showAddOrder, setShowAddOrder] = useState(false);

  const [newOrder, setNewOrder] = useState({
  customerId: "",
  dressType: "",
  price: "",
  status: "Pending",
});

  // ================= LOAD ALL DATA =================

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${API}/customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error("Customers API error:", error);
    }

    try {
      const response = await axios.get(`${API}/measurements`);
      setMeasurements(response.data);
    } catch (error) {
      console.error("Measurements API error:", error);
    }

    try {
      const response = await axios.get(`${API}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error("Orders API error:", error);
    }

    try {
      const response = await axios.get(`${API}/appointments`);
      setAppointments(response.data);
    } catch (error) {
      console.error("Appointments API error:", error);
    }

    try {
      const response = await axios.get(`${API}/tailors`);
      setTailors(response.data);
    } catch (error) {
      console.error("Tailors API error:", error);
    }

    setLoading(false);
  };

  // ================= STATISTICS =================

  const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.price || 0),
    0
  );

  const completedOrders = orders.filter(
    (order) => order.status?.toLowerCase() === "completed"
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.status?.toLowerCase() === "pending"
  ).length;

  // ================= EDIT ORDER =================

  const openEditOrder = (order) => {
    setEditingOrder(order);
    setEditStatus(order.status || "Pending");
    setEditPrice(order.price ?? "");
  };

  const closeEditOrder = () => {
    setEditingOrder(null);
    setEditStatus("");
    setEditPrice("");
  };

  const updateOrder = async () => {
    if (!editingOrder) return;

    try {
      await axios.put(`${API}/orders/${editingOrder.id}`, {
        customer: editingOrder.customer
          ? { id: editingOrder.customer.id }
          : undefined,
        dressType: editingOrder.dressType,
        status: editStatus,
        price: Number(editPrice),
      });

      alert("Order updated successfully!");

      closeEditOrder();
      loadAllData();
    } catch (error) {
      console.error("Unable to update order:", error);
      alert("Unable to update order. Please check the backend.");
    }
  };


// ================= CREATE NEW ORDER =================

const handleNewOrderChange = (event) => {
  setNewOrder({
    ...newOrder,
    [event.target.name]: event.target.value,
  });
};

const closeAddOrder = () => {
  setShowAddOrder(false);

  setNewOrder({
    customerId: "",
    dressType: "",
    price: "",
    status: "Pending",
  });
};

const createOrder = async () => {
  if (!newOrder.customerId) {
    alert("Please select a customer.");
    return;
  }

  if (!newOrder.dressType.trim()) {
    alert("Please enter dress type.");
    return;
  }

  if (newOrder.price === "") {
    alert("Please enter the price.");
    return;
  }

  if (Number(newOrder.price) <= 0) {
    alert("Please enter a valid price.");
    return;
  }

  try {
    await axios.post(`${API}/orders`, {
      customer: {
        id: Number(newOrder.customerId),
      },
      dressType: newOrder.dressType.trim(),
      status: newOrder.status,
      price: Number(newOrder.price),
    });

    alert("Order created successfully!");

    closeAddOrder();

    await loadAllData();

  } catch (error) {
    console.error("Unable to create order:", error);

    alert(
      "Unable to create order. Please check the backend and try again."
    );
  }
};

  // ================= DELETE ORDER =================

  const deleteOrder = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/orders/${id}`);

      alert("Order deleted successfully!");

      loadAllData();
    } catch (error) {
      console.error("Unable to delete order:", error);
      alert("Unable to delete order.");
    }
  };

  // ================= DELETE CUSTOMER =================

  const deleteCustomer = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/customers/${id}`);

      alert("Customer deleted successfully!");

      loadAllData();
    } catch (error) {
      console.error("Unable to delete customer:", error);

      alert(
        "Customer could not be deleted. They may have linked records."
      );
    }
  };

  // ================= SCROLL =================

  const scrollToSection = (section) => {
    setActiveSection(section);

    const element = document.getElementById(section);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
   
// ================= ORDER PROGRESS =================

const getOrderProgress = (status) => {
  const stages = [
    "pending",
    "confirmed",
    "stitching",
    "quality check",
    "completed",
  ];

  const current = status?.toLowerCase() || "pending";

  return stages.indexOf(current);
};

  // ================= UI =================

  return (
    <div className="admin-dashboard">

      {/* ================= NAVBAR ================= */}

      <header className="admin-navbar">

        <div className="admin-brand">
          STITCH<span>ORA</span>
          <small>ADMIN STUDIO</small>
        </div>

        <nav>

          <button
            onClick={() => scrollToSection("overview")}
            className={activeSection === "overview" ? "active" : ""}
          >
            Overview
          </button>

          <button
            onClick={() => scrollToSection("orders")}
            className={activeSection === "orders" ? "active" : ""}
          >
            Orders
          </button>

          <button
            onClick={() => scrollToSection("customers")}
            className={activeSection === "customers" ? "active" : ""}
          >
            Customers
          </button>

          <button
            onClick={() => scrollToSection("measurements")}
            className={activeSection === "measurements" ? "active" : ""}
          >
            Measurements
          </button>

          <button
            onClick={() => scrollToSection("appointments")}
            className={activeSection === "appointments" ? "active" : ""}
          >
            Appointments
          </button>

        </nav>

        <button
          className="admin-logout"
          onClick={() => navigate("/")}
        >
          Exit
        </button>

      </header>


      {/* ================= HERO ================= */}

      <section
        className="admin-hero"
        id="overview"
      >

        <div>

          <p className="admin-eyebrow">
            STITCHORA MANAGEMENT STUDIO
          </p>

          <h1>
            Crafting
            <br />
            <span>perfection.</span>
          </h1>

          <p className="admin-hero-text">
            Manage customers, measurements, appointments,
            orders and your tailoring workflow from one place.
          </p>

          <button
            className="admin-refresh"
            onClick={loadAllData}
          >
            {loading ? "Refreshing..." : "↻ Refresh Dashboard"}
          </button>

        </div>

        <div className="admin-hero-mark">
          <span>STITCH</span>
          <strong>ORA</strong>
        </div>

      </section>


      {/* ================= STATISTICS ================= */}

      <section className="admin-stats">

        <div className="admin-stat-card">
          <span>TOTAL CUSTOMERS</span>
          <strong>{customers.length}</strong>
          <p>Registered clients</p>
        </div>

        <div className="admin-stat-card">
          <span>TOTAL ORDERS</span>
          <strong>{orders.length}</strong>
          <p>{pendingOrders} pending orders</p>
        </div>

        <div className="admin-stat-card">
          <span>COMPLETED ORDERS</span>
          <strong>{completedOrders}</strong>
          <p>Successfully completed</p>
        </div>

        <div className="admin-stat-card">
          <span>ORDER VALUE</span>
          <strong>₹{totalRevenue}</strong>
          <p>Current order value</p>
        </div>

      </section>


      {/* ================= QUICK ACTIONS ================= */}

      <section className="admin-quick-actions">

        <div className="admin-section-heading">

          <div>
            <p>ADMIN TOOLS</p>
            <h2>Quick Actions</h2>
          </div>

          <span>MANAGE STITCHORA</span>

        </div>

        <div className="quick-action-grid">

          <button
            className="quick-action-card"
            onClick={() => scrollToSection("customers")}
          >

            <div className="quick-action-icon">
              +
            </div>

            <div>
              <strong>Customers</strong>
              <span>View & manage customers</span>
            </div>

            <b>→</b>

          </button>


          <button
            className="quick-action-card"
            onClick={() => scrollToSection("orders")}
          >

            <div className="quick-action-icon">
              ◈
            </div>

            <div>
              <strong>Orders</strong>
              <span>Track tailoring orders</span>
            </div>

            <b>→</b>

          </button>


          <button
            className="quick-action-card"
            onClick={() => scrollToSection("measurements")}
          >

            <div className="quick-action-icon">
              ⌁
            </div>

            <div>
              <strong>Measurements</strong>
              <span>View customer measurements</span>
            </div>

            <b>→</b>

          </button>


          <button
            className="quick-action-card"
            onClick={() => scrollToSection("appointments")}
          >

            <div className="quick-action-icon">
              ◷
            </div>

            <div>
              <strong>Appointments</strong>
              <span>Manage appointments</span>
            </div>

            <b>→</b>

          </button>

        </div>

      </section>


      {/* ================= ORDERS ================= */}

<section
  className="admin-section orders-premium-section"
  id="orders"
>

  <div className="admin-section-heading">

  <div>
    <p>WORKROOM</p>
    <h2>Order management</h2>
  </div>

  <div className="admin-order-heading-actions">

    <span>{orders.length} ORDERS</span>

    <button
      className="admin-view-button"
      onClick={() => setShowAddOrder(true)}
    >
      + New Order
    </button>

  </div>

</div>


  {orders.length === 0 ? (

    <div className="admin-empty">
      No orders available.
    </div>

  ) : (

    <div className="premium-order-list">

      {orders.map((order) => {

        const progress = getOrderProgress(order.status);

        const stages = [
          "Order Placed",
          "Confirmed",
          "Stitching",
          "Quality Check",
          "Completed",
        ];

        return (

          <div
            className="premium-order-card"
            key={order.id}
          >

            {/* ORDER HEADER */}

            <div className="premium-order-header">

              <div className="premium-order-id">

                <span>ORDER</span>

                <strong>
                  #{order.id}
                </strong>

              </div>


              <div className="premium-order-outfit">

                <span>OUTFIT</span>

                <h3>
                  {order.dressType}
                </h3>

              </div>


              <div className="premium-order-price">

                <span>ORDER VALUE</span>

                <strong>
                  ₹{order.price ?? "—"}
                </strong>

              </div>


              <div
                className={`premium-status ${
                  order.status
                    ?.toLowerCase()
                    .replace(/\s+/g, "-")
                }`}
              >
                {order.status || "Pending"}
              </div>

            </div>


            {/* PROGRESS */}

            <div className="order-progress">

              {stages.map((stage, index) => (

                <div
                  className={`progress-stage ${
                    index < progress
                      ? "completed"
                      : index === progress
                      ? "current"
                      : ""
                  }`}
                  key={stage}
                >

                  <div className="progress-dot">
                    {index < progress ? "✓" : index + 1}
                  </div>

                  <span>
                    {stage}
                  </span>

                  {index < stages.length - 1 && (
                    <div className="progress-line">
                    </div>
                  )}

                </div>

              ))}

            </div>


            {/* FOOTER */}

            <div className="premium-order-footer">

              <div>

                <span>CURRENT STAGE</span>

                <strong>
                  {stages[progress >= 0 ? progress : 0]}
                </strong>

              </div>


              <div className="order-actions">

                <button
                  className="admin-view-button"
                  onClick={() => openEditOrder(order)}
                >
                  Edit Order
                </button>

                <button
                  className="admin-delete-button"
                  onClick={() => deleteOrder(order.id)}
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        );

      })}

    </div>

  )}

</section>


     {/* ================= CUSTOMERS ================= */}

<section
  className="admin-section customers-premium-section"
  id="customers"
>

  <div className="admin-section-heading">

    <div>
      <p>CLIENTS</p>
      <h2>Customer management</h2>
    </div>

    <span>{customers.length} CLIENTS</span>

  </div>


  {customers.length === 0 ? (

    <div className="admin-empty">
      No customers available.
    </div>

  ) : (

    <div className="premium-customer-grid">

      {customers.map((customer) => {

        const customerMeasurements = measurements.filter(
          (measurement) =>
            measurement.customer?.id === customer.id
        );

        const customerOrders = orders.filter(
          (order) =>
            order.customer?.id === customer.id
        );

        return (

          <div
            className="premium-customer-card"
            key={customer.id}
          >

            {/* CUSTOMER TOP */}

            <div className="premium-customer-top">

              <div className="premium-customer-avatar">

                {customer.name
                  ? customer.name.charAt(0).toUpperCase()
                  : "C"}

              </div>


              <div className="premium-customer-title">

                <span>
                  CUSTOMER #{customer.id}
                </span>

                <h3>
                  {customer.name}
                </h3>

              </div>

            </div>


            {/* CONTACT DETAILS */}

            <div className="premium-customer-details">

              <div className="customer-detail-row">

                <span>PHONE</span>

                <strong>
                  {customer.phone || "—"}
                </strong>

              </div>


              <div className="customer-detail-row">

                <span>EMAIL</span>

                <strong>
                  {customer.email || "—"}
                </strong>

              </div>


              <div className="customer-detail-row">

                <span>ADDRESS</span>

                <strong>
                  {customer.address || "—"}
                </strong>

              </div>

            </div>


            {/* CUSTOMER SUMMARY */}

            <div className="premium-customer-summary">

              <div>

                <strong>
                  {customerMeasurements.length}
                </strong>

                <span>
                  Measurements
                </span>

              </div>


              <div>

                <strong>
                  {customerOrders.length}
                </strong>

                <span>
                  Orders
                </span>

              </div>

            </div>


            {/* ACTION */}

            <div className="premium-customer-footer">

              <span>
                STITCHORA CLIENT
              </span>

              <button
                className="admin-delete-button"
                onClick={() => deleteCustomer(customer.id)}
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

{/* ================= MEASUREMENTS ================= */}

<section
  className="admin-section measurements-premium-section"
  id="measurements"
>

  <div className="admin-section-heading">

    <div>
      <p>FIT & FORM</p>
      <h2>Customer measurements</h2>
    </div>

    <span>
      {measurements.length} RECORDS
    </span>

  </div>


  {measurements.length === 0 ? (

    <div className="admin-empty">
      No measurements available.
    </div>

  ) : (

    <div className="premium-measurement-list">

      {measurements.map((measurement) => (

        <div
          className="premium-measurement-card"
          key={measurement.id}
        >

          {/* TOP */}

          <div className="measurement-card-header">

            <div>

              <span>MEASUREMENT RECORD</span>

              <h3>
                #{measurement.id}
              </h3>

            </div>


            <div className="measurement-customer-badge">

              <span>CUSTOMER</span>

              <strong>
                #{measurement.customer?.id || "—"}
              </strong>

            </div>

          </div>


          {/* MEASUREMENTS */}

          <div className="measurement-values">

            <div className="measurement-value">
              <span>SHOULDER</span>
              <strong>{measurement.shoulder}</strong>
              <small>in</small>
            </div>

            <div className="measurement-value">
              <span>CHEST</span>
              <strong>{measurement.chest}</strong>
              <small>in</small>
            </div>

            <div className="measurement-value">
              <span>WAIST</span>
              <strong>{measurement.waist}</strong>
              <small>in</small>
            </div>

            <div className="measurement-value">
              <span>HIP</span>
              <strong>{measurement.hip}</strong>
              <small>in</small>
            </div>

            <div className="measurement-value">
              <span>SLEEVE</span>
              <strong>{measurement.sleeve}</strong>
              <small>in</small>
            </div>

            <div className="measurement-value">
              <span>LENGTH</span>
              <strong>{measurement.length}</strong>
              <small>in</small>
            </div>

          </div>


          {/* FOOTER */}

          <div className="measurement-card-footer">

            <span>
              PRECISION FIT • STITCHORA
            </span>

            <strong>
              Customer #{measurement.customer?.id || "—"}
            </strong>

          </div>

        </div>

      ))}

    </div>

  )}

</section>

      
   {/* ================= APPOINTMENTS ================= */}

<section
  className="admin-section appointments-premium-section"
  id="appointments"
>
  <div className="admin-section-heading">

    <div>
      <p>FITTING ROOM</p>
      <h2>Appointments</h2>
    </div>

    <span>
      {appointments.length} BOOKINGS
    </span>

  </div>

  {appointments.length === 0 ? (

    <div className="admin-empty">
      No appointments available.
    </div>

  ) : (

    <div className="premium-appointment-list">

      {appointments.map((appointment) => (

        <div
          className="premium-appointment-card"
          key={appointment.id}
        >

          {/* DATE */}

          <div className="appointment-calendar">

            <span>
              APPOINTMENT
            </span>

            <strong>
              {appointment.appointmentDate}
            </strong>

            <small>
              Booking #{appointment.id}
            </small>

          </div>


          {/* DRESS TYPE */}

          <div className="appointment-dress-type">

            <span>
              DRESS TYPE
            </span>

            <strong>
              {appointment.dressType || "Not specified"}
            </strong>

          </div>


          {/* TIME */}

          <div className="appointment-time">

            <span>
              TIME
            </span>

            <strong>
              {appointment.appointmentTime}
            </strong>

          </div>


          {/* STATUS */}

          <div className="appointment-status-area">

            <span>
              STATUS
            </span>

            <div className="appointment-status-badge">

              <i></i>

              {appointment.status || "Booked"}

            </div>

          </div>


          {/* ACTION */}

          <div className="appointment-action">

            <span>
              BOOKING #{appointment.id}
            </span>

            <strong>
              {appointment.status || "Booked"}
            </strong>

          </div>

        </div>

      ))}

    </div>

  )}

</section>


     {/* ================= TAILORS ================= */}

<section className="admin-tailors premium-tailors-section">

  <div className="admin-section-heading">

    <div>
      <p>OUR CRAFTSMEN</p>
      <h2>Tailor team</h2>
    </div>

    <span>
      {tailors.length} TAILORS
    </span>

  </div>


  {tailors.length === 0 ? (

    <div className="admin-empty">
      No tailors available.
    </div>

  ) : (

    <div className="premium-tailor-grid">

      {tailors.map((tailor) => (

        <div
          className="premium-tailor-card"
          key={tailor.id}
        >

          {/* PROFILE HEADER */}

          <div className="premium-tailor-header">

            <div className="premium-tailor-avatar">
              {tailor.name
                ? tailor.name.charAt(0).toUpperCase()
                : "T"}
            </div>

            <div>

              <span>
                TAILOR #{tailor.id}
              </span>

              <h3>
                {tailor.name}
              </h3>

            </div>

          </div>


          {/* SPECIALIZATION */}

          <div className="premium-tailor-specialization">

            <span>
              SPECIALIZATION
            </span>

            <strong>
              {tailor.specialization || "General Tailoring"}
            </strong>

          </div>


          {/* DETAILS */}

          <div className="premium-tailor-details">

            <div>

              <span>EXPERIENCE</span>

              <strong>
                {tailor.experience || "—"}
              </strong>

            </div>


            <div>

              <span>PHONE</span>

              <strong>
                {tailor.phone || "—"}
              </strong>

            </div>

          </div>


          {/* FOOTER */}

          <div className="premium-tailor-footer">

            <span>
              STITCHORA CRAFTSMAN
            </span>

            <div className="tailor-verified">
              <i></i>
              Available
            </div>

          </div>

        </div>

      ))}

    </div>

  )}

</section>


      {/* ================= EDIT ORDER MODAL ================= */}

      {editingOrder && (

        <div className="admin-modal-overlay">

          <div className="admin-modal">

            <button
              className="modal-close"
              onClick={closeEditOrder}
            >
              ×
            </button>

            <p className="modal-eyebrow">
              ORDER #{editingOrder.id}
            </p>

            <h2>
              Update order
            </h2>

            <p className="modal-outfit">
              {editingOrder.dressType}
            </p>

            <label>
              ORDER STATUS
            </label>

            <select
              value={editStatus}
              onChange={(event) =>
                setEditStatus(event.target.value)
              }
            >

              <option value="Pending">
                Pending
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

            <label>
              PRICE
            </label>

            <input
              type="number"
              value={editPrice}
              onChange={(event) =>
                setEditPrice(event.target.value)
              }
              placeholder="Enter price"
            />

            <div className="modal-actions">

              <button
                className="modal-cancel"
                onClick={closeEditOrder}
              >
                Cancel
              </button>

              <button
                className="modal-save"
                onClick={updateOrder}
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>

      )}

       {/* ================= CREATE ORDER MODAL ================= */}

{showAddOrder && (
  <div className="admin-modal-overlay">

    <div className="admin-modal">

      <button
        className="modal-close"
        onClick={closeAddOrder}
      >
        ×
      </button>

      <p className="modal-eyebrow">
        STITCHORA ORDERS
      </p>

      <h2>
        Create new order
      </h2>

      <p className="modal-outfit">
        Add a new tailoring order
      </p>

      {/* CUSTOMER */}

      <label>
        CUSTOMER
      </label>

      <select
        name="customerId"
        value={newOrder.customerId}
        onChange={handleNewOrderChange}
      >

        <option value="">
          Select customer
        </option>

        {customers.map((customer) => (
          <option
            key={customer.id}
            value={customer.id}
          >
            {customer.name} — #{customer.id}
          </option>
        ))}

      </select>


      {/* DRESS TYPE */}

      <label>
        DRESS TYPE
      </label>

      <input
        type="text"
        name="dressType"
        value={newOrder.dressType}
        onChange={handleNewOrderChange}
        placeholder="Example: Designer Blouse"
      />


      {/* PRICE */}

      <label>
        PRICE (₹)
      </label>

      <input
        type="number"
        name="price"
        value={newOrder.price}
        onChange={handleNewOrderChange}
        placeholder="Enter price"
        min="1"
      />


      {/* STATUS */}

      <label>
        ORDER STATUS
      </label>

      <select
        name="status"
        value={newOrder.status}
        onChange={handleNewOrderChange}
      >

        <option value="Pending">
          Pending
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


      {/* ACTIONS */}

      <div className="modal-actions">

        <button
          className="modal-cancel"
          onClick={closeAddOrder}
        >
          Cancel
        </button>

        <button
          className="modal-save"
          onClick={createOrder}
        >
          Create Order
        </button>

      </div>

    </div>

  </div>
)}


      {/* ================= FOOTER ================= */}

      <footer className="admin-footer">

        <div>

          <div className="admin-brand">
            STITCH<span>ORA</span>
          </div>

          <p>
            Tailoring management studio.
          </p>

        </div>

        <span>
          © 2026 STITCHORA
        </span>

      </footer>

    </div>
  );
}

export default AdminDashboard;