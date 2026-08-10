export namespace AuthContextModel {
  export type Role = "user" | "staff" | "admin" | "superadmin";
  export interface AuthUser {
    id?            : string | number;
    name           : string;
    email?         : string;
    role           : Role;
    token          : string;
  }
  export interface AuthContextType {
    user           : AuthUser | null;
    login          : (userData: AuthUser) => void;
    logout         : () => void;
    loading        : boolean;
  }
  export interface AuthProviderProps {
    children       : React.ReactNode;
  }
}