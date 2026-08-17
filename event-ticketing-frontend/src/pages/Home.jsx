import { useNavigate } from "react-router-dom";
import "./Home.css";
import {
  Ticket,
  Search,
  MapPin,
  CalendarDays,
  ArrowRight,
  LogOut,
} from "lucide-react";

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="home-page">
      <nav className="home-navbar">
        <div className="home-logo">
          <div className="home-logo-icon">
            <Ticket size={22} />
          </div>
          <span>Evently</span>
        </div>

        <div className="home-nav-links">
          <a href="#events">Events</a>
          <a href="#categories">Categories</a>
          <a href="#about">About</a>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </nav>

      <main>
        <section className="home-hero">
          <div className="hero-content">
            <div className="hero-badge">
              <CalendarDays size={16} />
              <span>Discover unforgettable experiences</span>
            </div>

            <h1>
              Your Next Great
              <span> Experience Starts Here.</span>
            </h1>

            <p>
              Discover exciting events, choose your perfect seat,
              and book your tickets effortlessly - all in one place.
            </p>

            <div className="event-search">
              <div className="search-field">
                <Search size={20} />

                <input
                  type="text"
                  placeholder="Search events, artists or shows"
                />
              </div>

              <div className="search-location">
                <MapPin size={20} />
                <span>Chennai</span>
              </div>

              <button className="search-button">
                <span>Search</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>

        <section className="events-section" id="events">
          <div className="section-heading">
            <div>
              <span className="section-label">DON'T MISS OUT</span>
              <h2>Popular Events</h2>
            </div>

            <button className="view-all-button">
              <span>View All</span>
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="event-grid">
            <article className="event-card">
              <div className="event-card-image music">
                <span>LIVE MUSIC</span>
              </div>

              <div className="event-card-content">
                <h3>Chennai Music Festival</h3>

                <p>
                  Experience an unforgettable night of live music.
                </p>

                <div className="event-details">
                  <span>
                    <CalendarDays size={15} />
                    Dec 20, 2026
                  </span>

                  <span>
                    <MapPin size={15} />
                    Chennai
                  </span>
                </div>

                <div className="event-bottom">
                  <strong>₹999</strong>

                  <button
                    onClick={() =>
                      navigate("/events/music-festival")
                    }
                  >
                    <span>Book Now</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </article>

            <article className="event-card">
              <div className="event-card-image festival">
                <span>FESTIVAL</span>
              </div>

              <div className="event-card-content">
                <h3>Summer Cultural Festival</h3>

                <p>
                  Celebrate culture, food, music and entertainment.
                </p>

                <div className="event-details">
                  <span>
                    <CalendarDays size={15} />
                    Jan 12, 2027
                  </span>

                  <span>
                    <MapPin size={15} />
                    Chennai
                  </span>
                </div>

                <div className="event-bottom">
                  <strong>₹799</strong>

                  <button
                    onClick={() =>
                      navigate("/events/cultural-festival")
                    }
                  >
                    <span>Book Now</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </article>

            <article className="event-card">
              <div className="event-card-image sports">
                <span>SPORTS</span>
              </div>

              <div className="event-card-content">
                <h3>Cricket Championship</h3>

                <p>
                  Watch the biggest cricket action live in the stadium.
                </p>

                <div className="event-details">
                  <span>
                    <CalendarDays size={15} />
                    Feb 05, 2027
                  </span>

                  <span>
                    <MapPin size={15} />
                    Chennai
                  </span>
                </div>

                <div className="event-bottom">
                  <strong>₹599</strong>

                  <button
                    onClick={() =>
                      navigate("/events/cricket-championship")
                    }
                  >
                    <span>Book Now</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="categories-section" id="categories">
          <span className="section-label">EXPLORE</span>

          <h2>Explore Categories</h2>

          <div className="category-grid">
            <div className="category-card">
              <div className="category-icon">🎵</div>
              <h3>Music</h3>
              <p>Concerts and live performances</p>
            </div>

            <div className="category-card">
              <div className="category-icon">⚽</div>
              <h3>Sports</h3>
              <p>Matches and championships</p>
            </div>

            <div className="category-card">
              <div className="category-icon">🎭</div>
              <h3>Theatre</h3>
              <p>Shows and performances</p>
            </div>

            <div className="category-card">
              <div className="category-icon">🎉</div>
              <h3>Festivals</h3>
              <p>Celebrate something special</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer" id="about">
        <div className="home-logo">
          <div className="home-logo-icon">
            <Ticket size={20} />
          </div>

          <span>Evently</span>
        </div>

        <p>
          © 2026 Evently · Event Ticketing & Seat Booking Platform
        </p>
      </footer>
    </div>
  );
}

export default Home;