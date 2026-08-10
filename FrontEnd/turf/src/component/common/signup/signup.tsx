import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiCheckCircle, FiShield, FiCalendar, FiHeadphones, FiHelpCircle }  from "react-icons/fi";
import { useNavigate }      from "react-router-dom";
import { SignupService }    from "../../../services/service/common/signupservice";
import logo                 from "../../../assets/turf_logo.png";
import stadium              from "../../../assets/stadium.png";
import "./signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const {
    formData,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    loading,
    errorMessage,
    successMessage,
    handleChange,
    handleSubmit,
    togglePassword,
    toggleConfirmPassword
  } = SignupService();

  return (
    <div className="signup-page" style={{ backgroundImage: `url(${stadium})` }}>
      <div className="signup-overlay"></div>

      <div className="signup-card">
        <div className="signup-header">
          <img src={logo} alt="Field-Go" className="signup-logo" />

          <h1>Field-Go</h1>

          <p className="signup-subtitle">Create Your Account</p>

          <div className="signup-divider"></div>

          <p className="signup-description">Join Field-Go and start booking your perfect turf.</p>
        </div>

        {errorMessage && <div className="signup-message signup-error">{errorMessage}</div>}

        {successMessage && (
          <div className="signup-message signup-success">
            <FiCheckCircle />
            <span>{successMessage}</span>
          </div>
        )}

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-input-group">
            <FiUser className="signup-input-icon" />
            <div className="signup-input-content">
              <label>Full Name</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
              />
            </div>
          </div>

          <div className="signup-input-group">
            <FiMail className="signup-input-icon" />
            <div className="signup-input-content">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="signup-input-group">
            <FiPhone className="signup-input-icon" />
            <div className="signup-input-content">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your 10-digit phone number"
                maxLength={10}
                autoComplete="tel"
              />
            </div>
            <span className="signup-character-count">{formData.phone.length}/10</span>
          </div>

          <div className="signup-input-group">
            <FiLock className="signup-input-icon" />
            <div className="signup-input-content">
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                autoComplete="new-password"
              />
            </div>

            <div className="signup-password-help">
              <FiHelpCircle />
              <div className="signup-password-tooltip">
                <strong>Password must contain:</strong>
                <span>• At least 8 characters</span>
                <span>• One uppercase letter (A–Z)</span>
                <span>• One lowercase letter (a–z)</span>
                <span>• One number (0–9)</span>
                <span>• One special character (@ $ ! % * ? &)</span>
              </div>
            </div>

            <button type="button" className="signup-password-toggle" onClick={togglePassword}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <div className="signup-input-group">
            <FiLock className="signup-input-icon" />
            <div className="signup-input-content">
              <label>Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
            </div>

            <button type="button" className="signup-password-toggle" onClick={toggleConfirmPassword}>
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <label className="signup-terms">
            <input type="checkbox" required />
            <span>
              I agree to the
              <button type="button" className="signup-link-button">Terms of Service</button>
              and
              <button type="button" className="signup-link-button">Privacy Policy</button>
            </span>
          </label>

          <button type="submit" className="signup-submit-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="signup-login-link">
          <span>Already have an account?</span>
          <button type="button" onClick={() => navigate("/login")}>Login to Portal</button>
        </div>

        <div className="signup-features">
          <div className="signup-feature">
            <div className="signup-feature-icon">
              <FiShield />
            </div>
            <strong>Secure & Safe</strong>
            <span>Your data is protected</span>
          </div>

          <div className="signup-feature">
            <div className="signup-feature-icon">
              <FiCalendar />
            </div>
            <strong>Easy Booking</strong>
            <span>Book your turf in seconds</span>
          </div>

          <div className="signup-feature">
            <div className="signup-feature-icon">
              <FiHeadphones />
            </div>
            <strong>24/7 Support</strong>
            <span>We're here to help</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;