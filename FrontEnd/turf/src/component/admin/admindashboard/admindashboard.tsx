import { FaWallet, FaUsers, FaCalendarAlt, FaCheckCircle, FaHourglassHalf, FaFutbol, FaMapMarkedAlt }  from "react-icons/fa";
import { AdminDashboardService }                                                                       from "../../../services/service/admin/admindashboardservice";
import "./admindashboard.css";

const AdminDashboard = () => {
  const { dashboardData, loading, errorMessage } = AdminDashboardService();

  if (loading) {
    return <div className="admin-dashboard-loading">Loading Dashboard...</div>;
  }

  const cards = [
    {
      title: "Total Revenue",
      value: `₹${dashboardData.totalRevenue}`,
      icon: <FaWallet />,
      color: "green",
    },
    {
      title: "Total Bookings",
      value: dashboardData.totalBookings,
      icon: <FaCalendarAlt />,
      color: "blue",
    },
    {
      title: "Today's Bookings",
      value: dashboardData.todayBookings,
      icon: <FaCalendarAlt />,
      color: "orange",
    },
    {
      title: "Completed",
      value: dashboardData.completedBookings,
      icon: <FaCheckCircle />,
      color: "teal",
    },
    {
      title: "Pending",
      value: dashboardData.pendingBookings,
      icon: <FaHourglassHalf />,
      color: "purple",
    },
    {
      title: "Customers",
      value: dashboardData.totalCustomers,
      icon: <FaUsers />,
      color: "pink",
    },
    {
      title: "Total Turfs",
      value: dashboardData.totalTurfs,
      icon: <FaFutbol />,
      color: "green",
    },
    {
      title: "Available Turfs",
      value: dashboardData.availableTurfs,
      icon: <FaMapMarkedAlt />,
      color: "orange",
    },
  ];

  return (
    <div className="admin-dashboard-container">
      {errorMessage && <div className="admin-dashboard-error">{errorMessage}</div>}

      <div className="welcome-section">
        <div className="welcome-card">
          <h4>Welcome Back 👋</h4>
          <h1>{dashboardData.adminName}</h1>
          <p>Let's make today a record breaker! ⚽</p>
          <div className="welcome-ground"></div>
        </div>

        <div className="stats-grid">
          {cards.map((card, index) => (
            <div key={index} className={`dashboard-card ${card.color}`}>
              <div className="card-header">
                <div className="card-icon">{card.icon}</div>
              </div>
              <h3>{card.title}</h3>
              <h2>{card.value}</h2>
              <span>View Details →</span>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="chart-card">
          <div className="chart-title">Revenue Trend</div>
          <div className="chart-placeholder">Revenue Chart</div>
        </div>
        <div className="status-card">
          <div className="chart-title">Booking Status</div>
          <div className="chart-placeholder">Booking Status Chart</div>
          <div className="success-box">
            🏆 Great Job!
            <p>You have completed{" "}{dashboardData.completedBookings}{" "}bookings.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;