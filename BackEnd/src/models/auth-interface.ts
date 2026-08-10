import { JwtPayload } from "jsonwebtoken";

export namespace Login {
  export interface Request {
    email          : string;
    password       : string;
    role           : string;
  }
  export interface Response {
    statusCode     : number;
    success        : boolean;
    data           : LoginData;
  }
  interface LoginData {
    token          : string;
    email          : string;
    id             : number;
    name           : string;
    redirectTo     : string;
  }
  export const path = "/login";
}

export namespace RegisterUser {
  export interface Request {
    email             : string;
    password          : string;
    fullName          : string;
    phoneNumber       : string;
    registrationDate  : string;
  }
  export interface Response {
    message        : string;
  }
  export const path = "/register";
}

export interface JwtUser extends JwtPayload {
  id             : string;
  email          : string;
  role           : string;
}