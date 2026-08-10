import { FaMapMarkerAlt, FaRupeeSign, FaEnvelope, FaPhone, FaFutbol, FaImage }  from "react-icons/fa";
import { RegisterTurfService }                                                  from "../../../services/service/admin/registerturfservice";
import "./registerturf.css";

const RegisterTurf = () => {
  const {
    formData,
    errorMessage,
    successMessage,
    loading,
    handleFormData,
    handleImageChange,
    handleRegisterTurf,
  } = RegisterTurfService();

  return (
    <div className="register-turf-page">
      <div className="register-turf-header">
        <div>
          <span className="register-turf-eyebrow">TURF MANAGEMENT</span>
          <h1>Register New Turf</h1>
          <p>Add a new playing venue to your Field-Go network.</p>
        </div>
      </div>

      <div className="register-turf-card">
        <div className="register-turf-card-header">
          <div>
            <h2>Turf Details</h2>
            <p>Enter the details below to register your turf.</p>
          </div>
          <span className="required-text">* Required fields</span>
        </div>

        {errorMessage && <div className="register-turf-message error">{errorMessage}</div>}

        {successMessage && <div className="register-turf-message success">{successMessage}</div>}

        <div className="register-turf-form">
          <div className="register-turf-field">
            <label htmlFor="turfName">
              Turf Name <span>*</span>
            </label>
            <div className="register-turf-input-wrapper">
              <FaFutbol className="register-turf-input-icon" />
              <input
                id="turfName"
                type="text"
                name="turfName"
                placeholder="Enter turf name"
                value={formData.turfName}
                onChange={handleFormData}
              />
            </div>
          </div>

          <div className="register-turf-field">
            <label htmlFor="turfLocation">
              Location <span>*</span>
            </label>
            <div className="register-turf-input-wrapper">
              <FaMapMarkerAlt className="register-turf-input-icon" />
              <input
                id="turfLocation"
                type="text"
                name="turfLocation"
                placeholder="Enter turf location"
                value={formData.turfLocation}
                onChange={handleFormData}
              />
            </div>
          </div>

          <div className="register-turf-field">
            <label htmlFor="dayPrice">
              Day Price / Hour <span>*</span>
            </label>
            <div className="register-turf-input-wrapper">
              <FaRupeeSign className="register-turf-input-icon" />
              <input
                id="dayPrice"
                type="number"
                name="dayPrice"
                placeholder="Enter day price"
                min="1"
                value={formData.dayPrice}
                onChange={handleFormData}
              />
            </div>
          </div>

          <div className="register-turf-field">
            <label htmlFor="nightPrice">
              Night Price / Hour <span>*</span>
            </label>
            <div className="register-turf-input-wrapper">
              <FaRupeeSign className="register-turf-input-icon" />
              <input
                id="nightPrice"
                type="number"
                name="nightPrice"
                placeholder="Enter night price"
                min="1"
                value={formData.nightPrice}
                onChange={handleFormData}
              />
            </div>
          </div>

          <div className="register-turf-field">
            <label htmlFor="email">
              Email <span>*</span>
            </label>
            <div className="register-turf-input-wrapper">
              <FaEnvelope className="register-turf-input-icon" />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter turf email"
                value={formData.email}
                onChange={handleFormData}
              />
            </div>
          </div>

          <div className="register-turf-field">
            <label htmlFor="contactNo">
              Contact Number <span>*</span>
            </label>
            <div className="register-turf-input-wrapper">
              <FaPhone className="register-turf-input-icon" />
              <input
                id="contactNo"
                type="text"
                name="contactNo"
                placeholder="Enter 10 digit contact number"
                maxLength={10}
                value={formData.contactNo}
                onChange={handleFormData}
              />
            </div>
          </div>

          <div className="register-turf-field">
            <label htmlFor="image">
              Turf Image <span>*</span>
            </label>
            <div className="register-turf-input-wrapper">
              <FaImage className="register-turf-input-icon" />
              <input id="image" type="file" name="image" accept="image/*" onChange={handleImageChange} />
            </div>
          </div>
        </div>

        <div className="register-turf-actions">
          <button type="button" className="register-turf-submit" onClick={handleRegisterTurf} disabled={loading}>
            {loading ? "Registering..." : "Register Turf"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterTurf;