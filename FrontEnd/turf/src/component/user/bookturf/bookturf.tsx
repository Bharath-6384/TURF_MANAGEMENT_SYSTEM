import { FiMapPin, FiPhone, FiMail, FiSun, FiMoon, FiCalendar, FiClock, FiInfo, FiTag, FiDollarSign, FiLock, FiFileText, FiHash, FiAlertCircle }  from "react-icons/fi";
import { FaCheckCircle, FaStar }  from "react-icons/fa";
import { formatDate }             from "../../../services/constants/DateConstansts";
import { formatTime }             from "../../../services/constants/TimeConstants";
import { BookTurfService }        from "../../../services/service/user/bookturfservice";
import "./bookturf.css";

const BookTurf = () => {
  const {
    loading,
    loadError,
    actionError,
    successMessage,
    totalAmount,
    selectedTurf,
    filteredSlots,
    dates,
    selectedDate,
    selectedSlots,
    selectedPeriod,
    hours,
    estimatedAmount,
    handleSelectPeriod,
    handleSelectDate,
    handleSelectSlot,
    handleBookTurf,
    isSlotSelected,
  } = BookTurfService();

  if (loading) {
    return <div className="book-turf-page"><div className="book-turf-loading">Loading...</div></div>;
  }

  if (loadError) {
    return <div className="book-turf-page"><div className="book-turf-error">{loadError}</div></div>;
  }

  if (!selectedTurf) {
    return <div className="book-turf-page"><div className="book-turf-error">Turf not found.</div></div>;
  }

  return (
    <div className="book-turf-page">
      <div className="book-turf-header">
        <div className="book-turf-header-content">
          <div>
            <h1>Book Turf</h1>
            <p>Choose your preferred date, time and confirm your booking.</p>
          </div>

          <div className="book-turf-booking-note">
            <FiCalendar />
            <div>
              <h4>Advance Booking</h4>
              <span>You can book only up to <strong>7 days</strong> in advance.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="book-page-body">
        <div className="book-page-main">
          <div className="book-selected-turf">
            <div className="book-selected-image-wrapper">
              {selectedTurf.image_url ? (
                <img src={selectedTurf.image_url} alt={selectedTurf.turfname} className="book-selected-image" />
              ) : (
                <div className="book-turf-placeholder">No Image</div>
              )}
            </div>

            <div className="book-selected-details">
              <div className="book-selected-top">
                <h2>{selectedTurf.turfname}</h2>
                <span className="book-turf-status">Active</span>
              </div>

              <div className="book-turf-info">
                <div className="book-turf-info-item">
                  <FiMapPin />
                  <span>{selectedTurf.location}</span>
                </div>

                <div className="book-turf-info-item">
                  <FiPhone />
                  <span>{selectedTurf.contact_no}</span>
                </div>

                <div className="book-turf-info-item">
                  <FiMail />
                  <span>{selectedTurf.email}</span>
                </div>
              </div>

              <span className="book-turf-tag">
                <FaStar />
                Premium 5v5 Turf
              </span>
            </div>

            <div className="book-selected-prices">
              <div className="book-selected-price-card book-day-card">
                <div className="book-price-header">
                  <FiSun />
                  <span>Day</span>
                </div>
                <h3>
                  ₹{Number(selectedTurf.day_price).toFixed(0)}
                  <small>/hr</small>
                </h3>
                <p>06:00 AM - 06:00 PM</p>
              </div>

              <div className="book-selected-price-card book-night-card">
                <div className="book-price-header">
                  <FiMoon />
                  <span>Night</span>
                </div>
                <h3>
                  ₹{Number(selectedTurf.night_price).toFixed(0)}
                  <small>/hr</small>
                </h3>
                <p>06:00 PM - 06:00 AM</p>
              </div>
            </div>
          </div>

          <div className="book-turf-section">
            <div className="book-section-title">
              <FiCalendar />
              <h2>Choose Date</h2>
            </div>

            <div className="book-date-list">
              {dates.map((date, index) => {
                const label = index === 0 ? "Today" : index === 1 ? "Tomorrow" : date.day;
                const month = new Date(date.fullDate).toLocaleDateString("en-US", { month: "short" });

                return (
                  <button
                    key={date.fullDate}
                    className={
                      selectedDate?.fullDate === date.fullDate ? "book-date-card book-date-card-active" : "book-date-card"
                    }
                    onClick={() => handleSelectDate(date)}
                  >
                    <span className="book-date-day">{label}</span>
                    <h3>{date.date}</h3>
                    <span className="book-date-month">{month}</span>
                  </button>
                );
              })}
            </div>

            <div className="book-turf-note">
              <FiInfo />
              <span>You can only book up to <strong>7 days</strong> in advance.</span>
            </div>
          </div>

          <div className="book-turf-section">
            <div className="book-section-title">
              <FiClock />
              <h2>Choose Slot</h2>
            </div>

            <div className="book-period-toggle-full">
              <button
                className={
                  selectedPeriod === "day" ? "book-period-button book-period-button-active" : "book-period-button"
                }
                onClick={() => handleSelectPeriod("day")}
              >
                <FiSun />
                <span>DAY (06:00 AM - 06:00 PM)</span>
              </button>

              <button
                className={
                  selectedPeriod === "night" ? "book-period-button book-period-button-active" : "book-period-button"
                }
                onClick={() => handleSelectPeriod("night")}
              >
                <FiMoon />
                <span>NIGHT (06:00 PM - 06:00 AM)</span>
              </button>
            </div>

            <div className="book-slot-hint">
              <FiInfo />
              <span>Pick a slot, then pick another to book everything in between as one continuous session.</span>
            </div>

            {/* Inline, non-destructive error for slot selection / booking
                failures. Rendered here instead of blocking the whole page. */}
            {actionError && (
              <div className="book-turf-inline-error">
                <FiAlertCircle />
                <span>{actionError}</span>
              </div>
            )}

            <div className="book-slot-grid">
              {filteredSlots.map((slot) => (
                <button
                  key={`${slot.startTime}-${slot.endTime}`}
                  disabled={!slot.available}
                  className={
                    !slot.available
                      ? "book-slot book-slot-disabled"
                      : isSlotSelected(slot)
                      ? "book-slot book-slot-active"
                      : "book-slot"
                  }
                  onClick={() => handleSelectSlot(slot)}
                >
                  <span className="book-slot-time">
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </span>
                  <small>{!slot.available ? "Booked" : isSlotSelected(slot) ? "Selected" : "Available"}</small>
                </button>
              ))}
            </div>

            <div className="book-slot-legend">
              <span><i className="book-dot book-dot-available" />Available</span>
              <span><i className="book-dot book-dot-selected" />Selected</span>
              <span><i className="book-dot book-dot-booked" />Booked</span>
            </div>
          </div>
        </div>

        <aside className="book-summary-panel">
          <div className="book-summary">
            <h2>
              <FiFileText />
              Booking Summary
            </h2>

            <div className="book-summary-rows">
              <div className="book-summary-row">
                <span className="book-summary-row-label"><FiTag />Turf</span>
                <strong>{selectedTurf.turfname}</strong>
              </div>

              <div className="book-summary-row">
                <span className="book-summary-row-label"><FiCalendar />Date</span>
                <strong>{selectedDate ? formatDate(selectedDate.fullDate) : "—"}</strong>
              </div>

              <div className="book-summary-row">
                <span className="book-summary-row-label"><FiClock />Time</span>
                <strong>
                  {selectedSlots.length > 0
                    ? `${formatTime(selectedSlots[0].startTime)} - ${formatTime(
                        selectedSlots[selectedSlots.length - 1].endTime
                      )}`
                    : "—"}
                </strong>
              </div>

              <div className="book-summary-row">
                <span className="book-summary-row-label"><FiHash />Duration</span>
                <strong>{hours > 0 ? `${hours} ${hours === 1 ? "hour" : "hours"}` : "—"}</strong>
              </div>

              <div className="book-summary-row">
                <span className="book-summary-row-label"><FiTag />Category</span>
                <strong>{selectedPeriod === "day" ? "Day Slot" : "Night Slot"}</strong>
              </div>

              <div className="book-summary-row book-summary-row-amount">
                <span className="book-summary-row-label"><FiDollarSign />Amount</span>
                <strong>₹{hours > 0 ? (totalAmount > 0 ? totalAmount : estimatedAmount).toFixed(0) : "0"}</strong>
              </div>
            </div>

            <button
              className="book-confirm-button"
              disabled={!selectedDate || selectedSlots.length === 0}
              onClick={handleBookTurf}
            >
              <FiCalendar />
              Confirm Booking
            </button>

            <p className="book-secure-note">
              <FiLock />
              Secure Booking
            </p>
          </div>

          {successMessage && (
            <div className="book-turf-success">
              <FaCheckCircle />
              <span>{successMessage}</span>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default BookTurf;