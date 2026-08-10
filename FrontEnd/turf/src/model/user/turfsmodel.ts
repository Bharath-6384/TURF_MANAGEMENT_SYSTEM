export namespace TurfsModel {
  export interface Turf {
    turfid         : number;
    turfname       : string;
    location       : string;
    day_price      : number;
    night_price    : number;
    email          : string;
    status         : string;
    contact_no     : string;
    image_url      : string | null;
  }
  export interface Retval {
    code           : number;
    success        : boolean;
    data           : Turf[];
  }
  export const path = "user/turfs";
}

export namespace TurfsMethods {
  export interface Methods {
    fetchTurfs()   : Promise<void>;
  }
}