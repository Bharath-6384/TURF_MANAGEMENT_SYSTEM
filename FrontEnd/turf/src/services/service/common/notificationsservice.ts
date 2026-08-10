import { useEffect, useState } from "react";
import { GetNotifications, MarkAllNotificationsRead, MarkNotificationRead, NotificationMethods, NotificationModel }  from "../../../model/common/notificationsmodel";
import { ApiService }                                                                                                from "../../common/apiservices/api-service";
import { getUserFromToken }                                                                                          from "../common/auth";

export const NotificationsService = () => {
  const apiService                           = new ApiService();
  const user                                 = getUserFromToken();
  const [notifications, setNotifications]    = useState<NotificationModel.Notification[]>([]);
  const [loading, setLoading]                = useState<boolean>(false);
  const [errorMessage, setErrorMessage]      = useState<string>("");
  const [searchText, setSearchText]          = useState<string>("");
  const [activeFilter, setActiveFilter]      = useState<"all" | "unread">("all");
  const [expandedId, setExpandedId]          = useState<number | null>(null);

  const fetchNotifications: NotificationMethods.Methods["fetchNotifications"] = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const requestData: GetNotifications.Request = {
        email: user?.email || ""
      };

      const response = (await apiService.sendAuthRequest(GetNotifications.path, requestData, "POST")) as GetNotifications.Retval;

      if (!response.success) {
        setErrorMessage(response.message || "Unable to fetch notifications.");
        return;
      }

      setNotifications(response.data?.notifications || []);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error?.response?.data?.message || error?.message || "Unable to fetch notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSearch: NotificationMethods.Methods["handleSearch"] = (e) => {
    setSearchText(e.target.value);
  };

  const handleFilterChange: NotificationMethods.Methods["handleFilterChange"] = (filter) => {
    setActiveFilter(filter);
  };

  let filteredNotifications = [...notifications];

  if (activeFilter === "unread") {
    filteredNotifications = filteredNotifications.filter((notification) => !notification.is_read);
  }

  if (searchText.trim()) {
    const search = searchText.toLowerCase().trim();
    filteredNotifications = filteredNotifications.filter(
      (notification) =>
        notification.title.toLowerCase().includes(search) ||
        notification.message.toLowerCase().includes(search)
    );
  }

  const totalNotifications = notifications.length;
  const unreadNotifications = notifications.filter((notification) => !notification.is_read).length;

  const today = new Date();
  const todayNotifications = filteredNotifications.filter((notification) => {
    const notificationDate = new Date(notification.created_at);
    return notificationDate.toDateString() === today.toDateString();
  }).length;

  const markAsRead: NotificationMethods.Methods["markAsRead"] = async (notificationId) => {
    try {
      const requestData: MarkNotificationRead.Request = { notificationId };

      const response = (await apiService.sendAuthRequest(MarkNotificationRead.path, requestData, "POST")) as MarkNotificationRead.Retval;

      if (!response.success) {
        return;
      }

      setNotifications((previous) =>
        previous.map((notification) =>
          notification.notification_id === notificationId ? { ...notification, is_read: true } : notification
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead: NotificationMethods.Methods["markAllAsRead"] = async () => {
    try {
      const requestData: MarkAllNotificationsRead.Request = {
        email: user?.email || ""
      };

      const response = (await apiService.sendAuthRequest(MarkAllNotificationsRead.path, requestData, "POST")) as MarkAllNotificationsRead.Retval;

      if (!response.success) {
        return;
      }

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          is_read: true
        }))
      );

      window.dispatchEvent(
        new CustomEvent("notificationsUpdated", {
          detail: {
            unreadCount: 0
          }
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleExpand: NotificationMethods.Methods["handleToggleExpand"] = (notificationId, isRead) => {
    setExpandedId((prev) => (prev === notificationId ? null : notificationId));

    if (!isRead) {
      markAsRead(notificationId);
    }
  };

  return {
    notifications,
    filteredNotifications,
    loading,
    errorMessage,
    searchText,
    activeFilter,
    totalNotifications,
    unreadNotifications,
    todayNotifications,
    expandedId,
    setActiveFilter: handleFilterChange,
    handleMarkAsRead: markAsRead,
    markAllAsRead,
    handleSearch,
    fetchNotifications,
    handleToggleExpand
  };
};