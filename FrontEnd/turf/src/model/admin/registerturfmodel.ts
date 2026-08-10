export namespace RegisterTurfModel {
  export interface FormData {
    turfName       : string;
    turfLocation   : string;
    dayPrice       : number;
    nightPrice     : number;
    email          : string;
    contactNo      : string;
    image          : File | null;
  }
  export const InitialData: FormData = {
    turfName       : "",
    turfLocation   : "",
    dayPrice       : 0,
    nightPrice     : 0,
    email          : "",
    contactNo      : "",
    image          : null,
  };
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
  export interface Retval {
    code           : number;
    success        : boolean;
    message?       : string;
    data           : {
      turf           : Turf;
    };
  }
  export const path = "admin/register-turf";
}

export namespace RegisterTurfMethods {
  export interface methods {
    handleFormData     : (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleImageChange  : (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
}