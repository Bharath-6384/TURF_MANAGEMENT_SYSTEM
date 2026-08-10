import { useEffect, useState }                              from "react";
import { ApiService }                                       from "../../../services/common/apiservices/api-service";
import { BookingFilters }                                   from "../../constants/FilterConstants";
import { BookingsModel, UpdateBooking, BookingsMethods }    from "../../../model/admin/bookingsmodel";
import { filterData }                                       from "../../../services/service/common/searchbarservice";

export const BookingsService = () => {
  const [bookings, setBookings]                             = useState<BookingsModel.Booking[]>([]);
  const [selectedBooking, setSelectedBooking]               = useState<BookingsModel.Booking | null>(null);
  const [activeFilter, setActiveFilter]                     = useState<string>("All");
  const [searchText, setSearchText]                         = useState<string>("");
  const [loading, setLoading]                               = useState<boolean>(true);
  const [page, setPage]                                     = useState<number>(1);
  const [errorMessage, setErrorMessage]                     = useState<string>("");
  const apiService                                          = new ApiService();
  const limit                                               = 10;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSetSearchText: BookingsMethods.Methods["handleSetSearchText"] = (e) => {
    setSearchText(e.target.value);
    setPage(1);
  };

  const handleSetActiveFilter: BookingsMethods.Methods["handleSetActiveFilter"] = (filter) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const handleSelectBooking: BookingsMethods.Methods["handleSelectBooking"] = (booking) => {
    setSelectedBooking(booking);
  };

  const handleMarkAsPaid = async () => {
    if (!selectedBooking) return;

    try {
      const requestData: UpdateBooking.Request = {status: "paid",};
      const response = (await apiService.sendAuthRequest(`${UpdateBooking.path}/${selectedBooking.booking_id}`, requestData, "PUT")) as UpdateBooking.Retval;

      if (response.success) {
        setSelectedBooking((prev) =>
          prev
            ? {
                ...prev,
                status: "paid",
              }
            : null
        );

        setBookings((prev) =>
          prev.map((booking) =>
            booking.booking_id === selectedBooking.booking_id
              ? {
                  ...booking,
                  status: "paid",
                }
              : booking
          )
        );
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const fetchBookings: BookingsMethods.Methods["fetchBookings"] = async () => {
    try {
      setLoading(true);
      const response = (await apiService.sendAuthRequest(BookingsModel.path, {}, "GET")) as BookingsModel.Retval;

      if (response.success) {
        setBookings(response.data);

        if (response.data.length > 0) {
          setSelectedBooking(response.data[0]);
        }
      } else {
        setErrorMessage("Failed to load bookings.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Error loading bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const searchedBookings = filterData(
    bookings,
    searchText,
    "",
    [
      "booking_id",
      "date",
      "turfname",
      "fullname",
      "email",
    ]
  );

  const filteredBookings =
    activeFilter === "All"
      ? searchedBookings
      : searchedBookings.filter(
          (booking) =>
            booking.status.toLowerCase() ===
            activeFilter.toLowerCase()
        );

  const totalPages = Math.ceil(
    filteredBookings.length / limit
  );

  const displayedBookings = filteredBookings.slice(
    (page - 1) * limit,
    page * limit
  );

  useEffect(() => {
    if (totalPages === 0 && page !== 1) {
      setPage(1);
      return;
    }

    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const totalBookings = bookings.length;

  const confirmedRevenue = bookings
    .filter(
      (booking) =>
        booking.status.toLowerCase() ===
        "completed"
    )
    .reduce(
      (total, booking) =>
        total +
        Number(booking.total_rate),
      0
    );

  const unpaidAmount = bookings
    .filter(
      (booking) =>
        booking.status.toLowerCase() ===
        "unpaid"
    )
    .reduce(
      (total, booking) =>
        total +
        Number(booking.total_rate),
      0
    );

  return {
    bookings,
    loading,
    errorMessage,
    searchText,
    activeFilter,
    selectedBooking,
    filteredBookings,
    displayedBookings,
    totalBookings,
    confirmedRevenue,
    unpaidAmount,
    page,
    totalPages,
    filters: BookingFilters,
    handlePageChange,
    handleMarkAsPaid,
    handleSetSearchText,
    handleSetActiveFilter,
    handleSelectBooking,
  };
};