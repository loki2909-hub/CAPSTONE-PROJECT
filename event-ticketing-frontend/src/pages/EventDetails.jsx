import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Ticket,
  Star,
  CheckCircle2,
  BadgeCheck,
} from "lucide-react";

const events = [
  {
    id: 1,
    slug: "music-festival",
    title: "Chennai Music Festival",
    category: "Live Music",
    location: "Chennai, Tamil Nadu",
    date: "December 20, 2026",
    time: "7:00 PM",
    price: 999,
    rating: "4.9",
    seatsAvailable: 128,
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
    description:
      "A cinematic live music experience with headline acts, immersive lighting, and an energetic atmosphere that brings the city together in one unforgettable night.",
  },
  {
    id: 2,
    slug: "cultural-festival",
    title: "Summer Cultural Festival",
    category: "Festival",
    location: "Chennai, Tamil Nadu",
    date: "January 12, 2027",
    time: "5:30 PM",
    price: 799,
    rating: "4.8",
    seatsAvailable: 84,
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    description:
      "Celebrate culture, creativity, and community with live performances, food stalls, artisan showcases, and vibrant installations across a grand open-air venue.",
  },
  {
    id: 3,
    slug: "cricket-championship",
    title: "Cricket Championship",
    category: "Sports",
    location: "Chennai, Tamil Nadu",
    date: "February 05, 2027",
    time: "6:30 PM",
    price: 599,
    rating: "4.9",
    seatsAvailable: 154,
    image:
      "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1200&q=80",
    description:
      "Witness the thrill of a marquee sporting clash with roaring fans, premium viewing zones, and an unforgettable stadium atmosphere.",
  },
];

function EventDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const event = events.find((entry) => entry.slug === slug || String(entry.id) === slug);

  if (!event) {
    return (
      <div className="details-not-found">
        <h2>Event Not Found</h2>
        <button type="button" onClick={() => navigate("/home")}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="details-page">
      <div className="details-shell">
        <button type="button" className="back-button" onClick={() => navigate("/home")}>
          <ArrowLeft size={18} />
          Back to Events
        </button>

        <div className="details-card">
          <div className="details-image">
            <img src={event.image} alt={event.title} />
            <span className="details-category">{event.category}</span>
          </div>

          <div className="details-content">
            <div className="details-heading-row">
              <div>
                <span className="details-label">Event Details</span>
                <h1>{event.title}</h1>
              </div>
              <div className="details-rating">
                <Star size={18} fill="currentColor" />
                {event.rating}
              </div>
            </div>

            <div className="details-meta">
              <div className="info-box">
                <CalendarDays size={19} />
                <div>
                  <span>Date</span>
                  <strong>{event.date}</strong>
                </div>
              </div>

              <div className="info-box">
                <Clock3 size={19} />
                <div>
                  <span>Time</span>
                  <strong>{event.time}</strong>
                </div>
              </div>

              <div className="info-box">
                <MapPin size={19} />
                <div>
                  <span>Location</span>
                  <strong>{event.location}</strong>
                </div>
              </div>
            </div>

            <div className="about-event">
              <h2>About This Event</h2>
              <p>{event.description}</p>

              <div className="event-features">
                <div><CheckCircle2 size={17} /> Verified Event</div>
                <div><BadgeCheck size={17} /> Secure Booking</div>
                <div><CheckCircle2 size={17} /> Instant Confirmation</div>
              </div>
            </div>

            <div className="booking-panel">
              <div className="booking-price">
                <span>Ticket price starting from</span>
                <strong>₹{event.price}</strong>
                <small>per person</small>
              </div>

              <div className="booking-side-info">
                <span>{event.seatsAvailable} seats available</span>
              </div>

              <button type="button" className="select-seat-button" onClick={() => navigate(`/seat-booking/${event.slug}`)}>
                <Ticket size={18} />
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