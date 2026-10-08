import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Measurement.css";

function Measurement() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get logged-in customer
  const savedCustomer =
    JSON.parse(localStorage.getItem("stitchoraCustomer")) || {};

  const customerId = savedCustomer.id;

  // Check whether this page was opened for editing
  const editingMeasurement = location.state?.measurement || null;
  const editingMeasurementId = location.state?.measurementId || null;

  const [measurements, setMeasurements] = useState({
    shoulder: "",
    chest: "",
    waist: "",
    hip: "",
    sleeve: "",
    length: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ================= LOAD EDIT DATA =================

  useEffect(() => {
    if (editingMeasurement) {
      setMeasurements({
        shoulder: editingMeasurement.shoulder ?? "",
        chest: editingMeasurement.chest ?? "",
        waist: editingMeasurement.waist ?? "",
        hip: editingMeasurement.hip ?? "",
        sleeve: editingMeasurement.sleeve ?? "",
        length: editingMeasurement.length ?? "",
      });
    }
  }, [editingMeasurement]);

  // ================= HANDLE INPUT =================

  const handleChange = (e) => {
    setMeasurements({
      ...measurements,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SAVE / UPDATE =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const measurementData = {
        customer: {
          id: customerId,
        },

        shoulder: Number(measurements.shoulder),
        chest: Number(measurements.chest),
        waist: Number(measurements.waist),
        hip: Number(measurements.hip),
        sleeve: Number(measurements.sleeve),
        length: Number(measurements.length),
      };

      // ================= UPDATE EXISTING =================

      if (editingMeasurementId) {
        await axios.put(
          `http://localhost:8080/api/measurements/${editingMeasurementId}`,
          measurementData
        );

        setMessage("Measurements updated successfully!");

      } else {

        // ================= CREATE NEW =================

        await axios.post(
          "http://localhost:8080/api/measurements",
          measurementData
        );

        setMessage("Measurements saved successfully!");
      }

      // Go back to Customer Dashboard
      setTimeout(() => {
        navigate("/customer");
      }, 1200);

    } catch (err) {
      console.error("Measurement save/update error:", err);

      setError(
        editingMeasurementId
          ? "Unable to update measurements. Please try again."
          : "Unable to save measurements. Please try again."
      );
    }
  };

  return (
    <div className="measurement-page">

      {/* ================= NAVBAR ================= */}

      <header className="measurement-navbar">

        <div className="measurement-brand">
          STITCH<span>ORA</span>
        </div>

        <button
          className="measurement-back"
          onClick={() => navigate("/customer")}
        >
          ← Back to Dashboard
        </button>

      </header>

      {/* ================= MAIN ================= */}

      <main className="measurement-main">

        {/* ================= LEFT SIDE ================= */}

        <div className="measurement-intro">

          <p>PERSONAL FITTING</p>

          <h1>
            Your perfect
            <br />
            <span>measurements.</span>
          </h1>

          <p className="measurement-intro-description">
            Every beautiful outfit begins with the right measurements.
            Enter your measurements carefully so our tailor can create
            a comfortable and personalised fit for you.
          </p>

        </div>

        {/* ================= FORM ================= */}

        <form
          className="measurement-form"
          onSubmit={handleSubmit}
        >

          <div className="measurement-form-heading">

            <span>01</span>

            <h2>
              {editingMeasurementId
                ? "Update your measurements"
                : "Enter your measurements"}
            </h2>

            <p>
              Measurements are in inches.
            </p>

          </div>

          <div className="measurement-grid">

            {/* SHOULDER */}

            <div className="measurement-field">

              <label>SHOULDER</label>

              <input
                type="number"
                step="0.1"
                name="shoulder"
                placeholder="Example: 16"
                value={measurements.shoulder}
                onChange={handleChange}
                required
              />

            </div>

            {/* CHEST */}

            <div className="measurement-field">

              <label>CHEST</label>

              <input
                type="number"
                step="0.1"
                name="chest"
                placeholder="Example: 37"
                value={measurements.chest}
                onChange={handleChange}
                required
              />

            </div>

            {/* WAIST */}

            <div className="measurement-field">

              <label>WAIST</label>

              <input
                type="number"
                step="0.1"
                name="waist"
                placeholder="Example: 33"
                value={measurements.waist}
                onChange={handleChange}
                required
              />

            </div>

            {/* HIP */}

            <div className="measurement-field">

              <label>HIP</label>

              <input
                type="number"
                step="0.1"
                name="hip"
                placeholder="Example: 39"
                value={measurements.hip}
                onChange={handleChange}
                required
              />

            </div>

            {/* SLEEVE */}

            <div className="measurement-field">

              <label>SLEEVE</label>

              <input
                type="number"
                step="0.1"
                name="sleeve"
                placeholder="Example: 23"
                value={measurements.sleeve}
                onChange={handleChange}
                required
              />

            </div>

            {/* LENGTH */}

            <div className="measurement-field">

              <label>LENGTH</label>

              <input
                type="number"
                step="0.1"
                name="length"
                placeholder="Example: 41"
                value={measurements.length}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          <button
            type="submit"
            className="measurement-submit"
          >
            {editingMeasurementId
              ? "Update My Measurements →"
              : "Save My Measurements →"}
          </button>

          {message && (
            <div className="measurement-success">
              {message}
            </div>
          )}

          {error && (
            <div className="measurement-error">
              {error}
            </div>
          )}

        </form>

      </main>

    </div>
  );
}

export default Measurement;