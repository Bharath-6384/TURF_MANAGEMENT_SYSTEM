export namespace UsersModel {
  export interface User {
    user_id        : number;
    email          : string;
    fullname       : string;
    phone          : string;
    datetime_reg   : string;
    role_name      : string;
  }
  export interface Filter {
    label          : string;
    value          : string;
  }
  export interface Retval {
    code           : number;
    success        : boolean;
    data           : User[];
  }
  export const path = "admin/users";
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
  export interface Retval {
    code           : number;
    success        : boolean;
    data           : Response;
  }
  export const path = "admin/update-user";
}

export namespace UsersMethods {
  export interface Methods {
    fetchUsers            : () => Promise<void>;
    handleSetSearchText    : (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSetActiveFilter  : (filter: string) => void;
    handleSelectUser       : (user: UsersModel.User) => void;
  }
}