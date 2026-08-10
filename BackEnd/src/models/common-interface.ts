export namespace ForgotPassword {
  export interface Request {
    email          : string;
  }
  export interface Response {
    message        : string;
    email?         : string;
    role?          : string;
  }
  export type email = string;
  export const path = "/forgot-password";
}

export namespace VerifyPasswordOtp {
  export interface Request {
    email          : string;
    otp            : string;
  }
  export interface Response {
    success        : boolean;
    message        : string;
    token?         : string;
  }
  export const path = "/verify-password-otp";
}

export namespace ResetPassword {
  export interface Request {
    newPassword    : string;
    resetToken     : string;
  }
  export interface Response {
    message        : string;
    email?         : string;
  }
  export const path = "/reset-password";
}

export namespace GetProfile {
  export interface Request {
    email          : string;
  }
  export interface Profile {
    id             : number;
    email          : string;
    fullname       : string;
    phone          : string | null;
    datetime_reg   : string;
    role           : string;
  }
  export const path = "/profile";
}

export namespace UpdateProfile {
  export interface Request {
    email          : string;
    fullname       : string;
    phone          : string;
  }
  export interface Profile {
    id             : number;
    email          : string;
    fullname       : string;
    phone          : string | null;
    datetime_reg   : string;
    role           : string;
  }
  export const path = "/updateprofile";
}

export namespace Signup {
  export interface Request {
    email          : string;
    password       : string;
    fullname       : string;
    phone          : string;
  }
  export interface Response {
    id             : number;
    email          : string;
    fullname       : string;
    phone          : string;
    datetime_reg   : string;
    role_id        : number;
  }
  export const path = "/signup";
}

export namespace GetNotifications {
  export interface Request {
    email          : string;
  }
  export interface Notification {
    notificationId : number;
    title          : string;
    message        : string;
    type           : string;
    isRead         : boolean;
    referenceId    : number;
    referenceType  : string;
    createdAt      : string;
  }
  export interface Response {
    notifications  : Notification[];
  }
  export interface Retval {
    code           : number;
    success        : boolean;
    data?          : Response;
    message?       : string;
  }
  export const path = "/getnotifications";
}

export namespace MarkAllNotificationsRead {
  export interface Request {
    email          : string;
  }
  export interface Response {
    message        : string;
    updatedCount   : number;
  }
  export interface Retval {
    code           : number;
    success        : boolean;
    message        : string;
    data?          : Response;
  }
  export const path = "/markallnotificationsread";
}

export namespace CreateNotificationRecord {
  export interface Params {
    receiverId       : number;
    roleId           : number;
    title            : string;
    message          : string;
    notificationType : string;
    referenceId      : number;
    referenceType    : string;
  }
}