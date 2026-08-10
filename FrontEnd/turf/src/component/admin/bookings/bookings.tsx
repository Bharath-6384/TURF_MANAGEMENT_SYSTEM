import { FiSearch, FiCalendar, FiClock, FiMapPin, FiChevronDown }  from "react-icons/fi";
import { FaCheckCircle }                                           from "react-icons/fa";
import Pagination                                                  from "../../common/pagination/pagination";
import { formatDate }                                              from "../../../services/constants/DateConstansts";
import { BookingsService }                                         from "../../../services/service/admin/bookingsservice";
import "./bookings.css";

const Bookings = () => {
  const {
    loading,
    errorMessage,
    searchText,
    activeFilter,
    selectedBooking,
    displayedBookings,
    filters,
    totalBookings,
    confirmedRevenue,
    unpaidAmount,
    page,
    totalPages,
    handlePageChange,
    handleMarkAsPaid,
    handleSetSearchText,
    handleSetActiveFilter,
    handleSelectBooking,
  } = BookingsService();

  if (loading) {
    return <div className="fg-bookings-page"><div className="fg-loading">Loading bookings...</div></div>;
  }

  return (
    <div className="fg-bookings-page">
      <div className="fg-overview-header">
        <div className="fg-overview-title">
          <h1>BOOKINGS OVERVIEW</h1>
          <p>List of bookings.</p>
        </div>

        <div className="fg-overview-stats">
          <div className="fg-orb fg-orb--revenue">
            <div className="fg-orb-inner">
              <span>Confirmed Revenue</span>
              <h2>₹ {confirmedRevenue.toLocaleString()}</h2>
            </div>
          </div>

          <div className="fg-orb fg-orb--total">
            <div className="fg-orb-inner">
              <span>Total Bookings</span>
              <h2>{totalBookings}</h2>
            </div>
          </div>

          <div className="fg-orb fg-orb--unpaid">
            <div className="fg-orb-inner">
              <span>Unpaid Amount</span>
              <h2>₹ {unpaidAmount.toLocaleString()}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="fg-main-layout">
        <div className="fg-left-col">
          <div className="fg-search fg-glass">
            <FiSearch />
            <input
              type="text"
              placeholder="Search by turfId, name, date..."
              value={searchText}
              onChange={handleSetSearchText}
              className="superadmin-search"
            />
          </div>

          <div className="fg-table-card fg-glass">
            <table className="fg-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Turf</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {displayedBookings.length ? (
                  displayedBookings.map((booking) => (
                    <tr
                      key={booking.booking_id}
                      onClick={() => handleSelectBooking(booking)}
                      className={selectedBooking?.booking_id === booking.booking_id ? "fg-row--active" : ""}
                    >
                      <td>{booking.booking_id}</td>
                      <td>{formatDate(booking.date)}</td>
                      <td>{booking.turfname}</td>
                      <td>
                        <div className="fg-customer">
                          <div className="fg-avatar">{booking.fullname.charAt(0).toUpperCase()}</div>
                          <div>
                            <h4>{booking.fullname}</h4>
                            <span>{booking.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`fg-status fg-status--${booking.status.toLowerCase()}`}>{booking.status}</span>
                      </td>
                      <td>₹ {booking.total_rate}</td>
                      <td>
                        <FiChevronDown />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="fg-empty">No bookings found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="fg-pagination">
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        </div>

        <div className="fg-right-col">
          <div className="fg-filter-arc">
            {filters.map((filter) => (
              <button
                key={filter.value}
                className={activeFilter === filter.value ? "fg-pill--active" : ""}
                onClick={() => handleSetActiveFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {selectedBooking && (
            <div className="fg-detail-card fg-glass">
              <div className="fg-detail-header">
                <div className="fg-detail-id">ID #{selectedBooking.booking_id}</div>
                <div className={`fg-status fg-status--${selectedBooking.status.toLowerCase()}`}>
                  {selectedBooking.status}
                </div>
              </div>

              <div className="fg-detail-body">
                <div className="fg-detail-avatar">{selectedBooking.fullname.charAt(0).toUpperCase()}</div>

                <div className="fg-detail-user">
                  <h2>{selectedBooking.fullname}</h2>
                  <p>{selectedBooking.email} </p>
                </div>
              </div>

              <div className="fg-info-list">
                <div className="fg-info-row">
                  <FiCalendar />
                  <span>{selectedBooking.date}</span>
                </div>

                <div className="fg-info-row">
                  <FiClock />
                  <span>{selectedBooking.start_time} {" - "} {selectedBooking.end_time}</span>
                </div>

                <div className="fg-info-row">
                  <FiMapPin />
                  <span>{selectedBooking.turfname}</span>
                </div>
              </div>

              <div className="fg-payment-card">
                <div>
                  <span className="fg-payment-label">Day Price / Hr</span>
                  <h3>₹{Number(selectedBooking.day_price).toFixed(2)}</h3>
                  <small>06:00 AM - 06:00 PM</small>
                </div>

                <div>
                  <span className="fg-payment-label">Night Price / Hr</span>
                  <h3>₹{Number(selectedBooking.night_price).toFixed(2)}</h3>
                  <small>06:00 PM - 06:00 AM</small>
                </div>
              </div>

              <div className="fg-summary">
                <div className="fg-summary-item">
                  <FaCheckCircle className="fg-summary-icon fg-summary-icon--success" />
                  <div>
                    <span>Status</span>
                    <strong>{selectedBooking.status}</strong>
                  </div>
                </div>

                {/* <div className="fg-summary-item">
                  <FaMoneyBillWave
                    className="fg-summary-icon fg-summary-icon--money"
                  />

                  <div>
                    <span>Payment</span>
                    <strong>
                      ₹{selectedBooking.total_rate}
                    </strong>
                  </div>
                </div> */}
              </div>
              {selectedBooking.status.toLowerCase() === "unpaid" && (
                <button className="fg-paid-button" onClick={handleMarkAsPaid}>
                  Mark as Paid
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {errorMessage && <div className="fg-error">{errorMessage}</div>}
    </div>
  );
};

export default Bookings;