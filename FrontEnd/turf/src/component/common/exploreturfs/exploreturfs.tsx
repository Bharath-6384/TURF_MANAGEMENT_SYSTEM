import { useNavigate }          from "react-router-dom";
import { FiSearch, FiMapPin, FiTag, FiChevronDown, FiArrowRight, FiHeart }  from "react-icons/fi";
import { ExploreTurfsService }  from "../../../services/service/common/exploreturfsservice";
import "./exploreturfs.css";

const ExploreTurfs = () => {
  const navigate = useNavigate();

  const {
    filteredTurfs,
    searchText,
    selectedSport,
    selectedLocation,
    selectedPrice,
    handleSearchText,
    setSelectedSport,
    setSelectedLocation,
    setSelectedPrice,
  } = ExploreTurfsService();

  return (
    <main className="explore-turfs-page">
      {/* ================= HEADER ================= */}
      <header className="explore-header">
        <div className="explore-brand" onClick={() => navigate("/")}>
          <div className="explore-brand-logo">TG</div>
          <span>FIELD GO</span>
        </div>

        <nav className="explore-navigation">
          <a href="/">Sports</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
        </nav>

        <div className="explore-header-actions">
          <button className="explore-login-button" onClick={() => navigate("/login")}>Login</button>
          <button className="explore-signup-button">Sign Up</button>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="explore-hero">
        <div className="explore-hero-overlay"></div>

        <div className="explore-hero-content">
          <span className="explore-kicker">EXPLORE</span>
          <h1>
            FIND YOUR
            <br />
            PERFECT <span>TURF</span>
          </h1>
          <p>Find the right ground for your next game.</p>
        </div>
      </section>

      {/* ================= SEARCH ================= */}
      <section className="explore-search-section">
        <div className="explore-search-wrapper">
          <div className="explore-search-input">
            <FiSearch />
            <input
              type="text"
              placeholder="Search by turf name or location..."
              value={searchText}
              onChange={(event) => handleSearchText(event.target.value)}
            />
          </div>

          <div className="explore-filter">
            <FiTag />
            <select value={selectedSport} onChange={(event) => setSelectedSport(event.target.value)}>
              <option>All Sports</option>
              <option>Football</option>
              <option>Cricket</option>
              <option>Badminton</option>
              <option>Basketball</option>
            </select>
            <FiChevronDown />
          </div>

          <div className="explore-filter">
            <FiMapPin />
            <select value={selectedLocation} onChange={(event) => setSelectedLocation(event.target.value)}>
              <option>All Locations</option>
              <option>Bengaluru</option>
              <option>Koramangala</option>
              <option>Indiranagar</option>
            </select>
            <FiChevronDown />
          </div>

          <div className="explore-filter">
            <FiTag />
            <select value={selectedPrice} onChange={(event) => setSelectedPrice(event.target.value)}>
              <option>Price Range</option>
              <option>Under ₹600</option>
              <option>₹600 - ₹1000</option>
              <option>Above ₹1000</option>
            </select>
            <FiChevronDown />
          </div>

          <button className="explore-search-button">
            <FiSearch />
            Search
          </button>
        </div>
      </section>

      {/* ================= TURF LIST ================= */}
      <section className="explore-list-section">
        <div className="explore-list-header">
          <div className="explore-result-count">
            <span className="explore-status-dot"></span>
            <strong>{filteredTurfs.length}</strong>
            <span>TURFS AVAILABLE</span>
          </div>

          <div className="explore-sort">
            <span>Sort by:</span>
            <select>
              <option>Popular</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="explore-turf-grid">
          {filteredTurfs.map((turf) => (
            <article className="explore-turf-card" key={turf.turfid}>
              {/* IMAGE */}
              <div className="explore-turf-image-wrapper">
                <img src={turf.image} alt={turf.turfname} />
                <span className="explore-sport-badge">FOOTBALL</span>
                <button className="explore-favorite-button">
                  <FiHeart />
                </button>
              </div>

              {/* CONTENT */}
              <div className="explore-turf-content">
                <div className="explore-turf-title-row">
                  <h3>{turf.turfname}</h3>
                  <span className="explore-rating">★ 4.6</span>
                </div>

                <div className="explore-location">
                  <FiMapPin />
                  {turf.location}
                </div>

                <div className="explore-price-row">
                  <div>
                    <span>DAY (6AM - 6PM)</span>
                    <strong>
                      ₹{turf.day_price}
                      <small>/hr</small>
                    </strong>
                  </div>

                  <div>
                    <span>NIGHT (6PM - 6AM)</span>
                    <strong>
                      ₹{turf.night_price}
                      <small>/hr</small>
                    </strong>
                  </div>
                </div>

                <button className="explore-details-button">
                  View Details
                  <FiArrowRight />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ================= BENEFITS ================= */}
      <section className="explore-benefits">
        <div className="explore-benefit">
          <span>◇</span>
          <div>
            <strong>Verified Turfs</strong>
            <p>All turfs are verified for quality & safety</p>
          </div>
        </div>

        <div className="explore-benefit">
          <span>▣</span>
          <div>
            <strong>Instant Booking</strong>
            <p>Book your slot in just a few clicks</p>
          </div>
        </div>

        <div className="explore-benefit">
          <span>▤</span>
          <div>
            <strong>Secure Payments</strong>
            <p>Safe & seamless payment options</p>
          </div>
        </div>

        <div className="explore-benefit">
          <span>♧</span>
          <div>
            <strong>24/7 Support</strong>
            <p>We're here to help anytime</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ExploreTurfs;