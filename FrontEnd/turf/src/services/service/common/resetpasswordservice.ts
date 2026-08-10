import { useState }                                  from "react";
import { useLocation, useNavigate }                  from "react-router-dom";
import { ApiService }                                from "../../common/apiservices/api-service";
import { ResetPasswordModel, ResetPasswordMethods }  from "../../../model/common/resetpasswordmodel";
import { getPasswordRuleStatus, validatePassword }   from "../../constants/validator";

export const ResetPasswordService = () => {
  const navigate                                      = useNavigate();
  const location                                      = useLocation();
  const resetToken                                    = location.state?.resetToken || "";
  const email                                         = location.state?.email || "";
  const [formData, setFormData]                       = useState<ResetPasswordModel.Request>({
    ...ResetPasswordModel.InitialData,
    resetToken
  });
  const [confirmPassword, setConfirmPassword]         = useState("");
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading]                         = useState(false);
  const [errorMessage, setErrorMessage]               = useState("");
  const [successMessage, setSuccessMessage]           = useState("");
  const apiService                                    = new ApiService();
  const passwordStatus                                = getPasswordRuleStatus(formData.newPassword);

  const handleChange: ResetPasswordMethods.Methods["handleChange"] = (e) => {
    const { name, value } = e.target;

    if (name === "confirmPassword") {
      setConfirmPassword(value);
      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const togglePassword: ResetPasswordMethods.Methods["togglePassword"] = () => {
    setShowPassword((previous) => !previous);
  };

  const toggleConfirmPassword: ResetPasswordMethods.Methods["toggleConfirmPassword"] = () => {
    setShowConfirmPassword((previous) => !previous);
  };

  const handleSubmit: ResetPasswordMethods.Methods["handleSubmit"] = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.resetToken) {
      setErrorMessage("Reset session is invalid or expired. Please start again.");
      return;
    }

    if (!formData.newPassword) {
      setErrorMessage("Password is required.");
      return;
    }

    const passwordValidation = validatePassword(formData.newPassword);

    if (!passwordValidation.isValid) {
      setErrorMessage(passwordValidation.error);
      return;
    }

    if (!confirmPassword) {
      setErrorMessage("Please confirm your password.");
      return;
    }

    if (formData.newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const requestData: ResetPasswordModel.Request = {
        newPassword: formData.newPassword,
        resetToken : formData.resetToken
      };

      const response = (await apiService.sendDirectRequest(ResetPasswordModel.path, requestData)) as ResetPasswordModel.Retval;

      if (response.success) {
        setSuccessMessage(response.data?.message || "Password updated successfully.");

        setFormData(ResetPasswordModel.InitialData);
        setConfirmPassword("");

        setTimeout(() => {
          navigate("/login");
        }, 1200);

      } else {
        setErrorMessage(response.message || "Unable to reset password.");
      }

    } catch (error: any) {
      console.error(error);

      setErrorMessage(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to reset password."
      );

    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    formData,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    loading,
    errorMessage,
    successMessage,
    passwordStatus,
    handleChange,
    handleSubmit,
    togglePassword,
    toggleConfirmPassword
  };
};