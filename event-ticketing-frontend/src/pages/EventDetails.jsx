import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Ticket,
  Star,
  CheckCircle
} from "lucide-react";

const events = {
  1: {
    title: "AR Rahman Live in Concert",
    category: "Music",
    location: "Chennai, Tamil Nadu",
    date: "August 24, 2026",
    time: "7:00 PM",
    price: 799,
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
    description:
      "Experience an unforgettable evening of music and entertainment. Enjoy a spectacular live performance with amazing sound, lights and an energetic atmosphere.",
  },
  2: {
    title: "Chennai Super Sports Night",
    category: "Sports",
    location: "Chennai, Tamil Nadu",
    date: "September 05, 2026",
    time: "6:30 PM",
    price: 999,
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    description:
      "Experience an exciting night of sports action with thousands of fans. Get your seats and enjoy the live atmosphere.",
  },
  3: {
    title: "International Movie Festival",
    category: "Movies",
    location: "Coimbatore, Tamil Nadu",
    date: "September 12, 2026",
    time: "5:00 PM",
    price: 499,
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    description:
      "Enjoy a collection of exciting movies and special screenings at this international movie festival.",
  },
  4: {
    title: "Stand Up Comedy Night",
    category: "Comedy",
    location: "Bangalore, Karnataka",
    date: "September 18, 2026",
    time: "8:00 PM",
    price: 599,
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1200&q=80",
    description:
      "Laugh out loud with an amazing lineup of comedians performing live on stage.",
  },
  5: {
    title: "Live Music Festival",
    category: "Music",
    location: "Bangalore, Karnataka",
    date: "September 25, 2026",
    time: "6:00 PM",
    price: 899,
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80",
    description:
      "A complete music festival experience featuring live performances, great artists and an unforgettable crowd.",
  },
  6: {
    title: "Championship Football",
    category: "Sports",
    location: "Chennai, Tamil Nadu",
    date: "October 03, 2026",
    time: "7:30 PM",
    price: 699,
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80",
    description:
      "Watch an exciting championship football match live from the stadium and experience the energy of the crowd.",
  }
};

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const event = events[id];

  if (!event) {
    return (
      <div className="details-not-found">
        <h2>Event Not Found</h2>
        <button onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="details-page">
      <div className="details-container">

        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={18} />
          Back to Events
        </button>

        <div className="details-card">

          <div className="details-image">
            <img src={event.image} alt={event.title} />

            <span className="details-category">
              {event.category}
            </span>
          </div>

          <div className="details-content">

            <div className="details-title-row">
              <div>
                <span className="details-label">
                  EVENT DETAILS
                </span>

                <h1>{event.title}</h1>
              </div>

              <div className="details-rating">
                <Star size={18} fill="currentColor" />
                {event.rating}
              </div>
            </div>

            <div className="details-info">

              <div className="info-box">
                <CalendarDays size={21} />
                <div>
                  <span>Date</span>
                  <strong>{event.date}</strong>
                </div>
              </div>

              <div className="info-box">
                <Clock size={21} />
                <div>
                  <span>Time</span>
                  <strong>{event.time}</strong>
                </div>
              </div>

              <div className="info-box">
                <MapPin size={21} />
                <div>
                  <span>Location</span>
                  <strong>{event.location}</strong>
                </div>
              </div>

            </div>

            <div className="about-event">
              <h2>About the Event</h2>

              <p>
                {event.description}
              </p>

              <div className="event-features">

                <div>
                  <CheckCircle size={17} />
                  Verified Event
                </div>

                <div>
                  <CheckCircle size={17} />
                  Secure Booking
                </div>

                <div>
                  <CheckCircle size={17} />
                  Instant Confirmation
                </div>

              </div>
            </div>

            <div className="booking-panel">

              <div className="booking-price">
                <span>Ticket price starting from</span>
                <strong>₹{event.price}</strong>
                <small>per person</small>
              </div>

              <button
                className="select-seat-button"
                onClick={() =>
                  navigate(`/seat-booking/${id}`)
                }
              >
                <Ticket size={19} />
                Select Seats
              </button>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;