import { useState }                                      from "react";
import { ApiService }                                    from "../../common/apiservices/api-service";
import { getUserFromToken }                              from "../common/auth";
import { RegisterTurfModel, RegisterTurfMethods }        from "../../../model/admin/registerturfmodel";

export const RegisterTurfService = () => {
  const [formData, setFormData]                           = useState<RegisterTurfModel.FormData>(RegisterTurfModel.InitialData);
  const [errorMessage, setErrorMessage]                   = useState("");
  const [successMessage, setSuccessMessage]               = useState("");
  const [loading, setLoading]                             = useState(false);
  const apiService                                        = new ApiService();

  const handleFormData: RegisterTurfMethods.methods["handleFormData"] = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleImageChange: RegisterTurfMethods.methods["handleImageChange"] = (e) => {
    const file = e.target.files?.[0] || null;

    setFormData((previousData) => ({
      ...previousData,
      image: file,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  };

  const validateForm = (): boolean => {
    if (
      !formData.turfName.trim() ||
      !formData.turfLocation.trim() ||
      !formData.dayPrice ||
      !formData.nightPrice ||
      !formData.email.trim() ||
      !formData.contactNo.trim() ||
      !formData.image
    ) {
      setErrorMessage("All fields are required");
      return false;
    }

    if (
      Number(formData.dayPrice) <= 0 ||
      Number(formData.nightPrice) <= 0
    ) {
      setErrorMessage("Day and night prices must be greater than 0");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage("Enter a valid email address");
      return false;
    }

    if (!/^[0-9]{10}$/.test(formData.contactNo)) {
      setErrorMessage("Contact number must contain 10 digits");
      return false;
    }

    if (!formData.image.type.startsWith("image/")) {
      setErrorMessage("Only image files are allowed");
      return false;
    }

    if (formData.image.size > 5 * 1024 * 1024) {
      setErrorMessage("Image size must be less than 5MB");
      return false;
    }

    return true;
  };

  const handleRegisterTurf = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const user                              = getUserFromToken();
      const userId                            = user?.id;
      const requestData                       = new FormData();

      requestData.append("turfName", formData.turfName.trim());
      requestData.append("turfLocation", formData.turfLocation.trim());
      requestData.append("dayPrice", String(formData.dayPrice));
      requestData.append("nightPrice", String(formData.nightPrice));
      requestData.append("email", formData.email.trim());
      requestData.append("contactNo", formData.contactNo.trim());
      requestData.append("image", formData.image as File);

      const response = (await apiService.sendAuthRequest(`${RegisterTurfModel.path}/${userId}`,requestData, "POST")) as RegisterTurfModel.Retval;

      if (response.success) {
        setSuccessMessage("Turf registered successfully");
        setFormData(RegisterTurfModel.InitialData);
      } else {
        setErrorMessage(response.message || "Unable to register turf");
      }
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
        "Something went wrong while registering turf"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errorMessage,
    successMessage,
    loading,
    handleFormData,
    handleImageChange,
    handleRegisterTurf,
  };
};