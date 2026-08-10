import { faArrowLeft, faCheck, faCircleCheck, faEye, faEyeSlash, faLock, faShieldHalved }  from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon }        from "@fortawesome/react-fontawesome";
import { useNavigate }            from "react-router-dom";
import { ResetPasswordService }   from "../../../services/service/common/resetpasswordservice";
import logo                       from "../../../assets/turf_logo.png";
import stadium                    from "../../../assets/stadium.png";
import "./resetpassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();

  const {
    formData,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    loading,
    errorMessage,
    successMessage,
    passwordStatus,
    handleChange,
    handleSubmit,
    togglePassword,
    toggleConfirmPassword
  } = ResetPasswordService();

  return (
    <div className="reset-password-wrapper" style={{ backgroundImage: `url(${stadium})` }}>
      <div className="reset-password-overlay">
        <div className="reset-password-card">
          <img src={logo} alt="Field-Go" className="reset-password-logo" />

          <h2>Field-Go</h2>

          <p className="reset-password-subtitle">Reset Your Password</p>

          <div className="reset-password-divider"></div>

          <div className="reset-password-heading">
            <div className="reset-password-icon">
              <FontAwesomeIcon icon={faLock} />
            </div>

            <div>
              <h3>Create New Password</h3>
              <p>Enter a strong password for your account.</p>
            </div>
          </div>

          {errorMessage && <div className="reset-password-error">{errorMessage}</div>}

          {successMessage && (
            <div className="reset-password-success">
              <FontAwesomeIcon icon={faCircleCheck} />
              <span>{successMessage}</span>
            </div>
          )}

          <form className="reset-password-form" onSubmit={handleSubmit}>
            <div className="reset-password-input-wrapper">
              <FontAwesomeIcon icon={faLock} className="reset-password-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button type="button" className="reset-password-toggle" onClick={togglePassword}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>

            {formData.newPassword && (
              <div className="password-rules">
                <div className="password-rules-title">
                  <FontAwesomeIcon icon={faShieldHalved} />
                  <span>Password must contain</span>
                </div>

                <div className={passwordStatus.length ? "password-rule valid" : "password-rule"}>
                  <FontAwesomeIcon icon={faCheck} />
                  <span>At least 8 characters</span>
                </div>

                <div className={passwordStatus.upper ? "password-rule valid" : "password-rule"}>
                  <FontAwesomeIcon icon={faCheck} />
                  <span>One uppercase letter</span>
                </div>

                <div className={passwordStatus.lower ? "password-rule valid" : "password-rule"}>
                  <FontAwesomeIcon icon={faCheck} />
                  <span>One lowercase letter</span>
                </div>

                <div className={passwordStatus.number ? "password-rule valid" : "password-rule"}>
                  <FontAwesomeIcon icon={faCheck} />
                  <span>One number</span>
                </div>

                <div className={passwordStatus.special ? "password-rule valid" : "password-rule"}>
                  <FontAwesomeIcon icon={faCheck} />
                  <span>One special character</span>
                </div>
              </div>
            )}

            <div className="reset-password-input-wrapper">
              <FontAwesomeIcon icon={faLock} className="reset-password-input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button type="button" className="reset-password-toggle" onClick={toggleConfirmPassword}>
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </button>
            </div>

            {confirmPassword && (
              <div className={formData.newPassword === confirmPassword ? "password-match valid" : "password-match"}>
                <FontAwesomeIcon icon={faCheck} />
                <span>{formData.newPassword === confirmPassword ? "Passwords match" : "Passwords do not match"}</span>
              </div>
            )}

            <button type="submit" className="reset-password-button" disabled={loading}>
              {loading ? "Updating Password..." : "Reset Password"}
            </button>
          </form>

          <button type="button" className="reset-password-back" onClick={() => navigate("/login")}>
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;