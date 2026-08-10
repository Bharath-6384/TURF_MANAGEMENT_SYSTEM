export namespace SignupModel {
  export interface Request {
    email          : string;
    password       : string;
    fullname       : string;
    phone          : string;
  }
  export interface Response {
    id             : number;
    email          : string;
    fullname       : string;
    phone          : string;
    datetime_reg   : string;
    role_id        : number;
  }
  export const InitialData: Request = {
    email          : "",
    password       : "",
    fullname       : "",
    phone          : ""
  };
  export interface Retval {
    code           : number;
    success        : boolean;
    data           : Response;
    message?       : string;
  }
  export const path = "common/signup";
}

export namespace SignupMethods {
  export interface Methods {
    handleChange            : (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit            : (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    togglePassword          : () => void;
    toggleConfirmPassword   : () => void;
  }
}