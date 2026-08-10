import { faArrowLeft, faEnvelope, faPaperPlane }  from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon }                        from "@fortawesome/react-fontawesome";
import { Link, useNavigate }                      from "react-router-dom";
import { ForgotPasswordService }                  from "../../../services/service/common/forgetpasswordservice";
import logo                                       from "../../../assets/turf_logo.png";
import stadium                                    from "../../../assets/stadium.png";
import "./forgetpassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const {
    formData,
    loading,
    errorMessage,
    successMessage,
    handleFormData,
    handleForgotPassword
  } = ForgotPasswordService();

  return (
    <div className="forgot-password-wrapper" style={{ backgroundImage: `url(${stadium})` }}>
      <div className="forgot-password-overlay">
        <div className="forgot-password-card">
          <img src={logo} alt="Field-Go" className="forgot-password-logo" />

          <h2>Field-Go</h2>

          <p className="forgot-password-subtitle">Field Booking Portal</p>

          <div className="forgot-password-divider"></div>

          <div className="forgot-password-icon">
            <FontAwesomeIcon icon={faEnvelope} />
          </div>

          <h3>Forgot your password?</h3>

          <p className="forgot-password-description">
            No worries. Enter the email address associated
            with your Field-Go account and we'll send you
            a verification code.
          </p>

          {errorMessage && <div className="forgot-password-error">{errorMessage}</div>}

          {successMessage && <div className="forgot-password-success">{successMessage}</div>}

          <form onSubmit={handleForgotPassword}>
            <div className="forgot-password-input-wrapper">
              <FontAwesomeIcon icon={faEnvelope} className="forgot-password-input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleFormData}
                autoComplete="email"
                required
              />
            </div>

            <button type="submit" className="forgot-password-button" disabled={loading}>
              <FontAwesomeIcon icon={faPaperPlane} />
              {loading ? "Sending Code..." : "Send Verification Code"}
            </button>
          </form>

          <Link to="/login" className="forgot-password-back">
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;