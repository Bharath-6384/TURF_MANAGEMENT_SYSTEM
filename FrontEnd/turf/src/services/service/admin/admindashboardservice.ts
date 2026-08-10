import { useEffect, useState }                     from "react";
import { ApiService }                              from "../../common/apiservices/api-service";
import { AdminDashboardModel }                     from "../../../model/admin/admindashboardmodel";
import { getUserFromToken }                        from "../../service/common/auth";

export const AdminDashboardService = () => {
  const [dashboardData, setDashboardData]           = useState<AdminDashboardModel.Data>(AdminDashboardModel.InitialData);
  const [loading, setLoading]                       = useState<boolean>(true);
  const [errorMessage, setErrorMessage]             = useState<string>("");
  const apiService                                  = new ApiService();

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const user     = getUserFromToken();
      const response = await apiService.sendAuthRequest(AdminDashboardModel.path, { adminId: user?.id }, "POST") as AdminDashboardModel.Retval;

      if (response.success) {
        setDashboardData(response.data);
      } else {
        setErrorMessage("Failed to load dashboard.");
      }
    } catch (error: any) {
      console.error("Dashboard Error:", error);
      setErrorMessage("Error loading dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    dashboardData,
    loading,
    errorMessage,
  };
};