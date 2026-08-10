import { useEffect, useState }                  from "react";
import { useLocation }                          from "react-router-dom";
import { ApiService }                           from "../../common/apiservices/api-service";
import { getUserFromToken }                     from "../common/auth";
import { BookTurfModel, BookTurf, GetSlot, BookTurfMethods } from "../../../model/user/bookturfmodel";
export const BookTurfService = () => {
  const location                                       = useLocation();
  const turf                                           = location.state?.turf as BookTurfModel.Turf;
  const [selectedTurf]                                 = useState<BookTurfModel.Turf>(turf);
  const [slots, setSlots]                              = useState<GetSlot.Slot[]>([]);
  const [selectedDate, setSelectedDate]                = useState<BookTurfModel.DateItem | null>(null);
  const [selectedSlots, setSelectedSlots]              = useState<GetSlot.Slot[]>([]);
  const [loading, setLoading]                          = useState(false);
  const [loadError, setLoadError]                      = useState("");
  const [actionError, setActionError]                  = useState("");
  const [successMessage, setSuccessMessage]            = useState("");
  const [totalAmount, setTotalAmount]                  = useState(0);
  const [selectedPeriod, setSelectedPeriod]            = useState<"day" | "night">("day");
  const apiService                                     = new ApiService();
  const user                                           = getUserFromToken();

  const filteredSlots = slots
    .filter((slot) => {
      const hour = Number(slot.startTime.split(":")[0]);
      return selectedPeriod === "day" ? hour >= 6 && hour < 18 : hour >= 18 || hour < 6;
    })
    .sort((a, b) => {
      const getOrder = (time: string) => {
        const hour = Number(time.split(":")[0]);
        return hour >= 18 ? hour : hour + 24;
      };

      return getOrder(a.startTime) - getOrder(b.startTime);
    });

  const isSlotSelected = (slot: (typeof filteredSlots)[number]) =>
    selectedSlots.some((s) => s.startTime === slot.startTime && s.endTime === slot.endTime);

  const hours           = selectedSlots.length;
  const pricePerHour    = selectedPeriod === "day" ? Number(selectedTurf.day_price) : Number(selectedTurf.night_price);
  const estimatedAmount = hours * pricePerHour;

  const dates: BookTurfModel.DateItem[] = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);

    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.getDate(),
      fullDate: date.toISOString().split("T")[0]
    };
  });

  const fetchSlots: BookTurfMethods.Methods["fetchSlots"] = async () => {
    if (!selectedTurf || !selectedDate) {
      return;
    }

    try {
      setLoading(true);
      setLoadError("");

      const requestData: GetSlot.Request = {
        turfId: selectedTurf.turfid,
        date: selectedDate.fullDate
      };

      const response = (await apiService.sendAuthRequest(GetSlot.path, requestData, "POST")) as GetSlot.Retval;

      if (response.success) {
        setSlots(response.data.slots);
      } else {
        setSlots([]);
        setLoadError("Unable to load slots.");
      }

    } catch (error) {
      console.error(error);
      setSlots([]);
      setLoadError("Error loading slots.");

    } finally {
      setLoading(false);
    }
  };

  const handleSelectPeriod = (period: "day" | "night") => {
    setSelectedPeriod(period);
    setSelectedSlots([]);
    setTotalAmount(0);
    setActionError("");
    setSuccessMessage("");
  };

  const handleSelectDate = (date: BookTurfModel.DateItem) => {
    setSelectedDate(date);
    setSelectedSlots([]);
    setSlots([]);
    setTotalAmount(0);
    setLoadError("");
    setActionError("");
    setSuccessMessage("");
  };

  const handleSelectSlot = (slot: GetSlot.Slot) => {
    if (!slot.available) {
      return;
    }

    setActionError("");
    setSuccessMessage("");
    setTotalAmount(0);

    if (selectedSlots.length === 0) {
      setSelectedSlots([slot]);
      return;
    }

    const isSameLoneSlot = selectedSlots.length === 1 &&
      selectedSlots[0].startTime === slot.startTime &&
      selectedSlots[0].endTime === slot.endTime;

    if (isSameLoneSlot) {
      setSelectedSlots([]);
      return;
    }

    const anchorIndex = filteredSlots.findIndex(
      (s) => s.startTime === selectedSlots[0].startTime && s.endTime === selectedSlots[0].endTime
    );

    const clickedIndex = filteredSlots.findIndex(
      (s) => s.startTime === slot.startTime && s.endTime === slot.endTime
    );

    if (anchorIndex === -1 || clickedIndex === -1) {
      setSelectedSlots([slot]);
      return;
    }

    const rangeStart       = Math.min(anchorIndex, clickedIndex);
    const rangeEnd         = Math.max(anchorIndex, clickedIndex);
    const range            = filteredSlots.slice(rangeStart, rangeEnd + 1);
    const isFullyAvailable = range.every((s) => s.available);

    if (!isFullyAvailable) {
      setActionError("That range includes an already booked slot. Please choose a continuous set of available slots.");
      return;
    }

    setSelectedSlots(range);
  };

  const handleBookTurf: BookTurfMethods.Methods["handleBookTurf"] = async () => {
    if (!selectedTurf) {
      setActionError("Turf not found.");
      return;
    }

    if (!selectedDate) {
      setActionError("Please select a booking date.");
      return;
    }

    if (selectedSlots.length === 0) {
      setActionError("Please select at least one time slot.");
      return;
    }

    try {
      setLoading(true);
      setActionError("");
      setSuccessMessage("");

      const firstSlot = selectedSlots[0];
      const lastSlot  = selectedSlots[selectedSlots.length - 1];

      const requestData: BookTurf.Request = {
        email: user?.email || "",
        turfId: selectedTurf.turfid,
        date: selectedDate.fullDate,
        startTime: firstSlot.startTime,
        endTime: lastSlot.endTime
      };

      const response = (await apiService.sendAuthRequest(BookTurf.path, requestData, "POST")) as BookTurf.Retval;

      if (response.success) {
        setSuccessMessage(response.data.message);
        setTotalAmount(response.data.totalRate);
        setSelectedSlots([]);
        fetchSlots();

      } else {
        setActionError(response.data.message || "Failed to book turf.");
      }

    } catch (error: any) {
      console.error(error);

      setActionError(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to book turf."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTurf && selectedDate) {
      fetchSlots();
    }
  }, [selectedTurf, selectedDate]);

  return {
    loading,
    loadError,
    actionError,
    successMessage,
    totalAmount,
    selectedTurf,
    slots,
    filteredSlots,
    dates,
    selectedDate,
    selectedSlots,
    selectedPeriod,
    hours,
    estimatedAmount,
    handleSelectPeriod,
    handleSelectDate,
    handleSelectSlot,
    handleBookTurf,
    isSlotSelected,
  };
};