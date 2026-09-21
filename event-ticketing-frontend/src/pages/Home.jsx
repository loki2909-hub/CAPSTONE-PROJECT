import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import {
  Ticket,
  Search,
  MapPin,
  CalendarDays,
  ArrowRight,
  LogOut,
  Clock3,
  ShieldCheck,
  Sparkles,
  BadgeCheck,
  Users,
  Star,
  Music4,
  Trophy,
  Theater,
  PartyPopper,
  CheckCircle2,
} from "lucide-react";
import API_BASE_URL from "../config/api";

const events = [
  {
    title: "Chennai Music Festival",
    slug: "music-festival",
    category: "Live Music",
    date: "Dec 20, 2026",
    location: "Chennai",
    price: 999,
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
    description: "A cinematic night of live performances, sunset vibes, and unforgettable energy.",
  },
  {
    title: "Summer Cultural Festival",
    slug: "cultural-festival",
    category: "Festival",
    date: "Jan 12, 2027",
    location: "Chennai",
    price: 799,
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    description: "Celebrate culture, food, music, and handcrafted experiences in a vibrant open-air setting.",
  },
  {
    title: "Cricket Championship",
    slug: "cricket-championship",
    category: "Sports",
    date: "Feb 05, 2027",
    location: "Chennai",
    price: 599,
    image:
      "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1200&q=80",
    description: "Feel the roar of the crowd as world-class teams battle for the championship trophy.",
  },
];

const categories = [
  { label: "Music", icon: Music4, description: "Live concerts, indie sets, and stadium energy.", accent: "music" },
  { label: "Sports", icon: Trophy, description: "Championships, derby nights, and iconic matchdays.", accent: "sports" },
  { label: "Theatre", icon: Theater, description: "Creative performances and immersive stage stories.", accent: "theatre" },
  { label: "Festivals", icon: PartyPopper, description: "Multi-day cultural moments with unforgettable vibes.", accent: "festivals" },
];

const highlights = [
  {
    title: "Real-Time Seat Availability",
    description: "See live inventory and book the best seats before they disappear.",
    icon: Users,
  },
  {
    title: "Secure Booking",
    description: "Protected payments and trusted checkout designed for fast, safe reservations.",
    icon: ShieldCheck,
  },
  {
    title: "Instant Confirmation",
    description: "Receive confirmations immediately and keep your booking details ready to go.",
    icon: BadgeCheck,
  },
  {
    title: "Easy Event Discovery",
    description: "Browse curated experiences that match your mood, city, and calendar.",
    icon: Sparkles,
  },
];

const tamilNaduLocations = [
  "Chennai",
  "Coimbatore",
  "Madurai",
  "Tiruchirappalli",
  "Salem",
  "Tirunelveli",
  "Erode",
  "Tiruppur",
  "Vellore",
  "Thoothukudi",
  "Thanjavur",
  "Dindigul",
  "Cuddalore",
  "Kanchipuram",
  "Karur",
  "Namakkal",
  "Krishnagiri",
  "Dharmapuri",
  "Hosur",
  "Nagercoil",
  "Kanyakumari",
  "Ramanathapuram",
  "Sivaganga",
  "Virudhunagar",
  "Tenkasi",
  "Pudukkottai",
  "Nagapattinam",
  "Mayiladuthurai",
  "Villupuram",
  "Kallakurichi",
  "Tiruvannamalai",
  "Ranipet",
  "Tirupattur",
  "Perambalur",
  "Ariyalur",
  "The Nilgiris / Udhagamandalam",
  "Tiruvallur",
  "Chengalpattu",
];

const normalizeString = (value = "") => value.toLowerCase().trim();

const buildComparableDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const formatDateLabel = (value) => {
  if (!value) return "Any date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Any date";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const dateMatches = (eventDate, dateMode, selectedDateValue) => {
  if (dateMode === "Any date" || !dateMode) {
    return true;
  }

  if (dateMode === "Today") {
    const today = buildComparableDate(new Date());
    const event = buildComparableDate(eventDate);
    return event && today && event.getTime() === today.getTime();
  }

  if (dateMode === "Tomorrow") {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const target = buildComparableDate(tomorrow);
    const event = buildComparableDate(eventDate);
    return event && target && event.getTime() === target.getTime();
  }

  if (dateMode === "This weekend") {
    const today = new Date();
    const day = today.getDay();
    const daysUntilSaturday = (6 - day + 7) % 7;
    const weekendStart = new Date(today);
    weekendStart.setDate(today.getDate() + daysUntilSaturday);
    weekendStart.setHours(0, 0, 0, 0);

    const weekendEnd = new Date(weekendStart);
    weekendEnd.setDate(weekendStart.getDate() + 2);

    const event = buildComparableDate(eventDate);
    return event && event >= weekendStart && event <= weekendEnd;
  }

  if (dateMode === "Select a date" && selectedDateValue) {
    const chosen = buildComparableDate(selectedDateValue);
    const event = buildComparableDate(eventDate);
    return chosen && event && chosen.getTime() === event.getTime();
  }

  return true;
};

const categoryMatches = (eventCategory, selectedCategory) => {
  if (!selectedCategory) {
    return true;
  }

  const normalizedEventCategory = normalizeString(eventCategory);
  const normalizedSelectedCategory = normalizeString(selectedCategory).replace(/s$/, "");

  return normalizedEventCategory.includes(normalizedSelectedCategory);
};

const getDateRange = (dateMode, selectedDateValue) => {
  if (dateMode === "Select a date" && selectedDateValue) {
    const start = new Date(`${selectedDateValue}T00:00:00`);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return { startDateTime: start.toISOString(), endDateTime: end.toISOString() };
  }

  if (dateMode === "Today" || dateMode === "Tomorrow") {
    const start = new Date();
    if (dateMode === "Tomorrow") {
      start.setDate(start.getDate() + 1);
    }
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return { startDateTime: start.toISOString(), endDateTime: end.toISOString() };
  }

  if (dateMode === "This weekend") {
    const today = new Date();
    const daysUntilSaturday = (6 - today.getDay() + 7) % 7;
    const start = new Date(today);
    start.setDate(today.getDate() + daysUntilSaturday);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 3);
    return { startDateTime: start.toISOString(), endDateTime: end.toISOString() };
  }

  return {};
};

const formatEventDate = (value) => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value || "Date unavailable";
  }

  return formatDateLabel(`${value}T00:00:00`);
};

