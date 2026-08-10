export namespace SidebarModel {
  export interface User {
    id                  : string;
    role                : string;
    email               : string;
  }
}

export namespace SidebarIcons {
  export interface Icons {
    icons               : React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  }
}
