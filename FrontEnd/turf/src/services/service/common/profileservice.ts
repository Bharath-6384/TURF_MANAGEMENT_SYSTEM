import { useEffect, useState }                     from "react";
import { useNavigate }                             from "react-router-dom";
import { getUserFromToken }                        from "../../service/common/auth";
import { ProfileModal }                            from "../../../model/common/profilemodel";
import { ApiService }                              from "../../common/apiservices/api-service";
import { GetNotifications, NotificationModel }     from "../../../model/common/notificationsmodel";

export const ProfileService = (): ProfileModal.ServiceReturn => {
  const [openProfile, setOpenProfile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate                      = useNavigate();
  const apiService                    = new ApiService();
  const user                          = getUserFromToken();

  const toggleProfileMenu = () => {
    setOpenProfile((prev) => !prev);
  };

  const openAccount = () => {
    setOpenProfile(false);

    if (user?.role === "admin") {
      navigate("/admin/adminprofile");
    } else {
      navigate("/user/userprofile");
    }
  };

  const openSettings = () => {
    setOpenProfile(false);

    if (user?.role === "admin") {
      navigate("/admin/settings");
    } else {
      navigate("/user/settings");
    }
  };

  const openNotifications = () => {
    if (user?.role === "admin") {
      navigate("/common/notifications");
    } else {
      navigate("/common/notifications");
    }
  };

  const fetchUnreadCount = async () => {
    try {
      if (!user?.email) {
        return;
      }

      const requestData: GetNotifications.Request = { email: user.email };

      const response = (await apiService.sendAuthRequest(GetNotifications.path, requestData, "POST")) as GetNotifications.Retval;

      if (!response.success) {
        return;
      }

      const notifications: NotificationModel.Notification[] = response.data?.notifications || [];

      const count = notifications.filter((notification) => !notification.is_read).length;

      setUnreadCount(count);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 5000);

    const handleNotificationsUpdated = (event: Event) => {
      const customEvent = event as CustomEvent;

      if (typeof customEvent.detail?.unreadCount === "number") {
        setUnreadCount(customEvent.detail.unreadCount);
      } else {
        fetchUnreadCount();
      }
    };

    window.addEventListener("notificationsUpdated", handleNotificationsUpdated);

    return () => {
      clearInterval(interval);
      window.removeEventListener("notificationsUpdated", handleNotificationsUpdated);
    };
  }, []);

  return {
    openProfile,
    toggleProfileMenu,
    openAccount,
    openSettings,
    openNotifications,
    unreadCount
  };
};