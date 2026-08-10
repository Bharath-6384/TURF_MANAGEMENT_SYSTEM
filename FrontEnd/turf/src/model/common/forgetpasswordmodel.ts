export namespace ForgotPassword {
  export interface Request {
    email          : string;
  }
  export interface Response {
    message        : string;
  }
  export interface Retval {
    code           : number;
    success        : boolean;
    data           : Response;
    message?       : string;
  }
  export const InitialData: Request = {
    email          : ""
  };
  export const path = "common/forgot-password";
}

export namespace ForgotPasswordMethods {
  export interface Methods {
    handleFormData        : (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleForgotPassword  : (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  }
}