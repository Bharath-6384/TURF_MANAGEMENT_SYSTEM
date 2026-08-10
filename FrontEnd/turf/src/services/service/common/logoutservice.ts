import { useState }                              from "react";
import { useNavigate }                           from "react-router-dom";
import { useAuth }                               from "../../../auth/authcontext";
import { LogoutMethods }                         from "../../../model/common/logoutmodel";

export const LogoutService = () => {
  const [showModal, setShowModal]                = useState<boolean>(false);
  const navigate                                 = useNavigate();
  const { logout }                               = useAuth();

  const handleLogoutClick: LogoutMethods.Methods["handleLogoutClick"] = () => {
    setShowModal(true);
  };

  const cancelLogout: LogoutMethods.Methods["cancelLogout"] = () => {
    setShowModal(false);
  };

  const confirmLogout: LogoutMethods.Methods["confirmLogout"] = () => {
    try {
      logout(); // Clears auth state and localStorage
      navigate("/login", { replace: true });
    } catch (error: any) {
      console.error("Error during logout:", error);
      alert("Error during logout. Please try again later.");
    }
  };

  return {
    showModal,
    handleLogoutClick,
    cancelLogout,
    confirmLogout,
  };
};