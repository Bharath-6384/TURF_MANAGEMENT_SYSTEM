import { BookingsModel } from "../../model/admin/bookingsmodel";
import { TurfsModel } from "../../model/admin/turfsmodel";
import { UsersModel } from "../../model/admin/usersmodel";

export const BookingFilters: BookingsModel.Filter[] = [
  { label: "All",       value: "All" },
  { label: "Completed", value: "Completed" },
  { label: "Unpaid",    value: "Unpaid" },
  { label: "Missed",    value: "Missed" },
];

export const TurfFilters: TurfsModel.Filter[] = [
  { label: "All",         value: "All" },
  { label: "Under ₹1000", value: "Under1000" },
  { label: "₹1000+",      value: "1000Plus" },
];

export const UserFilters: UsersModel.Filter[] = [
  { label: "All",    value: "All" },
  { label: "Admins",  value: "Admin" },
  { label: "Users",   value: "User" },
];