import { NavLink, useLocation }                                          from "react-router-dom";
import { LuLayoutDashboard, LuCalendarCheck, LuUserPlus, LuUsers }       from "react-icons/lu";
import Logout                                                            from "../logout/logout";
import { Roles }                                                         from "../../../services/constants/RoleConstants";
import { SidebarService }                                                from "../../../services/service/common/sidebarservice";
import { SidebarModel }                                                  from "../../../model/common/sidebarmodel";
import "./sidebar.css";

const Sidebar = () => {
  const { getSidebarUser } = SidebarService();

  const user: SidebarModel.User = getSidebarUser();
  const role = user.role;
  const location = useLocation();

  const isDashboardActive =
    role === Roles.ADMIN
      ? location.pathname.startsWith("/admin/dashboard") ||
        location.pathname.startsWith("/admin/adminprofile") ||
        location.pathname.startsWith("/common/notifications")
      : location.pathname.startsWith("/user/dashboard") ||
        location.pathname.startsWith("/user/userprofile") ||
        location.pathname.startsWith("/common/notifications");

  return (
    <div className="bottom-nav">
      <NavLink
        to={role === Roles.ADMIN ? "/admin/dashboard" : "/user/dashboard"}
        className={isDashboardActive ? "nav-item active" : "nav-item"}
      >
        <LuLayoutDashboard className="menu-icon" />
        <span>Dashboard</span>
      </NavLink>

      {role === Roles.USER && (
        <>
          <NavLink
            to="/user/turfs"
            className={
              location.pathname.startsWith("/user/turfs") || location.pathname.startsWith("/user/bookturf")
                ? "nav-item active"
                : "nav-item"
            }
          >
            <LuCalendarCheck className="menu-icon" />
            <span>Book Turf</span>
          </NavLink>

          <NavLink
            to="/user/bookings"
            className={location.pathname.startsWith("/user/bookings") ? "nav-item active" : "nav-item"}
          >
            <LuUsers className="menu-icon" />
            <span>Bookings</span>
          </NavLink>
        </>
      )}

      {role === Roles.ADMIN && (
        <>
          <NavLink
            to="/admin/bookings"
            className={location.pathname.startsWith("/admin/bookings") ? "nav-item active" : "nav-item"}
          >
            <LuCalendarCheck className="menu-icon" />
            <span>Bookings</span>
          </NavLink>

          <NavLink
            to="/admin/turfs"
            className={location.pathname.startsWith("/admin/turfs") ? "nav-item active" : "nav-item"}
          >
            <LuUsers className="menu-icon" />
            <span>Turfs</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            className={location.pathname.startsWith("/admin/users") ? "nav-item active" : "nav-item"}
          >
            <LuUsers className="menu-icon" />
            <span>Customers</span>
          </NavLink>

          <NavLink
            to="/admin/registerturf"
            className={location.pathname.startsWith("/admin/registerturf") ? "nav-item active" : "nav-item"}
          >
            <LuUserPlus className="menu-icon" />
            <span>Register Turf</span>
          </NavLink>
        </>
      )}

      <div className="nav-item logout-item">
        <Logout />
      </div>
    </div>
  );
};

export default Sidebar;