import { FiSearch, FiMapPin, FiPhone, FiMail, FiChevronDown }  from "react-icons/fi";
import { FaCheckCircle }                                       from "react-icons/fa";
import Pagination                                              from "../../common/pagination/pagination";
import { TurfsService }                                        from "../../../services/service/admin/turfsservice";
import "../bookings/bookings.css";
import "./turfs.css";

const Turfs = () => {
  const {
    loading,
    error,
    successMessage,
    searchText,
    activeFilter,
    filteredTurfs,
    selectedTurf,
    filters,
    totalTurfs,
    averagePrice,
    lowestPrice,
    page,
    totalPages,
    isEditing,
    selectedImage,
    imagePreview,
    showImage,
    handleUpdateSelectedTurf,
    handlePageChange,
    handleSelectTurf,
    handleSetSearchText,
    handleSetActiveFilter,
    handleUpdateTurf,
    handleDeleteTurf,
    handleEditTurf,
    handleCancelEdit,
    handleImageChange,
    handleViewImage,
    handleCloseImage,
    handleViewSelectedImage
  } = TurfsService();

  if (loading) {
    return <div className="fg-bookings-page"><div className="fg-loading">Loading turfs...</div></div>;
  }

  if (error) {
    return <div className="fg-bookings-page"><div className="fg-error">{error}</div></div>;
  }

  return (
    <div className="fg-bookings-page">
      <div className="fg-overview-header">
        <div className="fg-overview-title">
          <h1>TURFS OVERVIEW</h1>
          <p>Manage and monitor all your turf facilities.</p>
        </div>

        <div className="fg-overview-stats">
          <div className="fg-orb fg-orb--revenue">
            <div className="fg-orb-inner">
              <span>Total Turfs</span>
              <h2>{totalTurfs}</h2>
            </div>
          </div>

          <div className="fg-orb fg-orb--total">
            <div className="fg-orb-inner">
              <span>Average Price / Hr</span>
              <h2>₹ {averagePrice.toLocaleString()}</h2>
            </div>
          </div>

          <div className="fg-orb fg-orb--unpaid">
            <div className="fg-orb-inner">
              <span>Starting From</span>
              <h2>₹ {lowestPrice.toLocaleString()}</h2>
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
              placeholder="Search by turf ID, name, location..."
              value={searchText}
              onChange={handleSetSearchText}
            />
          </div>

          <div className="fg-table-card fg-glass">
            <table className="fg-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Turf</th>
                  <th>Location</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredTurfs.length ? (
                  filteredTurfs.map((turf) => (
                    <tr
                      key={turf.turfid}
                      onClick={() => handleSelectTurf(turf)}
                      className={selectedTurf?.turfid === turf.turfid ? "fg-row--active" : ""}
                    >
                      <td>{turf.turfid}</td>
                      <td>
                        <div className="fg-customer">
                          <div className="fg-avatar">{turf.turfname?.charAt(0).toUpperCase()}</div>
                          <div>
                            <h4>{turf.turfname}</h4>
                            <span>{turf.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="fg-info-row">
                          <FiMapPin />
                          <span>{turf.location}</span>
                        </div>
                      </td>
                      <td>{turf.contact_no}</td>
                      <td>
                        <span
                          className={`turf-list-status ${
                            turf.status?.toLowerCase() === "active" ? "turf-list-status--active" : "turf-list-status--inactive"
                          }`}
                        >
                          {turf.status || "Unknown"}
                        </span>
                      </td>
                      <td>
                        <FiChevronDown />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="fg-empty">No turfs found.</td>
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

          {successMessage && <div className="fg-success">{successMessage}</div>}

          {selectedTurf && (
            <div className="fg-detail-card fg-glass">
              {!isEditing ? (
                <>
                  <div className="fg-detail-header">
                    <div className="fg-detail-id">TURF #{selectedTurf.turfid}</div>
                    <div
                      className={`fg-status ${
                        selectedTurf.status?.toLowerCase() === "active" ? "fg-status--completed" : "fg-status--inactive"
                      }`}
                    >
                      {selectedTurf.status}
                    </div>
                  </div>

                  <div className="fg-detail-body">
                    <div className="fg-detail-avatar">{selectedTurf.turfname?.charAt(0).toUpperCase()}</div>
                    <div className="fg-detail-user">
                      <h2>{selectedTurf.turfname}</h2>
                      <p>{selectedTurf.location}</p>
                    </div>
                  </div>

                  <div className="fg-info-list">
                    <div className="fg-info-row">
                      <FiMapPin />
                      <span>{selectedTurf.location}</span>
                    </div>

                    <div className="fg-info-row">
                      <FiMail />
                      <span>{selectedTurf.email}</span>
                    </div>

                    <div className="fg-info-row">
                      <FiPhone />
                      <span>{selectedTurf.contact_no}</span>
                    </div>
                  </div>

                  <div className="fg-payment-card">
                    <div>
                      <span className="fg-payment-label">Day Price / Hr</span>
                      <h3>₹{Number(selectedTurf.day_price).toFixed(2)}</h3>
                      <small>06:00 AM - 06:00 PM</small>
                    </div>

                    <div>
                      <span className="fg-payment-label">Night Price / Hr</span>
                      <h3>₹{Number(selectedTurf.night_price).toFixed(2)}</h3>
                      <small>06:00 PM - 06:00 AM</small>
                    </div>
                  </div>

                  <div className="fg-summary">
                    <div className="fg-summary-item">
                      <FaCheckCircle
                        className={`fg-summary-icon ${
                          selectedTurf.status?.toLowerCase() === "active" ? "fg-summary-icon--success" : "fg-summary-icon--inactive"
                        }`}
                      />
                      <div>
                        <span>Status</span>
                        <strong>{selectedTurf.status}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="turfs-detail-actions">
                    <button className="turfs-edit-btn" onClick={handleViewImage}>View Image</button>
                    <button className="turfs-edit-btn" onClick={handleEditTurf}>Edit Turf</button>
                    <button className="turfs-delete-btn" onClick={handleDeleteTurf}>Delete Turf</button>
                  </div>
                </>
              ) : (
                <div className="turf-edit-mode">
                  <div className="turf-edit-header">
                    <div>
                      <span>EDIT TURF</span>
                      <h2>Turf #{selectedTurf.turfid}</h2>
                    </div>
                    <button className="turf-edit-close" onClick={handleCancelEdit}>×</button>
                  </div>

                  <div className="turf-edit-form">
                    <div className="turf-edit-field">
                      <label>Change Image</label>
                      <input type="file" accept="image/*" onChange={handleImageChange} />
                      {selectedImage && (
                        <button
                          type="button"
                          className="turf-selected-image-name"
                          onClick={handleViewSelectedImage}
                        >
                          {selectedImage.name}
                        </button>
                      )}
                    </div>

                    {/* <div className="turf-edit-field">
                      <label>Turf Name</label>

                      <input
                        type="text"
                        value={selectedTurf.turfname}
                        onChange={(e) =>
                          handleSelectTurf({
                            ...selectedTurf,
                            turfname: e.target.value
                          })
                        }
                      />
                    </div>

                    <div className="turf-edit-field">
                      <label>Location</label>

                      <input
                        type="text"
                        value={selectedTurf.location}
                        onChange={(e) =>
                          handleSelectTurf({
                            ...selectedTurf,
                            location: e.target.value
                          })
                        }
                      />
                    </div> */}

                    <div className="turf-edit-field">
                      <label>Status</label>
                      <select
                        value={selectedTurf.status}
                        onChange={(e) => handleUpdateSelectedTurf("status", e.target.value)}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="turf-edit-field">
                      <label>Contact Number</label>
                      <input
                        type="text"
                        value={selectedTurf.contact_no}
                        onChange={(e) => handleSelectTurf({ ...selectedTurf, contact_no: e.target.value })}
                      />
                    </div>

                    <div className="turf-edit-price-grid">
                      <div className="turf-edit-field">
                        <label>Day Price / Hr</label>
                        <input
                          type="number"
                          value={selectedTurf.day_price}
                          onChange={(e) => handleSelectTurf({ ...selectedTurf, day_price: Number(e.target.value) })}
                        />
                        <small>06:00 AM - 06:00 PM</small>
                      </div>

                      <div className="turf-edit-field">
                        <label>Night Price / Hr</label>
                        <input
                          type="number"
                          value={selectedTurf.night_price}
                          onChange={(e) => handleSelectTurf({ ...selectedTurf, night_price: Number(e.target.value) })}
                        />
                        <small>06:00 PM - 06:00 AM</small>
                      </div>
                    </div>
                  </div>

                  <div className="turf-edit-actions">
                    <button className="turf-cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                    <button className="turf-save-btn" onClick={handleUpdateTurf}>Save Changes</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showImage && imagePreview && (
        <div className="turf-image-modal">
          <div className="turf-image-modal-content">
            <button className="turf-image-close" onClick={handleCloseImage}>×</button>
            <img src={imagePreview} alt="Selected turf" />
          </div>
        </div>
      )}

      {showImage && !imagePreview && selectedTurf?.image_url && (
        <div className="turf-image-modal">
          <div className="turf-image-modal-content">
            <button className="turf-image-close" onClick={handleCloseImage}>×</button>
            <img src={selectedTurf.image_url} alt={selectedTurf.turfname} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Turfs;