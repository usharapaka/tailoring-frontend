import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Appointment.css";

function Appointment() {
  const navigate = useNavigate();

  // ================= CUSTOMER =================

  const savedCustomer =
    JSON.parse(localStorage.getItem("stitchoraCustomer")) || {};

  const customerId = savedCustomer.id;


  // ================= SELECTED TAILOR =================

  const savedTailor =
    JSON.parse(
      localStorage.getItem("stitchoraSelectedTailor")
    ) || {};

  const selectedTailor = savedTailor;


  // ================= FORM =================

  const [formData, setFormData] = useState({
    customerId: customerId || "",
    tailorId: selectedTailor.id || "",
    appointmentDate: "",
    appointmentTime: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");


    // Customer check

    if (!customerId) {
      setError(
        "Customer information not found. Please login again."
      );
      return;
    }


    // Tailor check

    if (!selectedTailor.id) {
      setError(
        "Please select a tailor from your Customer Dashboard before booking an appointment."
      );
      return;
    }


    try {

      await axios.post(
        "http://localhost:8080/api/appointments",
        {
          customer: {
            id: Number(customerId),
          },

          tailor: {
            id: Number(selectedTailor.id),
          },

          appointmentDate:
            formData.appointmentDate,

          appointmentTime:
            formData.appointmentTime,

          status: "Booked",
        }
      );


      setMessage(
        "Appointment booked successfully!"
      );


      setTimeout(() => {
        navigate("/customer");
      }, 1200);


    } catch (err) {

      console.error(
        "Appointment booking error:",
        err
      );

      setError(
        "Unable to book appointment. Please try again."
      );
    }
  };


  return (
    <div className="appointment-page">


      {/* ================= NAVBAR ================= */}

      <header className="appointment-navbar">

        <div className="appointment-brand">
          STITCH<span>ORA</span>
        </div>


        <button
          onClick={() => navigate("/customer")}
        >
          ← Back to Dashboard
        </button>

      </header>



      {/* ================= MAIN ================= */}

      <main className="appointment-main">


        {/* ================= INTRO ================= */}

        <div className="appointment-intro">

          <p>
            PERSONAL TAILORING
          </p>


          <h1>
            Book your
            <br />
            <span>appointment.</span>
          </h1>



          {/* ================= SELECTED TAILOR ================= */}

          <div className="tailor-info">

            <span>
              YOUR TAILOR
            </span>


            {selectedTailor.id ? (

              <>
                <h3>
                  {selectedTailor.name}
                </h3>

                <p>
                  {selectedTailor.specialization ||
                    "General Tailoring"}

                  {" · "}

                  {selectedTailor.experience ||
                    "Experienced tailor"}
                </p>
              </>

            ) : (

              <>
                <h3>
                  No tailor selected
                </h3>

                <p>
                  Please select a tailor from your
                  Customer Dashboard.
                </p>
              </>

            )}

          </div>

        </div>



        {/* ================= FORM ================= */}

        <form
          className="appointment-form"
          onSubmit={handleSubmit}
        >


          <div className="form-heading">

            <span>
              01
            </span>


            <h2>
              Schedule your appointment
            </h2>


            <p>
              Choose a convenient date and time
              for your personal tailoring consultation.
            </p>

          </div>



          {/* ================= DATE ================= */}

          <label>

            Appointment Date


            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
            />

          </label>



          {/* ================= TIME ================= */}

          <label>

            Appointment Time


            <input
              type="time"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleChange}
              required
            />

          </label>



          {/* ================= SUBMIT ================= */}

          <button
            type="submit"
            className="appointment-submit"
          >
            Confirm Appointment →
          </button>



          {/* ================= SUCCESS ================= */}

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}



          {/* ================= ERROR ================= */}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

        </form>

      </main>

    </div>
  );
}

export default Appointment;