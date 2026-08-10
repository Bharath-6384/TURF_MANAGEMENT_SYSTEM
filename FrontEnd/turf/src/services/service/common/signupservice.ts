import { useState }                               from "react";
import { ApiService }                             from "../../common/apiservices/api-service";
import { SignupModel, SignupMethods }             from "../../../model/common/signupmodel";
import { validateEmail, validatePassword }        from "../../constants/validator";

export const SignupService = () => {
  const [formData, setFormData]                       = useState<SignupModel.Request>(SignupModel.InitialData);
  const [confirmPassword, setConfirmPassword]         = useState("");
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading]                         = useState(false);
  const [errorMessage, setErrorMessage]               = useState("");
  const [successMessage, setSuccessMessage]           = useState("");
  const apiService                                    = new ApiService();

  const handleChange: SignupMethods.Methods["handleChange"] = (e) => {
    const { name, value } = e.target;

    if (name === "confirmPassword") {
      setConfirmPassword(value);
      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const togglePassword: SignupMethods.Methods["togglePassword"] = () => {
    setShowPassword((previous) => !previous);
  };

  const toggleConfirmPassword: SignupMethods.Methods["toggleConfirmPassword"] = () => {
    setShowConfirmPassword((previous) => !previous);
  };

  const handleSubmit: SignupMethods.Methods["handleSubmit"] = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const fullname = formData.fullname.trim();
    const email    = formData.email.trim();
    const phone    = formData.phone.trim();
    const password = formData.password;

    if (!fullname) {
      setErrorMessage("Full name is required.");
      return;
    }

    const emailValidation = validateEmail(email);

    if (!emailValidation.isValid) {
      setErrorMessage(emailValidation.error);
      return;
    }

    if (!phone) {
      setErrorMessage("Phone number is required.");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      setErrorMessage("Phone number must contain exactly 10 digits.");
      return;
    }

    const passwordValidation = validatePassword(password);

    if (!passwordValidation.isValid) {
      setErrorMessage(passwordValidation.error);
      return;
    }

    if (!confirmPassword) {
      setErrorMessage("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const requestData: SignupModel.Request = {
        email,
        password,
        fullname,
        phone
      };

      const response = (await apiService.sendDirectRequest(SignupModel.path, requestData)) as SignupModel.Retval;

      if (response.success) {
        setSuccessMessage("Account created successfully.");

        setFormData(SignupModel.InitialData);
        setConfirmPassword("");

      } else {
        setErrorMessage(response.message || "Unable to create account.");
      }

    } catch (error: any) {
      console.error(error);

      setErrorMessage(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to create account."
      );

    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    loading,
    errorMessage,
    successMessage,
    handleChange,
    handleSubmit,
    togglePassword,
    toggleConfirmPassword
  };
};