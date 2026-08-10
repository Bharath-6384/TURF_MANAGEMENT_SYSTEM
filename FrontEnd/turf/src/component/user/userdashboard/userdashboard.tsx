import { useNavigate }             from "react-router-dom";
import { UserDashboardService }    from "../../../services/service/user/userdashboardservice";
import "./userdashboard.css";

const UserDashboard = () => {
  const { dashboardData, loading, error } = UserDashboardService();

  const navigate = useNavigate();

  if (loading) {
    return <div className="user-dashboard-loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="user-dashboard-error">{error}</div>;
  }

  return (
    <div className="user-dashboard-container">
      <div className="user-dashboard-hero">
        <div className="user-dashboard-hero-content">
          <div className="user-dashboard-eyebrow">
            <span className="user-dashboard-pulse"></span>
            Floodlights ready
          </div>
          <h1>
            Welcome back.<br />
            Your ground awaits.
          </h1>
          <p>Here's how your turf bookings are shaping up this week.</p>
          <div className="user-dashboard-hero-actions">
            <button className="user-dashboard-btn-primary" onClick={() => navigate("/book-turf")}>
              Book a turf
            </button>

            <button className="user-dashboard-btn-ghost" onClick={() => navigate("/bookings")}>
              View bookings
            </button>
          </div>
        </div>
      </div>

      <div className="user-dashboard-card-container">
        <div className="user-dashboard-card total">
          <div className="user-dashboard-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <rect x="3" y="4" width="18" height="17" rx="2" />
              <path d="M3 9h18" />
              <path d="M8 3v4M16 3v4" />
            </svg>
          </div>
          <h3>Total Bookings</h3>
          <span>{dashboardData.totalBookings}</span>
        </div>

        <div className="user-dashboard-card upcoming">
          <div className="user-dashboard-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
            </svg>
          </div>
          <h3>Upcoming</h3>
          <span>{dashboardData.upcomingBookings}</span>
        </div>

        <div className="user-dashboard-card completed">
          <div className="user-dashboard-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h3>Completed</h3>
          <span>{dashboardData.completedBookings}</span>
        </div>

        <div className="user-dashboard-card cancelled">
          <div className="user-dashboard-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <circle cx="12" cy="12" r="9" />
              <path d="M15 9l-6 6M9 9l6 6" />
            </svg>
          </div>
          <h3>Cancelled</h3>
          <span>{dashboardData.cancelledBookings}</span>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;