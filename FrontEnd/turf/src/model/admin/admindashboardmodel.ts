export namespace AdminDashboardModel {
  export interface Params {
    adminId          : number;
  }
  export interface Retval {
    code             : number;
    success          : boolean;
    data             : Data;
  }
  export interface Data {
    adminName          : string;
    totalTurfs         : number;
    totalCustomers     : number;
    totalBookings      : number;
    todayBookings      : number;
    pendingBookings    : number;
    completedBookings  : number;
    totalRevenue       : number;
    availableTurfs     : number;
  }
  export interface InitialData {
    adminName          : string;
    totalTurfs         : number;
    totalCustomers     : number;
    totalBookings      : number;
    todayBookings      : number;
    pendingBookings    : number;
    completedBookings  : number;
    totalRevenue       : number;
    availableTurfs     : number;
  }
  export const InitialData: InitialData = {
    adminName          : "",
    totalTurfs         : 0,
    totalCustomers     : 0,
    totalBookings      : 0,
    todayBookings      : 0,
    pendingBookings    : 0,
    completedBookings  : 0,
    totalRevenue       : 0,
    availableTurfs     : 0,
  };
  export const path = "admin/dashboard";
}

export namespace AdminDashboardMethods {
  export interface Methods {
    fetchDashboard : () => Promise<void>;
  }
}