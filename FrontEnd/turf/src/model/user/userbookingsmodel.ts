export namespace GetUserBookings {
  export const path = "user/getuserbookings";
  export interface Request {
    userId         : string;
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
  export interface Retval {
    success        : boolean;
    data           : Booking[] & {
      message?       : string;
    };
  }
}