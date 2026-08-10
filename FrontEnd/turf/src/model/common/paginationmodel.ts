export namespace PaginationModel {
  export interface Props {
    page           : number;
    totalPages     : number;
    onPageChange   : (page: number) => void;
  }
  export interface ServiceReturn {
    page           : number;
    totalPages     : number;
    goToPage       : (page: number) => void;
  }
}