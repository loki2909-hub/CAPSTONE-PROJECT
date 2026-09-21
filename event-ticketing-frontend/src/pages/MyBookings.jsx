import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, MapPin, Ticket } from "lucide-react";

function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("eventlyBookings") || "[]");
    setBookings(saved);
  }, []);

  return (
    <div className="my-bookings-page">
      <div className="bookings-shell">
        <div className="bookings-head">
          <button type="button" className="back-button" onClick={() => navigate("/home")}>
            <ArrowLeft size={18} />
            Back to Home
          </button>
          <h1>My Bookings</h1>
        </div>

        {!bookings.length ? (
          <div className="booking-ticket">
            <div className="ticket-header">
              <h3>No bookings yet</h3>
            </div>
            <p style={{ color: "#a7afc1", lineHeight: 1.8 }}>
              Your confirmed tickets will appear here once you reserve a seat for an event.
            </p>
            <button type="button" className="continue-button" onClick={() => navigate("/home")}>
              Explore Events
            </button>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <article className="booking-ticket" key={booking.id}>
                <div className="ticket-header">
                  <div>
                    <h3>{booking.event}</h3>
                  </div>
                  <span className="ticket-badge">{booking.status}</span>
                </div>

                <div className="ticket-meta">
                  <div>
                    <CalendarDays size={15} />
                    <strong>{booking.date}</strong>
                  </div>
                  <div>
                    <MapPin size={15} />
                    <strong>{booking.venue}</strong>
                  </div>
                  <div>
                    <Ticket size={15} />
                    <strong>{booking.seats.join(", ")}</strong>
                  </div>
                  <div>
                    <span>Total</span>
                    <strong>₹{booking.amount}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
