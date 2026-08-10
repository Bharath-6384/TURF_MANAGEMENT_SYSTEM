import { Outlet }  from "react-router-dom";
import Sidebar     from "../sidebar/sidebar";
import Profile     from "../profile/profile";
import "./layout.css";

const Layout = () => {
  return (
    <div className="layout-container">
      <Sidebar />

      <div className="inner-layout">
        <Profile />

        <div className="layout-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;