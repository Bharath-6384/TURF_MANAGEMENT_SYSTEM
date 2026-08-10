export namespace LoginModel {
  export interface Params {
    email          : string;
    password       : string;
    role           : string;
  }
  export interface Retval {
    success        : boolean;
    data           : Response;
  }
  export interface Response {
    token          : string;
    email          : string;
    id             : number;
    name           : string;
    redirectTo     : string;
  }
  export interface Message {
    message?       : string;
  }
  export interface RedirectMap {
    [key: string]  : string;
  }
  export const InitialData: Params = {
    email          : "",
    password       : "",
    role           : "user",
  };
  export const path = "auth/login";
}

export namespace LoginMethods {
  export interface Methods {
    handleFormData          : (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSetShowPassword   : () => void;
    handleSetRememberMe     : () => void;
  }
}