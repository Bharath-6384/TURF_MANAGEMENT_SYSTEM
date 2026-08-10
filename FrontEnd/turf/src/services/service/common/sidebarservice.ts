import { Roles }                         from "../../constants/RoleConstants";
import { SidebarModel }                  from "../../../model/common/sidebarmodel";
import { getUserFromToken }              from "./auth";

export const SidebarService = () => {

  const getSidebarUser = (): SidebarModel.User => {
    const user = getUserFromToken();

    return {
      id: user?.id || "",
      role: user?.role || "",
      email: user?.email || "",
    };
  };

  const isDashboardActive = (role: string): boolean => {
    const path = window.location.pathname;

    if (
      (role === Roles.USER && path.startsWith("/dashboard")) ||
      (role === Roles.ADMIN && path.startsWith("/adminDashboard"))
    ) {
      return true;
    }

    return false;
  };

  return {
    getSidebarUser,
    isDashboardActive,
  };
};