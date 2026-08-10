export namespace BookingsModel {
  export interface Booking {
    booking_id     : number;
    fullname       : string;
    date           : string;
    start_time     : string;
    end_time       : string;
    total_rate     : number;
    status         : string;
    turfid         : number;
    turfname       : string;
    day_price      : number;
    night_price    : number;
    email          : string;
  }
  export interface Filter {
    label          : string;
    value          : string;
  }
  export interface Params {
  }
  export interface Retval {
    code           : number;
    success        : boolean;
    data           : Booking[];
  }
  export const path = "admin/bookings";
}

export namespace UpdateBooking {
  export interface Params {
    bookingId      : number;
  }
  export interface Request {
    status         : string;
  }
  export interface Response {
    message        : string;
    booking        : BookingsModel.Booking;
  }
  export interface Retval {
    code           : number;
    success        : boolean;
    data           : Response;
  }
  export const path = "admin/update-booking";
}

export namespace BookingsMethods {
  export interface Methods {
    fetchBookings          : () => Promise<void>;
    handleSetSearchText    : (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSetActiveFilter  : (filter: string) => void;
    handleSelectBooking    : (booking: BookingsModel.Booking) => void;
  }
}