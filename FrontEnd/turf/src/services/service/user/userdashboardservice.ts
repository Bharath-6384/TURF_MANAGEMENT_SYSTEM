import { useEffect, useState }                    from "react";
import { ApiService }                             from "../../common/apiservices/api-service";
import { UserDashboardModel, UserDashboardMethods } from "../../../model/user/userdashboardmodel";
import { getUserFromToken }                       from "../../service/common/auth";

export const UserDashboardService = () => {

  const apiService                                = new ApiService();

  const [dashboardData, setDashboardData]         = useState<UserDashboardModel.Data>(UserDashboardModel.InitialData);
  const [loading, setLoading]                     = useState(true);
  const [error, setError]                         = useState("");

  const fetchDashboard: UserDashboardMethods.Methods["fetchDashboard"] = async () => {
    try {
      setLoading(true);
      setError("");

      const user = getUserFromToken();

      if (!user) {
        setError("User not found.");
        return;
      }

      const response = (await apiService.sendAuthRequest(
        UserDashboardModel.path,
        { userId: user.id },
        "POST"
      )) as UserDashboardModel.Retval;

      if (response.success) {
        setDashboardData(response.data);

      } else {
        setError("Failed to load dashboard.");
      }

    } catch (err: any) {
      console.error("Dashboard Error:", err);
      setError(err.message || "Something went wrong.");

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
    error,
    fetchDashboard,
  };
};