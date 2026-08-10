import { FiCalendar, FiClock, FiMapPin }  from "react-icons/fi";
import { formatDate }                     from "../../../services/constants/DateConstansts";
import { formatTime }                     from "../../../services/constants/TimeConstants";
import { UserBookingsService }            from "../../../services/service/user/userbookingsservice";
import "./userbooking.css";

const UserBookings = () => {
  const { bookings, loading, errorMessage } = UserBookingsService();

  if (loading) {
    return <div className="user-bookings-container"><div className="user-bookings-loading">Loading your bookings...</div></div>;
  }

  if (errorMessage) {
    return <div className="user-bookings-container"><div className="user-bookings-error">{errorMessage}</div></div>;
  }

  return (
    <div className="user-bookings-container">
      <div className="user-bookings-header">
        <div>
          <span className="user-bookings-label">MY ACTIVITY</span>
          <h1>My Bookings</h1>
          <p>View all your turf bookings in one place.</p>
        </div>

        <div className="user-bookings-count">
          <span>{bookings.length}</span>
          <small>Total Bookings</small>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="no-user-bookings">
          <FiCalendar />
          <h2>No bookings yet</h2>
          <p>You haven't made any turf bookings.</p>
        </div>
      ) : (
        <div className="user-bookings-list">
          {bookings.map((booking) => (
            <div className="user-booking-card" key={booking.booking_id}>
              <div className="user-booking-main">
                <div className="user-booking-title">
                  <h2>{booking.turfname}</h2>
                  <span className={`booking-status ${booking.status.toLowerCase()}`}>{booking.status}</span>
                </div>

                <div className="user-booking-location">
                  <FiMapPin />
                  <span>{booking.location}</span>
                </div>
              </div>

              <div className="user-booking-details">
                <div className="booking-detail">
                  <FiCalendar />
                  <div>
                    <small>Date</small>
                    <strong>{formatDate(booking.date)}</strong>
                  </div>
                </div>

                <div className="booking-detail">
                  <FiClock />
                  <div>
                    <small>Time</small>
                    <strong>
                      {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                    </strong>
                  </div>
                </div>

                <div className="booking-detail">
                  <div>
                    <small>Amount</small>
                    <strong>₹{booking.total_rate}</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookings;