import { FiCalendar, FiEdit3, FiMail, FiPhone, FiUser, FiUsers, FiGrid, FiCamera, FiX, FiCheck }  from "react-icons/fi";
import { useNavigate }                                                                            from "react-router-dom";
import { formatDate }                                                                             from "../../../services/constants/DateConstansts";
import { AdminProfileService }                                                                    from "../../../services/service/admin/adminprofileservice";
import "./adminprofile.css";

const AdminProfile = () => {
  const navigate = useNavigate();

  const {
    profile,
    loading,
    errorMessage,
    successMessage,
    avatarPreview,
    isEditing,
    formData,
    handleAvatarChange,
    handleEdit,
    handleCancel,
    handleChange,
    handleSave
  } = AdminProfileService();

  if (loading && !profile) {
    return <div className="admin-profile-page"><div className="admin-profile-loading">Loading profile...</div></div>;
  }

  if (errorMessage && !profile) {
    return <div className="admin-profile-page"><div className="admin-profile-error">{errorMessage}</div></div>;
  }

  if (!profile) {
    return <div className="admin-profile-page"><div className="admin-profile-error">Profile not found.</div></div>;
  }

  const initials = profile.fullname
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="admin-profile-page">
      <div className="admin-profile-header">
        <div className="admin-profile-heading">
          <span>ACCOUNT</span>
          <h1>Admin Profile</h1>
          <p>View and manage administrator information.</p>
        </div>
      </div>

      {successMessage && <div className="admin-profile-success">{successMessage}</div>}

      {errorMessage && profile && <div className="admin-profile-error-message">{errorMessage}</div>}

      <div className="admin-profile-hero">
        <div className="admin-profile-avatar-wrap">
          <div className="admin-profile-avatar">
            {avatarPreview ? (
              <img src={avatarPreview} alt={profile.fullname} />
            ) : (
              <span className="admin-profile-avatar-initials">{initials}</span>
            )}
          </div>

          {isEditing && (
            <label className="admin-profile-avatar-upload">
              <FiCamera />
              <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            </label>
          )}
        </div>

        <div className="admin-profile-hero-info">
          <h2>{profile.fullname}</h2>

          <div className="admin-profile-role">
            <span>Administrator</span>
          </div>

          <div className="admin-profile-contact-list">
            <div className="admin-profile-contact-item">
              <FiMail />
              <span>{profile.email}</span>
            </div>

            <div className="admin-profile-contact-item">
              <FiCalendar />
              <span>Admin since {formatDate(profile.datetime_reg)}</span>
            </div>
          </div>
        </div>

        {!isEditing ? (
          <button type="button" className="admin-profile-edit-btn" onClick={handleEdit}>
            <FiEdit3 />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="admin-profile-edit-actions">
            <button type="button" className="admin-profile-cancel-btn" onClick={handleCancel} disabled={loading}>
              <FiX />
              <span>Cancel</span>
            </button>

            <button type="button" className="admin-profile-save-btn" onClick={handleSave} disabled={loading}>
              <FiCheck />
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        )}
      </div>

      <div className="admin-profile-columns">
        <div className="admin-profile-panel">
          <div className="admin-profile-section-title">
            <h2>Profile Information</h2>
          </div>

          <div className="admin-profile-list">
            <div className="admin-profile-row">
              <div className="admin-profile-detail-icon">
                <FiUser />
              </div>

              <div>
                <span>Full Name</span>

                {isEditing ? (
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className="admin-profile-edit-input"
                  />
                ) : (
                  <strong>{profile.fullname}</strong>
                )}
              </div>
            </div>

            <div className="admin-profile-row">
              <div className="admin-profile-detail-icon">
                <FiMail />
              </div>

              <div>
                <span>Email</span>
                <strong className="admin-profile-readonly">{profile.email}</strong>
              </div>
            </div>

            <div className="admin-profile-row">
              <div className="admin-profile-detail-icon">
                <FiPhone />
              </div>

              <div>
                <span>Phone</span>

                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="admin-profile-edit-input"
                  />
                ) : (
                  <strong>{profile.phone || "Not available"}</strong>
                )}
              </div>
            </div>

            <div className="admin-profile-row">
              <div className="admin-profile-detail-icon">
                <FiCalendar />
              </div>

              <div>
                <span>Admin Since</span>
                <strong>{formatDate(profile.datetime_reg)}</strong>
              </div>
            </div>

            <div className="admin-profile-row">
              <div className="admin-profile-detail-icon">
                <FiUser />
              </div>

              <div>
                <span>Role</span>
                <strong>{profile.role}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-profile-panel">
          <div className="admin-profile-section-title">
            <h2>Admin Overview</h2>
          </div>

          <div className="admin-profile-overview">
            <button type="button" className="admin-profile-overview-row" onClick={() => navigate("/admin/turfs")}>
              <div className="admin-profile-overview-label">
                <div className="admin-profile-detail-icon">
                  <FiGrid />
                </div>
                <span>Turf Management</span>
              </div>
              <strong>Manage</strong>
            </button>

            <button type="button" className="admin-profile-overview-row" onClick={() => navigate("/admin/bookings")}>
              <div className="admin-profile-overview-label">
                <div className="admin-profile-detail-icon">
                  <FiCalendar />
                </div>
                <span>Booking Management</span>
              </div>
              <strong>Manage</strong>
            </button>

            <button type="button" className="admin-profile-overview-row" onClick={() => navigate("/admin/users")}>
              <div className="admin-profile-overview-label">
                <div className="admin-profile-detail-icon">
                  <FiUsers />
                </div>
                <span>User Management</span>
              </div>
              <strong>Manage</strong>
            </button>

            <button
              type="button"
              className="admin-profile-overview-row admin-profile-register-row"
              onClick={() => navigate("/admin/registerturf")}
            >
              <div className="admin-profile-overview-label">
                <div className="admin-profile-detail-icon">
                  <FiGrid />
                </div>
                <span>Register Turf</span>
              </div>
              <strong>Register</strong>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;