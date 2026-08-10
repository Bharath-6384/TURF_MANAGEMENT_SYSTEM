import { useEffect, useState }                                      from "react";
import { ApiService }                                               from "../../common/apiservices/api-service";
import { TurfsModel, TurfsMethods, UpdateTurf, DeleteTurf }         from "../../../model/admin/turfsmodel";
import { TurfFilters }                                              from "../../constants/FilterConstants";
import { filterData }                                               from "../common/searchbarservice";

export const TurfsService = () => {
  const [selectedImage, setSelectedImage]                           = useState<File | null>(null);
  const [imagePreview, setImagePreview]                             = useState<string | null>(null);
  const [showImage, setShowImage]                                   = useState(false);
  const [turfs, setTurfs]                                           = useState<TurfsModel.Turf[]>([]);
  const [isEditing, setIsEditing]                                   = useState(false);
  const [selectedTurf, setSelectedTurf]                             = useState<TurfsModel.Turf | null>(null);
  const [activeFilter, setActiveFilter]                             = useState("All");
  const [searchText, setSearchText]                                 = useState("");
  const [loading, setLoading]                                       = useState(true);
  const [page, setPage]                                             = useState(1);
  const [error, setError]                                           = useState("");
  const [successMessage, setSuccessMessage]                         = useState("");
  const apiService                                                  = new ApiService();
  const limit                                                       = 10;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setSelectedImage(file);
    setImagePreview(previewUrl);
    setShowImage(false);
    setError("");
  };

  const handleViewImage = () => {
    if (!selectedTurf?.image_url) {
      setError("No image available for this turf");
      return;
    }

    setImagePreview(null);
    setShowImage(true);
  };

  const handleViewSelectedImage = () => {
    if (!imagePreview) {
      return;
    }

    setShowImage(true);
  };

  const handleCloseImage = () => {
    setShowImage(false);
  };

  const handleSetSearchText: TurfsMethods.Methods["handleSetSearchText"] = (e) => {
    setSearchText(e.target.value);
    setPage(1);
  };

  const handleSetActiveFilter: TurfsMethods.Methods["handleSetActiveFilter"] = (filter) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const handleSelectTurf: TurfsMethods.Methods["handleSelectTurf"] = (turf) => {
    setSelectedTurf(turf);
    setIsEditing(false);
    setSelectedImage(null);
    setImagePreview(null);
    setShowImage(false);
    setError("");
    setSuccessMessage("");
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleEditTurf = () => {
    if (!selectedTurf) {
      return;
    }

    setIsEditing(true);
    setSelectedImage(null);
    setImagePreview(null);
    setShowImage(false);
    setError("");
    setSuccessMessage("");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedImage(null);
    setImagePreview(null);
    setShowImage(false);
    setError("");
  };

  const fetchTurfs: TurfsMethods.Methods["fetchTurfs"] = async () => {
    try {
      setLoading(true);
      setError("");

      const response = (await apiService.sendAuthRequest(TurfsModel.path, {}, "GET")) as TurfsModel.Retval;

      if (response.success) {
        setTurfs(response.data);

        if (response.data.length > 0) {
          setSelectedTurf(response.data[0]);
        }
      } else {
        setError("Failed to load turfs.");
      }
    } catch (error) {
      console.error(error);
      setError("Error loading turfs.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSelectedTurf: TurfsMethods.Methods["handleUpdateSelectedTurf"] = (field, value) => {
    if (!selectedTurf) {
      return;
    }

    setSelectedTurf({
      ...selectedTurf,
      [field]: value,
    });
  };

  const handleUpdateTurf = async () => {
    if (!selectedTurf) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const requestData = new FormData();

      requestData.append("turfname", selectedTurf.turfname);
      requestData.append("location", selectedTurf.location);
      requestData.append("day_price", String(selectedTurf.day_price));
      requestData.append("night_price", String(selectedTurf.night_price));
      requestData.append("email", selectedTurf.email);
      requestData.append("contact_no", selectedTurf.contact_no);
      requestData.append("status", selectedTurf.status);

      if (selectedImage) {
        requestData.append("image", selectedImage);
      }

      const response = (await apiService.sendAuthRequest(`${UpdateTurf.path}/${selectedTurf.turfid}`, requestData, "PUT")) as UpdateTurf.Retval;

      if (response.success) {
        setTurfs((prev) =>
          prev.map((turf) =>
            turf.turfid === selectedTurf.turfid
              ? response.data
              : turf
          )
        );

        setSelectedTurf(response.data);
        setSelectedImage(null);
        setImagePreview(null);
        setShowImage(false);
        setIsEditing(false);
        setSuccessMessage("Turf updated successfully");
      } else {
        setError("Failed to update turf");
      }
    } catch (error: any) {
      console.error("Error updating turf:", error);

      setError(
        error?.response?.data?.message ||
        "Error updating turf"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTurf = async () => {
    if (!selectedTurf) {
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedTurf.turfname}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = (await apiService.sendAuthRequest(`${DeleteTurf.path}/${selectedTurf.turfid}`, {}, "DELETE")) as DeleteTurf.Retval;

      if (response.success) {
        const remainingTurfs = turfs.filter(
          (turf) => turf.turfid !== selectedTurf.turfid
        );

        setTurfs(remainingTurfs);

        const nextTurf = remainingTurfs.length > 0
          ? remainingTurfs[0]
          : null;

        setSelectedTurf(nextTurf);
        setImagePreview(null);
        setSelectedImage(null);
        setShowImage(false);
        setIsEditing(false);
        setSuccessMessage("Turf deleted successfully");
      } else {
        setError("Failed to delete turf");
      }
    } catch (error: any) {
      console.error("Error deleting turf:", error);

      setError(
        error?.response?.data?.message ||
        "Error deleting turf"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurfs();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const searchedTurfs = filterData(
    turfs,
    searchText,
    "",
    [
      "turfid",
      "turfname",
      "location",
      "email",
      "contact_no",
    ]
  );

  const filteredTurfs =
    activeFilter === "All"
      ? searchedTurfs
      : activeFilter === "Under1000"
        ? searchedTurfs.filter(
            (turf) =>
              Number(turf.day_price) < 1000 ||
              Number(turf.night_price) < 1000
          )
        : searchedTurfs.filter(
            (turf) =>
              Number(turf.day_price) >= 1000 ||
              Number(turf.night_price) >= 1000
          );

  const totalPages = Math.ceil(
    filteredTurfs.length / limit
  );

  const displayedTurfs = filteredTurfs.slice(
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

  const totalTurfs = turfs.length;

  const averagePrice = turfs.length
    ? Math.round(
        turfs.reduce(
          (total, turf) =>
            total +
            (
              Number(turf.day_price || 0) +
              Number(turf.night_price || 0)
            ) / 2,
          0
        ) / turfs.length
      )
    : 0;

  const lowestPrice = turfs.length
    ? Math.min(
        ...turfs.flatMap(
          (turf) => [
            Number(turf.day_price || 0),
            Number(turf.night_price || 0),
          ]
        )
      )
    : 0;

  return {
    turfs,
    loading,
    error,
    successMessage,
    searchText,
    activeFilter,
    selectedTurf,
    filteredTurfs,
    displayedTurfs,
    totalTurfs,
    averagePrice,
    lowestPrice,
    page,
    totalPages,
    isEditing,
    selectedImage,
    imagePreview,
    showImage,
    filters: TurfFilters,
    handlePageChange,
    handleSetSearchText,
    handleSetActiveFilter,
    handleSelectTurf,
    handleUpdateTurf,
    handleDeleteTurf,
    handleEditTurf,
    handleCancelEdit,
    handleImageChange,
    handleViewImage,
    handleViewSelectedImage,
    handleCloseImage,
    handleUpdateSelectedTurf,
  };
};