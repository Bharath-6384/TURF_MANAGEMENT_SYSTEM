import ReactDOM          from "react-dom";
import { LuLogOut }      from "react-icons/lu";
import { LogoutService } from "../../../services/service/common/logoutservice";
import { LogoutIcons }   from "../../../model/common/logoutmodel";
import "./logout.css";

const Logout = () => {
  const Icon = LuLogOut as LogoutIcons.Icons["logout"];
  const { showModal, cancelLogout, confirmLogout, handleLogoutClick } = LogoutService();

  const modal = showModal ? (
    <div className="logout-modal-overlay">
      <div className="logout-modal">
        <h3>Confirm Logout</h3>
        <p>Are you sure you want to log out?</p>
        <div className="logout-modal-buttons">
          <button className="cancel-btn" onClick={cancelLogout}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={confirmLogout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className="logout-container">
        <div className="logout-buttonin" onClick={handleLogoutClick}>
          <Icon className="logout-icon" />
          <span>Logout</span>
        </div>
      </div>

      {ReactDOM.createPortal(modal, document.body)}
    </>
  );
};

export default Logout;