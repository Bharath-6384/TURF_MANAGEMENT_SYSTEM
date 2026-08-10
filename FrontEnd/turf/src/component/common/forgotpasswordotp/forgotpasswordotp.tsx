import { useNavigate }                                        from "react-router-dom";
import { faArrowLeft, faCheckCircle, faEnvelope, faRotate }    from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon }                                     from "@fortawesome/react-fontawesome";
import { ForgotPasswordOtpService }                            from "../../../services/service/common/forgotpasswordotpservice";
import logo                                                    from "../../../assets/turf_logo.png";
import stadium                                                 from "../../../assets/stadium.png";
import "./forgotpasswordotp.css";

const ForgotPasswordOtp = () => {
  const navigate = useNavigate();

  const {
    email,
    otp,
    loading,
    errorMessage,
    successMessage,
    handleOtpChange,
    handleVerifyOtp,
    handleResendOtp,
  } = ForgotPasswordOtpService();

  return (
    <div className="forgot-password-otp-wrapper" style={{ backgroundImage: `url(${stadium})` }}>
      <div className="forgot-password-otp-overlay">
        <div className="forgot-password-otp-card">
          <img src={logo} alt="Field-Go" className="forgot-password-otp-logo" />

          <h2>Field-Go</h2>

          <p className="forgot-password-otp-subtitle">Verify Your Identity</p>

          <div className="forgot-password-otp-icon">
            <FontAwesomeIcon icon={faEnvelope} />
          </div>

          <h3>Enter Verification Code</h3>

          <p className="forgot-password-otp-description">We sent a 6-digit verification code to</p>

          <p className="forgot-password-otp-email">{email}</p>

          {errorMessage && <div className="forgot-password-otp-error">{errorMessage}</div>}

          {successMessage && (
            <div className="forgot-password-otp-success">
              <FontAwesomeIcon icon={faCheckCircle} />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleVerifyOtp}>
            <div className="forgot-password-otp-input-wrapper">
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="000000"
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
              />
            </div>

            <p className="forgot-password-otp-hint">Enter the 6-digit code sent to your email</p>

            <button type="submit" className="forgot-password-otp-button" disabled={loading || otp.length !== 6}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <div className="forgot-password-resend">
            <span>Didn't receive the code?</span>
            <button type="button" onClick={handleResendOtp} disabled={loading}>
              <FontAwesomeIcon icon={faRotate} />
              Resend OTP
            </button>
          </div>

          <button type="button" className="forgot-password-back" onClick={() => navigate("/forgotPassword")}>
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordOtp;