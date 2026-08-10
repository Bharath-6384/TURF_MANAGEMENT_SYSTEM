import { FiMail, FiPhone, FiUser, FiCamera, FiChevronRight, FiCalendar, FiEdit2, FiX, FiCheck, FiGrid }  from "react-icons/fi";
import { useNavigate }         from "react-router-dom";
import { formatDate }          from "../../../services/constants/DateConstansts";
import { UserProfileService }  from "../../../services/service/user/userprofileservice";
import "./userprofile.css";

const UserProfile = () => {
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
  } = UserProfileService();

  const getInitials = (name: string) => {
    if (!name) {
      return "U";
    }

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  if (loading && !profile) {
    return <div className="user-profile-page"><div className="user-profile-loading">Loading profile...</div></div>;
  }

  if (errorMessage && !profile) {
    return <div className="user-profile-page"><div className="user-profile-error">{errorMessage}</div></div>;
  }

  if (!profile) {
    return <div className="user-profile-page"><div className="user-profile-error">Profile not found.</div></div>;
  }

  return (
    <div className="user-profile-page">
      <div className="user-profile-header">
        <div className="user-profile-heading">
          <div>
            <span>ACCOUNT</span>
            <h1>My Profile</h1>
            <p>View and manage your personal information.</p>
          </div>
        </div>
      </div>

      {successMessage && <div className="user-profile-success">{successMessage}</div>}

      {errorMessage && profile && <div className="user-profile-error-message">{errorMessage}</div>}

      <div className="user-profile-hero">
        <div className="user-profile-avatar-wrap">
          <div className="user-profile-avatar">
            {avatarPreview ? (
              <img src={avatarPreview} alt={profile.fullname} />
            ) : (
              <span className="user-profile-avatar-initials">{getInitials(profile.fullname)}</span>
            )}
          </div>

          {isEditing && (
            <label className="user-profile-avatar-upload">
              <FiCamera />
              <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            </label>
          )}
        </div>

        <div className="user-profile-hero-info">
          <h2>{profile.fullname}</h2>

          <div className="user-profile-role">
            <span>User</span>
          </div>

          <div className="user-profile-contact-list">
            <div className="user-profile-contact-item">
              <FiMail />
              <span title={profile.email}>{profile.email}</span>
            </div>

            <div className="user-profile-contact-item">
              <FiCalendar />
              <span>Member since {formatDate(profile.datetime_reg)}</span>
            </div>
          </div>
        </div>

        {!isEditing ? (
          <button type="button" className="user-profile-edit-btn" onClick={handleEdit}>
            <FiEdit2 />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="user-profile-edit-actions">
            <button type="button" className="user-profile-cancel-btn" onClick={handleCancel} disabled={loading}>
              <FiX />
              <span>Cancel</span>
            </button>

            <button type="button" className="user-profile-save-btn" onClick={handleSave} disabled={loading}>
              <FiCheck />
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        )}
      </div>

      <div className="user-profile-columns">
        <div className="user-profile-panel">
          <div className="user-profile-section-title">
            <h2>Personal Information</h2>
          </div>

          <div className="user-profile-list">
            <div className="user-profile-row">
              <div className="user-profile-detail-icon">
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
                    className="user-profile-edit-input"
                  />
                ) : (
                  <strong>{profile.fullname}</strong>
                )}
              </div>
            </div>

            <div className="user-profile-row">
              <div className="user-profile-detail-icon">
                <FiMail />
              </div>

              <div>
                <span>Email</span>
                <strong className="user-profile-readonly">{profile.email}</strong>
              </div>
            </div>

            <div className="user-profile-row">
              <div className="user-profile-detail-icon">
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
                    className="user-profile-edit-input"
                  />
                ) : (
                  <strong>{profile.phone || "Not available"}</strong>
                )}
              </div>
            </div>

            <div className="user-profile-row">
              <div className="user-profile-detail-icon">
                <FiCalendar />
              </div>

              <div>
                <span>Member Since</span>
                <strong>{formatDate(profile.datetime_reg)}</strong>
              </div>
            </div>

            <div className="user-profile-row">
              <div className="user-profile-detail-icon">
                <FiUser />
              </div>

              <div>
                <span>Role</span>
                <strong>User</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="user-profile-panel user-profile-quickaccess">
          <div className="user-profile-section-title">
            <h2>Quick Access</h2>
          </div>

          <div className="user-profile-quickaccess-grid">
            <button type="button" className="user-profile-action-tile" onClick={() => navigate("/user/bookings")}>
              <div className="user-profile-detail-icon">
                <FiCalendar />
              </div>

              <div className="user-profile-action-tile-text">
                <strong>View My Bookings</strong>
                <span>Check your upcoming and past bookings</span>
              </div>

              <FiChevronRight className="user-profile-action-tile-chevron" />
            </button>

            <button type="button" className="user-profile-action-tile" onClick={() => navigate("/user/turfs")}>
              <div className="user-profile-detail-icon">
                <FiGrid />
              </div>

              <div className="user-profile-action-tile-text">
                <strong>Book a Turf</strong>
                <span>Find and book your preferred turf</span>
              </div>

              <FiChevronRight className="user-profile-action-tile-chevron" />
            </button>

            <button type="button" className="user-profile-action-tile" onClick={handleEdit}>
              <div className="user-profile-detail-icon">
                <FiEdit2 />
              </div>

              <div className="user-profile-action-tile-text">
                <strong>Update Profile</strong>
                <span>Edit your personal information</span>
              </div>

              <FiChevronRight className="user-profile-action-tile-chevron" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;