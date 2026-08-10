export namespace ForgotPasswordOtpModel {
  export interface Request {
    email          : string;
    otp            : string;
  }
  export interface Response {
    message        : string;
    resetToken     : string;
  }
  export interface Retval {
    code           : number;
    success        : boolean;
    data           : Response;
    message?       : string;
  }
  export const path = "common/verify-password-otp";
  export const ResendPath = "common/forgot-password";
  export const InitialData: Request = {
    email          : "",
    otp            : ""
  };
}

export namespace ForgotPasswordOtpMethods {
  export interface Methods {
    handleOtpChange   : (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleVerifyOtp   : (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    handleResendOtp   : () => Promise<void>;
  }
}