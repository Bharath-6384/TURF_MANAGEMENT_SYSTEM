export namespace AdminProfileModel {
  export interface Profile {
    id             : number;
    email          : string;
    fullname       : string;
    phone          : string | null;
    datetime_reg   : string;
    role           : string;
  }
  export interface Request {
    email          : string;
  }
  export interface UpdateRequest {
    email          : string;
    fullname       : string;
    phone          : string;
  }
  export interface Retval {
    success        : boolean;
    data           : Profile;
  }
  export interface UpdateRetval {
    success        : boolean;
    data           : Profile;
  }
  export const path = "common/profile";
  export const updatePath = "common/updateprofile";
}

export namespace AdminProfileMethods {
  export interface Methods {
    fetchProfile        : () => Promise<void>;
    handleAvatarChange  : (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleEdit          : () => void;
    handleCancel        : () => void;
    handleChange        : (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSave          : () => Promise<void>;
  }
}