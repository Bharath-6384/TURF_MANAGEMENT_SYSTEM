export namespace BookTurf {
  export interface Request {
    email          : string;
    turfId         : number;
    date           : string;
    startTime      : string;
    endTime        : string;
    totalRate      : number;
  }
  export interface Response {
    message        : string;
    totalRate      : number;
  }
  export const path = "/bookturf";
}

export namespace GetSlot {
  export interface Request {
    turfId         : number;
    date           : string;
  }
  export interface Slot {
    startTime      : string;
    endTime        : string;
    available      : boolean;
  }
  export interface Response {
    turfId         : number;
    date           : string;
    slots          : Slot[];
  }
  export const path = "/getslot";
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

export namespace UserDashboard {
  export interface Request {
    userId         : number;
  }
  export interface Response {
    name               : string;
    totalBookings      : number;
    upcomingBookings   : number;
    completedBookings  : number;
    missedBookings     : number;
    unpaidBookings     : number;
  }
  export const path = "/dashboard";
}

export namespace GetUserBookings {
  export interface Request {
    userId         : number;
  }
  export interface Booking {
    booking_id     : number;
    turfid         : number;
    turfname       : string;
    location       : string;
    date           : string;
    start_time     : string;
    end_time       : string;
    total_rate     : number;
    status         : string;
  }
  export const path = "/getuserbookings";
}