import { FaUserCircle, FaUserCog, FaCogs, FaBell }  from "react-icons/fa";
import { ProfileService }                           from "../../../services/service/common/profileservice";
import { ProfileIcons }                             from "../../../model/common/profilemodel";
import Header                                       from "../header/header";
import "./profile.css";

const Profile = () => {
  const {
    openProfile,
    toggleProfileMenu,
    openAccount,
    openSettings,
    openNotifications,
    unreadCount
  } = ProfileService();

  const Icon1 = FaUserCircle as ProfileIcons.Icons["proficon"];
  const Icon2 = FaUserCog as ProfileIcons.Icons["proficon"];
  const Icon3 = FaCogs as ProfileIcons.Icons["proficon"];

  return (
    <>
      <Header />

      <div className="top-right-icons">
        <div className="notification-icon" onClick={openNotifications}>
          <FaBell />

          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </div>

        <div className="profile-dropdown" onClick={toggleProfileMenu}>
          <Icon1 className="profile-icon" />

          <div className={`dropdown-menu ${openProfile ? "hover-effect-show" : ""}`}>
            <div className="dropdown-item" onClick={openAccount}>
              <Icon2 />
              <span>Account</span>
            </div>

            <div className="dropdown-item" onClick={openSettings}>
              <Icon3 />
              <span>Settings</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;