import { useNavigate }                                       from "react-router-dom";
import { FiMapPin, FiAward, FiRefreshCw, FiShield }          from "react-icons/fi";
import { TurfsService }                                      from "../../../services/service/user/turfsservice";
import "./turfs.css";

const Turfs = () => {
  const { loading, error, turfs } = TurfsService();

  const navigate = useNavigate();

  if (loading) {
    return <div className="turfs-page"><div className="turfs-loading">Loading turfs...</div></div>;
  }

  if (error) {
    return <div className="turfs-page"><div className="turfs-error">{error}</div></div>;
  }

  return (
    <div className="turfs-page">
      <div className="turfs-header">
        <div className="turfs-header-content">
          <span className="turfs-header-tag">✨ Discover & Book</span>

          <h1>
            Explore The <span>Best Turfs</span>
          </h1>

          <p>Find premium turfs near you and book instantly.</p>

          <div className="turfs-header-badges">
            <div className="turfs-header-badge">
              <span className="turfs-header-badge-icon">
                <FiAward />
              </span>
              <span className="turfs-header-badge-text">
                <strong>Premium Turfs</strong>
                <small>Quality Assured</small>
              </span>
            </div>

            <div className="turfs-header-badge">
              <span className="turfs-header-badge-icon">
                <FiRefreshCw />
              </span>
              <span className="turfs-header-badge-text">
                <strong>Easy Booking</strong>
                <small>Instant Confirmation</small>
              </span>
            </div>

            <div className="turfs-header-badge">
              <span className="turfs-header-badge-icon">
                <FiShield />
              </span>
              <span className="turfs-header-badge-text">
                <strong>Secure Payment</strong>
                <small>Safe & Reliable</small>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="turfs-grid">
        {turfs.map((turf) => (
          <div key={turf.turfid} className="turfs-card">
            <div className="turfs-image-wrapper">
              {turf.image_url ? (
                <img src={turf.image_url} alt={turf.turfname} className="turfs-image" />
              ) : (
                <div className="turfs-placeholder">No Image</div>
              )}
              <span className={turf.status.toLowerCase() === "active" ? "turfs-active-badge" : "turfs-inactive-badge"}>
                {turf.status}
              </span>
            </div>

            <div className="turfs-details">
              <h3>{turf.turfname}</h3>

              <div className="turfs-location">
                <FiMapPin />
                <span>{turf.location}</span>
              </div>

              <div className="turfs-footer-row">
                <div className="turfs-prices">
                  <div className="turfs-price-block">
                    <span className="turfs-price-title">Day Price</span>
                    <h4>
                      ₹{Number(turf.day_price).toFixed(0)}
                      <small>/hr</small>
                    </h4>
                  </div>

                  <div className="turfs-price-block">
                    <span className="turfs-price-title">Night Price</span>
                    <h4>
                      ₹{Number(turf.night_price).toFixed(0)}
                      <small>/hr</small>
                    </h4>
                  </div>
                </div>
                <button
                  className={
                    turf.status.toLowerCase() === "active"
                      ? "turfs-book-button"
                      : "turfs-book-button turfs-book-button-disabled"
                  }
                  disabled={turf.status.toLowerCase() !== "active"}
                  onClick={() => navigate("/user/bookturf", { state: { turf } })}
                >
                  {turf.status.toLowerCase() === "active" ? "Book Now" : "Unavailable"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Turfs;