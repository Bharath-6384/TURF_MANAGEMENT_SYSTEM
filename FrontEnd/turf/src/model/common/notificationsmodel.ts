import { ChangeEvent } from "react";

export namespace NotificationModel {
  export interface Notification {
    notification_id    : number;
    receiver_id         : number;
    role_id             : number;
    title               : string;
    message             : string;
    notification_type   : "booking" | "success" | "warning" | "info";
    reference_id        : number | null;
    reference_type      : string | null;
    is_read             : boolean;
    created_at          : string;
    location?           : string;
  }
}

export namespace MarkAllNotificationsRead {
  export interface Request {
    email          : string;
  }
  export interface Response {
    message        : string;
  }
  export interface Retval {
    code           : number;
    success        : boolean;
    message        : string;
    data?          : Response;
  }
  export const path = "common/markallnotificationsread";
}

export namespace GetNotifications {
  export interface Request {
    email          : string;
  }
  export interface Response {
    notifications  : NotificationModel.Notification[];
  }
  export interface Retval {
    code           : number;
    success        : boolean;
    message        : string;
    data?          : Response;
  }
  export const path = "common/getnotifications";
}

export namespace MarkNotificationRead {
  export interface Request {
    notificationId : number;
  }
  export interface Response {
    message        : string;
  }
  export interface Retval {
    code           : number;
    success        : boolean;
    message        : string;
    data?          : Response;
  }
  export const path = "common/marknotificationread";
}

export namespace NotificationMethods {
  export interface Methods {
    fetchNotifications    : () => Promise<void>;
    handleSearch          : (e: ChangeEvent<HTMLInputElement>) => void;
    handleFilterChange    : (filter: "all" | "unread") => void;
    markAsRead            : (notificationId: number) => Promise<void>;
    markAllAsRead         : () => Promise<void>;
    handleToggleExpand    : (notificationId: number, isRead: boolean) => void;
  }
}