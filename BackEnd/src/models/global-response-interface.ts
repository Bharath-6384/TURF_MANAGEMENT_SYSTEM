export namespace Response {
  export interface Success<T> {
    code           : number;
    success        : boolean;
    data           : T;
  }
  
  export interface Error {
    code           : number;
    success        : boolean;
    data           : {
      errorMsg       : string;
    };
  }
}