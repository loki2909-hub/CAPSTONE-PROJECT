import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, MapPin, Ticket } from "lucide-react";

const eventMap = {
  "music-festival": {
    title: "Chennai Music Festival",
    date: "Dec 20, 2026",
    time: "7:00 PM",
    location: "Chennai",
    price: 999,
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
  },
  "cultural-festival": {
    title: "Summer Cultural Festival",
    date: "Jan 12, 2027",
    time: "5:30 PM",
    location: "Chennai",
    price: 799,
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
  },
  "cricket-championship": {
    title: "Cricket Championship",
    date: "Feb 05, 2027",
    time: "6:30 PM",
    location: "Chennai",
    price: 599,
    image:
      "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1200&q=80",
  },
};

const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
const bookedSeats = new Set(["A2", "A3", "B5", "C1", "D7", "E6", "F4", "G8", "H2", "H9"]);

function SeatBooking() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const event = eventMap[slug] || eventMap["music-festival"];

  const [selectedSeats, setSelectedSeats] = useState([]);

  const seatNumbers = useMemo(() => {
    const seats = [];
    rows.forEach((row) => {
      for (let i = 1; i <= 10; i += 1) {
        seats.push(`${row}${i}`);
      }
    });
    return seats;
  }, []);

  const toggleSeat = (seat) => {
    if (bookedSeats.has(seat)) return;

    setSelectedSeats((current) =>
      current.includes(seat)
        ? current.filter((item) => item !== seat)
        : [...current, seat].sort((a, b) => a.localeCompare(b))
    );
  };

  const total = selectedSeats.length * event.price;

  const handleContinue = () => {
    if (!selectedSeats.length) {
      alert("Please select at least one seat to continue.");
      return;
    }

    const savedBookings = JSON.parse(localStorage.getItem("eventlyBookings") || "[]");

    const booking = {
      id: Date.now(),
      event: event.title,
      date: event.date,
      venue: event.location,
      seats: selectedSeats,
      amount: total,
      status: "Confirmed",
    };

    localStorage.setItem("eventlyBookings", JSON.stringify([booking, ...savedBookings]));
    navigate("/my-bookings");
  };

  return (
    <div className="booking-page">
      <div className="booking-shell">
        <div className="booking-head">
          <button type="button" className="back-button" onClick={() => navigate(`/events/${slug}`)}>
            <ArrowLeft size={18} />
            Back to Event
          </button>
          <h1>Select Your Seats</h1>
        </div>

        <div className="booking-layout">
          <div className="booking-panel-card">
            <div className="summary-card">
              <h3>{event.title}</h3>
              <div className="summary-meta">
                <span><CalendarDays size={15} /> {event.date}</span>
                <span><MapPin size={15} /> {event.location}</span>
                <span><Ticket size={15} /> {event.time}</span>
              </div>
            </div>

            <div className="seat-grid" aria-label="Seat map">
              {seatNumbers.map((seat) => {
                const isBooked = bookedSeats.has(seat);
                const isSelected = selectedSeats.includes(seat);

                return (
                  <button
                    key={seat}
                    type="button"
                    className={`seat-btn ${isBooked ? "booked" : ""} ${isSelected ? "selected" : ""}`}
                    onClick={() => toggleSeat(seat)}
                    disabled={isBooked}
                  >
                    {seat}
                  </button>
                );
              })}
            </div>

            <div className="seat-legend">
              <span className="legend-item"><span className="legend-box available" />Available</span>
              <span className="legend-item"><span className="legend-box selected" />Selected</span>
              <span className="legend-item"><span className="legend-box booked" />Booked</span>
            </div>
          </div>

          <aside className="booking-summary">
            <div className="summary-card">
              <h3>Booking Summary</h3>
              <div className="summary-meta">
                <span>Selected seats: {selectedSeats.length ? selectedSeats.join(", ") : "None"}</span>
                <span>Event: {event.title}</span>
                <span>Venue: {event.location}</span>
              </div>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <strong>₹{total}</strong>
            </div>

            <button type="button" className="continue-button" onClick={handleContinue}>
              Continue
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default SeatBooking;
