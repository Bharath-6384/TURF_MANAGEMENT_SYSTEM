export namespace SearchBarModal {
  export type DataItem = Record<string, any>;
    export interface FilterParams {
      data                : DataItem[];
      search?             : string;
      statusFilter?       : string;
      searchableFields    : string[];
    }

    export type FilterFunction = (
      data                : DataItem[],
      search              : string,
      statusFilter        : string,
      searchableFields    : string[]
  ) => DataItem[];
}