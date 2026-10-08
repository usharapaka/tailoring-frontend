import { useNavigate, useLocation } from "react-router-dom";
import "./OrderTracking.css";

function OrderTracking() {
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state?.order || {
    id: 6,
    dressType: "Designer Blouse",
    status: "Stitching",
    price: 850,
  };

  const status = order.status?.toLowerCase();

  const steps = [
    {
      title: "Order Placed",
      description: "Your tailoring order has been received.",
      key: "pending",
    },
    {
      title: "Measurements Confirmed",
      description: "Your measurements are ready for stitching.",
      key: "confirmed",
    },
    {
      title: "Stitching",
      description: "Your outfit is currently being stitched.",
      key: "stitching",
    },
    {
      title: "Quality Check",
      description: "Final fitting and quality inspection.",
      key: "quality",
    },
    {
      title: "Ready for Delivery",
      description: "Your outfit is ready to collect.",
      key: "completed",
    },
  ];

  const getProgress = () => {
    if (status === "pending") return 0;
    if (status === "confirmed") return 1;
    if (status === "stitching") return 2;
    if (status === "quality check") return 3;
    if (status === "completed") return 4;
    return 0;
  };

  const currentStep = getProgress();

  return (
    <div className="tracking-page">

      {/* NAVBAR */}
      <header className="tracking-navbar">

        <div className="tracking-brand">
          STITCH<span>ORA</span>
        </div>

        <button
          className="tracking-back"
          onClick={() => navigate("/customer")}
        >
          ← Back to Dashboard
        </button>

      </header>


      {/* MAIN */}
      <main className="tracking-main">

        {/* HEADER */}
        <section className="tracking-header">

          <p className="tracking-eyebrow">
            STITCHORA ORDER TRACKING
          </p>

          <h1>
            Your outfit is
            <br />
            <span>coming together.</span>
          </h1>

          <p>
            Follow every stage of your personalised tailoring journey.
          </p>

        </section>


        {/* ORDER SUMMARY */}
        <section className="tracking-order-card">

          <div className="tracking-order-info">

            <span>
              ORDER #{order.id}
            </span>

            <h2>
              {order.dressType}
            </h2>

            <p>
              Personalised tailoring by STITCHORA
            </p>

          </div>


          <div className="tracking-price">

            <span>
              ORDER VALUE
            </span>

            <strong>
              ₹{order.price ?? "—"}
            </strong>

          </div>


          <div className="tracking-current-status">

            <span>
              CURRENT STATUS
            </span>

            <strong>
              {order.status}
            </strong>

          </div>

        </section>


        {/* TIMELINE */}
        <section className="tracking-timeline">

          <div className="timeline-heading">

            <p>
              YOUR JOURNEY
            </p>

            <h2>
              Stitching progress
            </h2>

          </div>


          <div className="timeline">

            {steps.map((step, index) => {

              const completed = index < currentStep;
              const active = index === currentStep;

              return (
                <div
                  className={`timeline-step ${
                    completed ? "completed" : ""
                  } ${active ? "active" : ""}`}
                  key={step.title}
                >

                  <div className="timeline-marker">

                    {completed ? "✓" : index + 1}

                  </div>


                  <div className="timeline-content">

                    <h3>
                      {step.title}
                    </h3>

                    <p>
                      {step.description}
                    </p>

                    {active && (
                      <span className="current-badge">
                        CURRENT STAGE
                      </span>
                    )}

                  </div>

                </div>
              );

            })}

          </div>

        </section>


        {/* BOTTOM MESSAGE */}
        <section className="tracking-note">

          <div className="tracking-note-icon">
            ✦
          </div>

          <div>

            <h3>
              Crafted with care.
            </h3>

            <p>
              Every stitch is created according to your measurements
              and checked before your outfit is ready.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default OrderTracking;