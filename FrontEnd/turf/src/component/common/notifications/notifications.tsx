import { FiBell, FiCheckCircle, FiAlertTriangle, FiClock, FiCalendar, FiMapPin, FiChevronDown, FiMail, FiSearch }  from "react-icons/fi";
import { formatTime }              from "../../../services/constants/TimeConstants";
import { NotificationsService }    from "../../../services/service/common/notificationsservice";
import "./notifiactions.css";

const Notifications = () => {
  const {
    filteredNotifications,
    loading,
    errorMessage,
    activeFilter,
    totalNotifications,
    unreadNotifications,
    todayNotifications,
    expandedId,
    markAllAsRead,
    setActiveFilter,
    handleToggleExpand
  } = NotificationsService();

  if (loading) {
    return <div className="notifications-page"><div className="notifications-loading">Loading notifications...</div></div>;
  }

  if (errorMessage) {
    return <div className="notifications-page"><div className="notifications-error">{errorMessage}</div></div>;
  }

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <div className="notifications-header">
          <div className="notifications-title">
            <div className="notifications-title-icon">
              <FiBell />
            </div>
            <div>
              <h1>Notifications</h1>
              <p>Stay updated with your turf activities</p>
            </div>
          </div>

          <button className="mark-all-button" onClick={markAllAsRead}>
            <FiCheckCircle />
            Mark all as read
          </button>
        </div>

        <div className="notifications-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <FiBell />
            </div>
            <div className="stat-info">
              <h4>Total Notifications</h4>
              <h2>{totalNotifications}</h2>
              <span>All time</span>
            </div>
            <div className="stat-chart">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>

          <div className="stat-card stat-card--unread">
            <div className="stat-icon">
              <FiMail />
            </div>
            <div className="stat-info">
              <h4>Unread</h4>
              <h2>{unreadNotifications}</h2>
              <span>Needs attention</span>
            </div>
            <div className="stat-chart">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>

          <div className="stat-card stat-card--today">
            <div className="stat-icon">
              <FiCalendar />
            </div>
            <div className="stat-info">
              <h4>Today</h4>
              <h2>{todayNotifications}</h2>
              <span>New today</span>
            </div>
            <div className="stat-chart">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>

        <div className="notification-search">
          <FiSearch />
          <input type="text" placeholder="Search notifications..." />
        </div>

        <div className="notification-filter">
          <button className={activeFilter === "all" ? "active" : ""} onClick={() => setActiveFilter("all")}>
            All
          </button>

          <button className={activeFilter === "unread" ? "active" : ""} onClick={() => setActiveFilter("unread")}>
            Unread
            <span>{unreadNotifications}</span>
          </button>
        </div>

        <div className="notification-body">
          <div className="notifications-list">
            {filteredNotifications.map((notification) => {
              const isExpanded = expandedId === notification.notification_id;

              return (
                <div
                  key={notification.notification_id}
                  className={`notification-card ${notification.is_read ? "" : "unread"} ${isExpanded ? "expanded" : ""}`}
                  onClick={() => handleToggleExpand(notification.notification_id, notification.is_read)}
                >
                  <div className="notification-left">
                    <span className="notification-status" />

                    <div className={`notification-icon ${notification.notification_type}`}>
                      {notification.notification_type === "booking" && <FiCalendar />}
                      {notification.notification_type === "success" && <FiCheckCircle />}
                      {notification.notification_type === "warning" && <FiAlertTriangle />}
                      {notification.notification_type === "info" && <FiBell />}
                    </div>

                    <div className="notification-content">
                      <div className="notification-top">
                        <h4>{notification.title}</h4>
                        <span className="notification-time">{formatTime(notification.created_at)}</span>
                      </div>

                      <p>{notification.message}</p>

                      <div className="notification-footer">
                        <span>
                          <FiClock />
                          {formatTime(notification.created_at)}
                        </span>

                        {notification.location && (
                          <span>
                            <FiMapPin />
                            {notification.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <FiChevronDown className="notification-toggle-icon" />
                </div>
              );
            })}

            {filteredNotifications.length === 0 && (
              <div className="notifications-empty-list">
                <FiBell />
                <h3>No Notifications Found</h3>
                <p>You're all caught up.</p>
              </div>
            )}
          </div>

          <div className="notifications-side-card">
            <img src="/assets/images/notification.png" alt="Notifications" className="notification-image" />

            <h2>You're all caught up!</h2>

            <p>
              No new notifications at the moment. We'll notify you whenever something important happens with your
              bookings, payments, turfs or account.
            </p>

            <div className="side-card-info">
              <div className="side-info-item">
                <FiBell />
                <div>
                  <strong>Instant Updates</strong>
                  <span>Get notified immediately</span>
                </div>
              </div>

              <div className="side-info-item">
                <FiCalendar />
                <div>
                  <strong>Booking Alerts</strong>
                  <span>Never miss your booking</span>
                </div>
              </div>

              <div className="side-info-item">
                <FiCheckCircle />
                <div>
                  <strong>Payment Status</strong>
                  <span>Track successful payments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;