function Home() {
  const navigate = useNavigate();
  const eventsSectionRef = useRef(null);

  const [searchText, setSearchText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Chennai");
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationSearchText, setLocationSearchText] = useState("");
  const [dateMode, setDateMode] = useState("Any date");
  const [selectedDateValue, setSelectedDateValue] = useState("");
  const [dateOpen, setDateOpen] = useState(false);
  const [dateDropdownStyle, setDateDropdownStyle] = useState(null);
  const dateButtonRef = useRef(null);
  const dateDropdownRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [liveEvents, setLiveEvents] = useState([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState(false);
  const [liveSearchPerformed, setLiveSearchPerformed] = useState(false);
  const liveRequestId = useRef(0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".search-location") && !event.target.closest(".search-dropdown")) {
        setLocationOpen(false);
      }

      if (!event.target.closest(".search-date") && !event.target.closest(".search-date-dropdown")) {
        setDateOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!dateOpen || !dateButtonRef.current || !dateDropdownRef.current) {
      setDateDropdownStyle(null);
      return undefined;
    }

    const buttonRect = dateButtonRef.current.getBoundingClientRect();
    const dropdownRect = dateDropdownRef.current.getBoundingClientRect();
    const containingRect = dateDropdownRef.current.parentElement.getBoundingClientRect();
    const viewportPadding = 12;
    const dropdownGap = 10;
    const fitsBelow = buttonRect.bottom + dropdownGap + dropdownRect.height <= window.innerHeight - viewportPadding;
    const fitsAbove = buttonRect.top - dropdownGap - dropdownRect.height >= viewportPadding;

    if (fitsBelow) {
      setDateDropdownStyle(null);
      return undefined;
    }

    const top = fitsAbove
      ? buttonRect.top - dropdownRect.height - dropdownGap
      : viewportPadding;
    const left = Math.min(
      buttonRect.left,
      window.innerWidth - dropdownRect.width - viewportPadding,
    );

    setDateDropdownStyle({
      position: "absolute",
      top: `${Math.max(viewportPadding, top) - containingRect.top}px`,
      left: `${Math.max(viewportPadding, left) - containingRect.left}px`,
      width: `${dropdownRect.width}px`,
    });

    return undefined;
  }, [dateOpen]);

  const filteredLocationOptions = useMemo(() => {
    const query = normalizeString(locationSearchText);

    return tamilNaduLocations.filter((location) =>
      !query || normalizeString(location).includes(query)
    );
  }, [locationSearchText]);

  const fetchLiveEvents = async (overrides = {}) => {
    const requestId = liveRequestId.current + 1;
    liveRequestId.current = requestId;
    const search = overrides.searchText ?? searchText;
    const location = overrides.selectedLocation ?? selectedLocation;
    const category = overrides.selectedCategory ?? selectedCategory;
    const date = overrides.dateMode ?? dateMode;
    const selectedDate = overrides.selectedDateValue ?? selectedDateValue;
    const params = new URLSearchParams();

    if (location) params.set("city", location);
    if (search) params.set("keyword", search);
    if (category) params.set("category", category);
    Object.entries(getDateRange(date, selectedDate)).forEach(([key, value]) => params.set(key, value));

    setLiveLoading(true);
    setLiveError(false);
    setLiveSearchPerformed(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/live-events?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Live events are temporarily unavailable.");
      }

      if (requestId === liveRequestId.current) {
        setLiveEvents(data.events || []);
      }
    } catch (error) {
      if (requestId === liveRequestId.current) {
        setLiveEvents([]);
        setLiveError(true);
      }
    } finally {
      if (requestId === liveRequestId.current) {
        setLiveLoading(false);
      }
    }
  };

  const allEvents = useMemo(() => {
    const seen = new Set();
    return [...events, ...liveEvents].filter((event) => {
      const key = event.slug || event.id || event.title;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [liveEvents]);

  const filteredEvents = useMemo(() => {
    const query = normalizeString(searchText);

    return allEvents.filter((event) => {
      const matchesQuery =
        !query ||
        [event.title, event.category, event.location, event.description].some((value) =>
          normalizeString(value).includes(query)
        );

      const eventLocation = event.city || event.location;
      const matchesLocation =
        selectedLocation === "Chennai" ||
        normalizeString(eventLocation).includes(normalizeString(selectedLocation));

      const matchesDate = dateMatches(event.date, dateMode, selectedDateValue);
      const matchesCategory = categoryMatches(event.category, selectedCategory);

      return matchesQuery && matchesLocation && matchesDate && matchesCategory;
    });
  }, [allEvents, searchText, selectedLocation, dateMode, selectedDateValue, selectedCategory]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleSearch = () => {
    fetchLiveEvents();
    if (eventsSectionRef.current) {
      eventsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCategorySelection = (category) => {
    setSelectedCategory(category);
    fetchLiveEvents({ selectedCategory: category });
    if (eventsSectionRef.current) {
      eventsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleViewAll = () => {
    setSearchText("");
    setSelectedLocation("Chennai");
    setDateMode("Any date");
    setSelectedDateValue("");
    setSelectedCategory("");
    setLiveEvents([]);
    setLiveError(false);
    setLiveSearchPerformed(false);
    if (eventsSectionRef.current) {
      eventsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDateSelection = (option) => {
    if (option === "Select a date") {
      setDateMode(option);
      setDateOpen(true);
      return;
    }

    setDateMode(option);
    setSelectedDateValue("");
    setDateOpen(false);
    fetchLiveEvents({ dateMode: option, selectedDateValue: "" });
  };

  const getDateButtonLabel = () => {
    if (dateMode === "Select a date" && selectedDateValue) {
      return formatDateLabel(selectedDateValue);
    }

    return dateMode;
  };

  return (
    <div className="home-page">
      <nav className="home-navbar">
        <div className="home-logo" onClick={() => navigate("/home")} role="button" tabIndex={0}>
          <div className="home-logo-icon">
            <Ticket size={22} />
          </div>
          <span>Evently</span>
        </div>

        <div className="home-nav-links">
          <a href="#events">Events</a>
          <a href="#categories">Categories</a>
          <a href="#about">About</a>
          <button type="button" className="nav-link-button" onClick={() => navigate("/my-bookings")}>
            My Bookings
          </button>
        </div>

        <div className="home-nav-actions">
          <button type="button" className="nav-ghost" onClick={() => navigate("/login")}>
            Login
          </button>
          <button type="button" className="nav-primary" onClick={() => navigate("/register")}>
            Register
          </button>
          <button type="button" className="logout-button" onClick={handleLogout}>
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <main>
        <section className="home-hero">
          <div className="hero-glow hero-glow-one" />
          <div className="hero-glow hero-glow-two" />

          <div className="hero-content">
            <div className="hero-badge">
              <CalendarDays size={16} />
              <span>Discover unforgettable experiences</span>
            </div>

            <h1>
              <span className="hero-line">Your Next Great</span>
              <span className="hero-line hero-line-accent">Experience Starts Here.</span>
            </h1>

            <p>
              Find the city’s most exciting events, reserve your ideal seats, and enjoy effortless booking from one premium platform.
            </p>

            <div className="event-search" aria-label="Event search panel">
              <div className="search-field">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search events, artists or shows"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                />
              </div>

              <div className="search-location-wrap">
                <button
                  type="button"
                  className="search-location"
                  onClick={() => setLocationOpen((open) => !open)}
                  aria-expanded={locationOpen}
                >
                  <MapPin size={20} />
                  <span>{selectedLocation}</span>
                </button>

                {locationOpen && (
                  <div className="search-dropdown search-location-dropdown">
                    <input
                      type="text"
                      className="search-dropdown-input"
                      placeholder="Search city"
                      value={locationSearchText}
                      onChange={(event) => setLocationSearchText(event.target.value)}
                    />
                    <div className="search-dropdown-list">
                      {filteredLocationOptions.map((location) => (
                        <button
                          key={location}
                          type="button"
                          className="search-dropdown-button"
                          onClick={() => {
                            setSelectedLocation(location);
                            setLocationSearchText("");
                            setLocationOpen(false);
                            fetchLiveEvents({ selectedLocation: location });
                          }}
                        >
                          {location}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="search-date-wrap">
                <button
                  type="button"
                  className="search-date"
                  ref={dateButtonRef}
                  onClick={() => setDateOpen((open) => !open)}
                  aria-expanded={dateOpen}
                >
                  <CalendarDays size={20} />
                  <span>{getDateButtonLabel()}</span>
                </button>

                {dateOpen && (
                  <div
                    ref={dateDropdownRef}
                    className={`search-dropdown search-date-dropdown${dateDropdownStyle ? " is-viewport-contained" : ""}`}
                    style={dateDropdownStyle || undefined}
                  >
                    <div className="search-dropdown-list">
                      {[
                        "Any date",
                        "Today",
                        "Tomorrow",
                        "This weekend",
                        "Select a date",
                      ].map((option) => (
                        <button
                          key={option}
                          type="button"
                          className="search-dropdown-button"
                          onClick={() => {
                            handleDateSelection(option);
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>

                    {dateMode === "Select a date" && (
                      <div className="date-picker-wrap">
                        <input
                          type="date"
                          value={selectedDateValue}
                          onChange={(event) => {
                            setSelectedDateValue(event.target.value);
                            setDateMode("Select a date");
                            setDateOpen(false);
                            fetchLiveEvents({ dateMode: "Select a date", selectedDateValue: event.target.value });
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button type="button" className="search-button" onClick={handleSearch}>
                <span>Search</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>

        <section className="events-section" id="events" ref={eventsSectionRef}>
          <div className="section-heading">
            <div>
              <span className="section-label">Don’t Miss Out</span>
              <h2>Popular Events</h2>
            </div>

            <button type="button" className="view-all-button" onClick={handleViewAll}>
              <span>View All</span>
              <ArrowRight size={17} />
            </button>
          </div>

          {liveLoading && (
            <div className="no-events-found live-events-status">Finding live events...</div>
          )}

          {!liveLoading && liveError && (
            <div className="no-events-found live-events-status">Live events are temporarily unavailable.</div>
          )}

          {!liveLoading && filteredEvents.length === 0 ? (
            <div className="no-events-found">
              {liveSearchPerformed ? "No live events found for this location." : selectedCategory ? "No events found in this category." : "No events found"}
            </div>
          ) : (
            <div className="event-grid">
              {filteredEvents.map((event) => (
                <article className="event-card" key={event.slug || event.id}>
                  <div
                    className="event-card-image"
                    style={{ backgroundImage: `linear-gradient(180deg, rgba(8,12,18,0.12), rgba(8,12,18,0.78)), url(${event.image || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80"})` }}
                  >
                    <span>{event.category}</span>
                  </div>

                  <div className="event-card-content">
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>

                    <div className="event-details">
                      <span>
                        <CalendarDays size={15} />
                        {formatEventDate(event.date)}{event.time && event.time !== "Time unavailable" ? ` · ${event.time}` : ""}
                      </span>
                      <span>
                        <MapPin size={15} />
                        {event.venue ? `${event.venue}, ${event.city || event.location}` : event.location}
                      </span>
                    </div>

                    <div className="event-bottom">
                      <strong>{typeof event.price === "number" ? `₹${event.price}` : event.price}</strong>
                      <button
                        type="button"
                        onClick={() => {
                          if (event.isExternal) {
                            window.open(event.bookingUrl, "_blank", "noopener,noreferrer");
                            return;
                          }

                          navigate(`/events/${event.slug}`);
                        }}
                      >
                        <span>{event.isExternal ? "Book Tickets" : "Book Now"}</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="featured-section">
          <div className="featured-shell">
            <div className="featured-image" />
            <div className="featured-content">
              <span className="feature-pill">Featured Event</span>
              <h2>Sunset Rooftop Sessions</h2>
              <p>
                A premium evening of live acoustic performances, signature cocktails, and elevated city views designed for unforgettable nights out.
              </p>

              <div className="feature-meta">
                <div>
                  <CalendarDays size={18} />
                  <span>November 16, 2026</span>
                </div>
                <div>
                  <Clock3 size={18} />
                  <span>7:30 PM</span>
                </div>
                <div>
                  <MapPin size={18} />
                  <span>Chennai Marina</span>
                </div>
              </div>

              <div className="feature-footer">
                <div className="feature-price">
                  <span>From</span>
                  <strong>₹1,499</strong>
                </div>
                <button type="button" onClick={() => navigate("/events/music-festival")}>
                  View Event
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="categories-section" id="categories">
          <div className="section-heading section-heading-center">
            <div>
              <span className="section-label">Explore</span>
              <h2>Find Your Perfect Match</h2>
            </div>
          </div>

          <div className="category-grid">
            {categories.map(({ label, icon: Icon, description, accent }) => (
              <div
                className={`category-card ${accent}`}
                key={label}
                onClick={() => handleCategorySelection(label)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleCategorySelection(label);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="category-icon">
                  <Icon size={24} />
                </div>
                <h3>{label}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="benefits-section">
          <div className="section-heading section-heading-center">
            <div>
              <span className="section-label">Why Evently</span>
              <h2>Everything You Need for a Great Event</h2>
            </div>
          </div>

          <div className="benefits-grid">
            {highlights.map(({ title, description, icon: Icon }) => (
              <article className="benefit-card" key={title}>
                <div className="benefit-icon">
                  <Icon size={22} />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="about-visual">
            <img
              className="about-visual-image"
              src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1400&q=86"
              alt="Audience enjoying a live concert"
            />
            <div className="about-visual-overlay" />
            <div className="about-orb about-orb-one" />
            <div className="about-orb about-orb-two" />
            <div className="about-card">
              <Star size={18} />
              <span>Curated moments worth showing up for</span>
            </div>
          </div>

          <div className="about-copy">
            <span className="section-label section-label-left">About Evently</span>
            <h2>Discover events that move you.</h2>
            <p>
              Evently makes discovering and booking experiences simple, fast, and elevated. From intimate performances to landmark festivals, we help you find the moments that deserve your time.
            </p>
            <ul>
              <li><CheckCircle2 size={18} />Curated events across music, sports, theatre, and culture</li>
              <li><CheckCircle2 size={18} />Seamless checkout and live seat selection</li>
              <li><CheckCircle2 size={18} />Personalized discovery for every kind of night out</li>
            </ul>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-shell">
            <div>
              <span className="section-label">Ready when you are</span>
              <h2>Ready for Your Next Experience?</h2>
            </div>
            <button type="button" className="cta-button" onClick={() => navigate("/home")}>Explore Events</button>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="footer-brand-block">
          <div className="home-logo">
            <div className="home-logo-icon">
              <Ticket size={20} />
            </div>
            <span>Evently</span>
          </div>
          <p>Premium event discovery and seamless ticket booking made for unforgettable nights.</p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Explore</h4>
            <ul>
              <li>Events</li>
              <li>Categories</li>
              <li>Featured Events</li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li>About</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li>loki68781@gmail.com</li>
              <li>7092343158</li>
              <li>Trichy, Manaparai</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;