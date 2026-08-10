export namespace TurfsModel {
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
    data           : Turf[];
  }
  export interface Filter {
    label          : string;
    value          : string;
  }
  export interface Params {
  }
  export const path = "admin/turfs";
}

export namespace UpdateTurf {
  export interface Request {
    turfname       : string;
    location       : string;
    day_price      : number;
    night_price    : number;
    email          : string;
    contact_no     : string;
    status         : string;
    image          : File | null;
  }
  export interface Retval {
    code           : number;
    success        : boolean;
    data           : TurfsModel.Turf;
  }
  export const path = "admin/update-turf";
}

export namespace DeleteTurf {
  export interface Retval {
    code           : number;
    success        : boolean;
    data           : {
      message        : string;
      turfid         : number;
    };
  }
  export const path = "admin/delete-turf";
}

export namespace TurfsMethods {
  export interface Methods {
    fetchTurfs                : () => Promise<void>;
    handleSetSearchText       : (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectTurf          : (turf: TurfsModel.Turf) => void;
    handleSetActiveFilter     : (filter: string) => void;
    handleUpdateSelectedTurf  : (field: keyof TurfsModel.Turf, value: string | number) => void;
  }
}