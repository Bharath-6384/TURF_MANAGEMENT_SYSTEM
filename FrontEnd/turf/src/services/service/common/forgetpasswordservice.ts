import { useState }     from "react";
import { useNavigate }  from "react-router-dom";
import { ForgotPassword, ForgotPasswordMethods }  from "../../../model/common/forgetpasswordmodel";
import { ApiService }                             from "../../common/apiservices/api-service";
import { validateEmail }                          from "../../constants/validator";

export const ForgotPasswordService = () => {
  const navigate                             = useNavigate();
  const [formData, setFormData]              = useState<ForgotPassword.Request>(ForgotPassword.InitialData);
  const [loading, setLoading]                = useState<boolean>(false);
  const [errorMessage, setErrorMessage]      = useState<string>("");
  const [successMessage, setSuccessMessage]  = useState<string>("");
  const apiService                           = new ApiService();

  const handleFormData: ForgotPasswordMethods.Methods["handleFormData"] = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    if (errorMessage) {
      setErrorMessage("");
    }

    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const handleForgotPassword: ForgotPasswordMethods.Methods["handleForgotPassword"] = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const email = formData.email.trim();

    const emailValidation = validateEmail(email);

    if (!emailValidation.isValid) {
      setErrorMessage(emailValidation.error);
      return;
    }

    try {
      setLoading(true);

      const requestData: ForgotPassword.Request = {
        email
      };

      const response = (await apiService.sendDirectRequest(ForgotPassword.path, requestData)) as ForgotPassword.Retval;

      if (!response.success) {
        setErrorMessage(
          response.message || "Unable to send verification code."
        );
        return;
      }

      setSuccessMessage(
        response.data?.message ||
        "Verification code sent successfully."
      );

      setTimeout(() => {
        navigate("/forgotpasswordotp", {
          state: {
            email: email
          }
        });
      }, 800);
    } catch (error: any) {
      console.error(error);

      setErrorMessage(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to send verification code."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    errorMessage,
    successMessage,
    handleFormData,
    handleForgotPassword
  };
};