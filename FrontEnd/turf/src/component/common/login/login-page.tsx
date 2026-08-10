import { faCheck, faEye, faEyeSlash, faLock, faUser }  from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon }                             from "@fortawesome/react-fontawesome";
import { Link }                                        from "react-router-dom";
import { Roles }                                       from "../../../services/constants/RoleConstants";
import { LoginService }                                from "../../../services/service/common/loginservice";
import logo                                            from "../../../assets/turf_logo.png";
import stadium                                         from "../../../assets/stadium.png";
import "./login-page.css";

const LoginPage = () => {
  const {
    formData,
    rememberMe,
    showPassword,
    errorMessage,
    handleFormData,
    handleSetRememberMe,
    handleSetShowPassword,
    handleLogin,
  } = LoginService();

  return (
    <div className="login-wrapper" style={{ backgroundImage: `url(${stadium})` }}>
      <div className="login-overlay">
        <div className="login-card">
          <img src={logo} alt="logo" className="login-logo" />

          <h2>Field-Go</h2>

          <p className="login-subtitle">Field Booking Portal</p>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <form>
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faUser} className="icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleFormData}
                required
              />
            </div>

            <div className="input-wrapper">
              <FontAwesomeIcon icon={faLock} className="icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleFormData}
                required
              />
              <span className="password-toggle" onClick={handleSetShowPassword}>
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </span>
            </div>

            <div className="role-selector">
              {Object.values(Roles).map((role) => (
                <button
                  key={role}
                  type="button"
                  className={formData.role === role ? "role-btn active" : "role-btn"}
                  onClick={() =>
                    handleFormData({
                      target: { name: "role", value: role },
                    } as React.ChangeEvent<HTMLSelectElement>)
                  }
                >
                  {role.charAt(0).toUpperCase() + role.slice(1).replace("-", " ")}
                </button>
              ))}
            </div>

            <div className="remember-me">
              <label>
                <div
                  className={`custom-checkbox ${rememberMe ? "checked" : ""}`}
                  onClick={handleSetRememberMe}
                >
                  {rememberMe && <FontAwesomeIcon icon={faCheck} />}
                </div>
                Remember Me
              </label>
            </div>

            <button type="button" className="login-button" onClick={handleLogin}>
              Login to Portal
            </button>

            <Link className="forgot-password" to="/forgotPassword">
              Forgot Password?
            </Link>

            <div className="signup-prompt">
              <span>Don't have an account?</span>
              <Link to="/signup">Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;