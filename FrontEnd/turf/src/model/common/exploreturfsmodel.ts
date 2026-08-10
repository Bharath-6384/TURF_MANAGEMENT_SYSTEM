export namespace ExploreTurfsModel {
  export interface Turf {
    turfid         : number;
    turfname       : string;
    location       : string;
    day_price      : number;
    night_price    : number;
    email          : string;
    contact_no     : string;
    image?         : string;
  }
  export interface FilterData {
    searchText     : string;
    sport          : string;
    location       : string;
    priceRange     : string;
  }
}