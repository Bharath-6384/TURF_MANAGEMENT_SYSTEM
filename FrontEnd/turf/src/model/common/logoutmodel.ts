export namespace LogoutMethods {
  export interface Methods {
    handleLogoutClick : () => void;
    cancelLogout      : () => void;
    confirmLogout     : () => void;
  }
}

export namespace LogoutIcons {
  export interface Icons {
    logout            : React.FunctionComponent< React.SVGProps<SVGSVGElement>>;
  }
}