export namespace BookTurfModel {
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
  export interface Retval {
    success        : boolean;
    data           : Turf[];
  }
  export interface DateItem {
    day            : string;
    date           : number;
    fullDate       : string;
  }
  export interface Slot {
    startTime      : string;
    endTime        : string;
    available      : boolean;
  }
  export interface GetSlotRequest {
    turfId         : number;
    date           : string;
  }
  export interface GetSlotResponse {
    success        : boolean;
    data           : {
      turfId         : number;
      date           : string;
      slots          : Slot[];
    };
  }
  export const path = "user/turfs";
}

export namespace BookTurf {
  export interface Request {
    email          : string;
    turfId         : number;
    date           : string;
    startTime      : string;
    endTime        : string;
  }
  export interface Response {
    message        : string;
    totalRate      : number;
  }
  export interface Retval {
    success        : boolean;
    data           : Response;
  }
  export const path = "user/bookturf";
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
  export interface Retval {
    success        : boolean;
    data           : Response;
  }
  export const path = "user/getslot";
}

export namespace BookTurfMethods {
  export interface Methods {
    fetchTurfs()        : Promise<void>;
    fetchSlots()        : Promise<void>;
    handleBookTurf()    : Promise<void>;
  }
}