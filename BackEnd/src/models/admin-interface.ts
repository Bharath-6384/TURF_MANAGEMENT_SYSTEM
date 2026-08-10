export namespace RegisterTurf {
  export interface Request {
    turfName       : string;
    turfLocation   : string;
    dayPrice       : number;
    nightPrice     : number;
    email          : string;
    contactNo      : string;
  }
  export interface Params {
    adminId        : number;
  }
  export interface Turf {
    turfid         : number;
    turfname       : string;
    location       : string;
    day_price      : number;
    night_price    : number;
    email          : string;
    contact_no     : string;
    image_url      : string | null;
    status         : string;
  }
  export interface Response {
    turf           : Turf;
  }
  export const path = "/register-turf/:adminId";
}

export namespace GetAllTurfs {
  export interface Turf {
    turfid         : number;
    turfname       : string;
    location       : string;
    day_price      : number;
    night_price    : number;
    email          : string;
    contact_no     : string;
    image_url      : string | null;
  }
  export interface Response {
    data           : Turf[];
  }
  export const path = "/turfs";
}

export namespace UpdateTurf {
  export interface Params {
    turfid         : number;
  }
  export interface Request {
    turfname       : string;
    location       : string;
    day_price      : number;
    night_price    : number;
    email          : string;
    contact_no     : string;
    status         : string;
  }
  export interface Turf {
    turfid         : number;
    turfname       : string;
    location       : string;
    day_price      : number;
    night_price    : number;
    email          : string;
    contact_no     : string;
    image_url      : string | null;
    status         : string;
  }
  export interface Response {
    turf           : Turf;
  }
  export const path = "/update-turf/:turfid";
}

export namespace DeleteTurf {
  export interface Params {
    turfid         : number;
  }
  export interface Response {
    message        : string;
    turfid         : number;
  }
  export const path = "/delete-turf/:turfid";
}

export namespace GetAllBookings {
  export interface Booking {
    booking_id     : number;
    fullname       : string;
    turfid         : number;
    turfname       : string;
    date           : string;
    start_time     : string;
    end_time       : string;
    day_price      : number;
    night_price    : number;
    total_rate     : number;
    status         : string;
    email          : string;
  }
  export const path = "/bookings";
}

export namespace GetAllPayments {
  export interface Payment {
    paymentid      : number;
    bookingid      : number;
    amount         : number;
    paymentmode    : string;
    status         : string;
    createddate    : string;
    turfid         : number;
    turfname       : string;
    booking_date   : string;
    start_time     : string;
    end_time       : string;
    customer_email : string;
  }
  export const path = "/admin/payments";
}

export namespace GetAllUsers {
  export interface User {
    user_id        : number;
    email          : string;
    fullname       : string;
    phone          : string;
    datetime_reg   : string;
    role_name      : string;
  }
  export const path = "/users";
}

export namespace AdminDashboard {
  export interface Request {
    adminId        : number;
  }
  export interface Response {
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
  export const path = "/dashboard";
}

export namespace UpdateBooking {
  export interface Params {
    bookingId      : number;
  }
  export interface Request {
    status         : string;
  }
  export interface Booking {
    booking_id     : number;
    status         : string;
  }
  export interface Response {
    message        : string;
    booking        : Booking;
  }
  export const path = "/update-booking/:bookingId";
}

export namespace UpdateUser {
  export interface Params {
    userId         : number;
  }
  export interface Request {
    fullname       : string;
    email          : string;
    phone          : string;
  }
  export interface User {
    user_id        : number;
    fullname       : string;
    email          : string;
    phone          : string;
  }
  export interface Response {
    message        : string;
    user           : User;
  }
  export const path = "/update-user/:userId";
}