import { useState }                 from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ForgotPasswordOtpModel, ForgotPasswordOtpMethods }  from "../../../model/common/forgotpasswordotpmodel";
import { ApiService }                                        from "../../common/apiservices/api-service";

export const ForgotPasswordOtpService = () => {
  const navigate                             = useNavigate();
  const location                             = useLocation();
  const email                                = location.state?.email || "";
  const [otp, setOtp]                        = useState<string>("");
  const [loading, setLoading]                = useState<boolean>(false);
  const [errorMessage, setErrorMessage]      = useState<string>("");
  const [successMessage, setSuccessMessage]  = useState<string>("");
  const apiService                           = new ApiService();

  const handleOtpChange: ForgotPasswordOtpMethods.Methods["handleOtpChange"] = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);

    setOtp(value);

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleVerifyOtp: ForgotPasswordOtpMethods.Methods["handleVerifyOtp"] = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!email) {
      setErrorMessage("Email is missing. Please go back and enter your email.");
      return;
    }

    if (!otp) {
      setErrorMessage("Please enter the OTP.");
      return;
    }

    if (otp.length !== 6) {
      setErrorMessage("OTP must contain exactly 6 digits.");
      return;
    }

    try {
      setLoading(true);

      const requestData: ForgotPasswordOtpModel.Request = {
        email: email.trim(),
        otp
      };

      const response = (await apiService.sendDirectRequest(ForgotPasswordOtpModel.path, requestData)) as ForgotPasswordOtpModel.Retval;

      if (response.success) {
        const resetToken = response.data?.resetToken;

        if (!resetToken) {
          setErrorMessage("Reset token was not received.");
          return;
        }

        setSuccessMessage(
          response.data?.message || "OTP verified successfully."
        );

        setTimeout(() => {
          navigate("/resetPassword", {
            state: {
              email,
              resetToken
            }
          });
        }, 800);
      } else {
        setErrorMessage(
          response.message || "Invalid or expired OTP."
        );
      }
    } catch (error: any) {
      console.error(error);

      setErrorMessage(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to verify OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp: ForgotPasswordOtpMethods.Methods["handleResendOtp"] = async () => {
    if (!email) {
      setErrorMessage("Email is missing. Please go back and enter your email.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = (await apiService.sendDirectRequest(ForgotPasswordOtpModel.ResendPath, { email: email.trim() })) as ForgotPasswordOtpModel.Retval;

      if (response.success) {
        setOtp("");

        setSuccessMessage(
          response.data?.message || "A new OTP has been sent."
        );
      } else {
        setErrorMessage(
          response.message || "Unable to resend OTP."
        );
      }
    } catch (error: any) {
      console.error(error);

      setErrorMessage(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to resend OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    navigate("/forgotPassword", {
      state: {
        email
      }
    });
  };

  return {
    email,
    otp,
    loading,
    errorMessage,
    successMessage,
    handleOtpChange,
    handleVerifyOtp,
    handleResendOtp,
    handleBackToEmail
  };
};