export namespace UserDashboardModel {
  export interface Params {
    userId             : number;
  }
  export interface Retval {
    success            : boolean;
    data               : Data;
  }
  export interface Data {
    name               : string;
    totalBookings      : number;
    upcomingBookings   : number;
    completedBookings  : number;
    cancelledBookings  : number;
  }
  export interface Message {
    message?           : string;
  }
  export const InitialData: Data = {
    name               : "",
    totalBookings      : 0,
    upcomingBookings   : 0,
    completedBookings  : 0,
    cancelledBookings  : 0,
  };
  export const path = "user/dashboard";
}

export namespace UserDashboardMethods {
  export interface Methods {
    fetchDashboard   : () => Promise<void>;
  }
}