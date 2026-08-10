export namespace ProfileModal {
  export interface ServiceReturn {
    openProfile          : boolean;
    toggleProfileMenu    : () => void;
    openAccount          : () => void;
    openSettings         : () => void;
    openNotifications    : () => void;
    unreadCount          : number;
  }
}

export namespace ProfileIcons {
  export interface Icons {
    proficon             : React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  }
}