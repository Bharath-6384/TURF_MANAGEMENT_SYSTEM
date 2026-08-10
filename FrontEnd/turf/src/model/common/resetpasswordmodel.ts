export namespace ResetPasswordModel {
  export interface Request {
    newPassword    : string;
    resetToken     : string;
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
  export const path = "common/reset-password";
  export const InitialData: Request = {
    newPassword    : "",
    resetToken     : ""
  };
}

export namespace ResetPasswordMethods {
  export interface Methods {
    handleChange            : (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit            : (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    togglePassword          : () => void;
    toggleConfirmPassword   : () => void;
  }
}