import { useEffect, useState }                 from "react";
import { ApiService }                          from "../../common/apiservices/api-service";
import { getUserFromToken }                    from "../common/auth";
import { GetUserBookings }                     from "../../../model/user/userbookingsmodel";

export const UserBookingsService = () => {
  const [bookings, setBookings]                = useState<GetUserBookings.Booking[]>([]);
  const [loading, setLoading]                  = useState(false);
  const [errorMessage, setErrorMessage]        = useState("");
  const apiService                             = new ApiService();
  const user                                   = getUserFromToken();

  const fetchUserBookings = async () => {
    if (!user?.id) {
      setErrorMessage("User not found.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const response = (await apiService.sendAuthRequest(
        GetUserBookings.path,
        { userId: user.id },
        "POST"
      )) as GetUserBookings.Retval;

      if (response.success) {
        setBookings(response.data);

      } else {
        setBookings([]);
        setErrorMessage(response.data?.message || "Unable to load bookings.");
      }

    } catch (error: any) {
      console.error(error);

      setBookings([]);
      setErrorMessage(
        error?.response?.data?.message ||
        error?.message ||
        "Error loading bookings."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, []);

  return {
    bookings,
    loading,
    errorMessage,
    fetchUserBookings
  };
};