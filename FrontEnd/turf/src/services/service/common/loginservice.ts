import { useEffect, useState }                                   from "react";
import { useNavigate, useLocation }                              from "react-router-dom";
import { ApiService }                                            from "../../common/apiservices/api-service";
import { LoginModel, LoginMethods }                              from "../../../model/common/loginmodel";
import { useAuth }                                               from "../../../auth/authcontext";
import { AuthContextModel }                                      from "../../../model/common/authcontextmodel";

export const LoginService = () => {
  const { login, logout }                                         = useAuth();
  const [formData, setFormData]                                   = useState<LoginModel.Params>(LoginModel.InitialData);
  const [rememberMe, setRememberMe]                               = useState(false);
  const [showPassword, setShowPassword]                           = useState(false);
  const [errorMessage, setErrorMessage]                           = useState("");
  const apiService                                                = new ApiService();
  const navigate                                                  = useNavigate();
  const location                                                  = useLocation() as unknown as Location & { state?: LoginModel.Message; };

  useEffect(() => {
    const msg = location.state?.message;

    if (msg) {
      alert(msg);
      localStorage.clear();
      logout();
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate, logout]);

  useEffect(() => {
    setFormData({
      email: "",
      password: "",
      role: "user",
    });

    setRememberMe(false);
  }, []);

  const handleFormData: LoginMethods.Methods["handleFormData"] = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrorMessage("");
  };

  const handleSetShowPassword: LoginMethods.Methods["handleSetShowPassword"] = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSetRememberMe: LoginMethods.Methods["handleSetRememberMe"] = () => {
    setRememberMe((prev) => !prev);
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setErrorMessage("Please fill out all fields");
      return;
    }

    try {
      const response = (await apiService.sendDirectRequest(LoginModel.path, formData)) as LoginModel.Retval;
      const res = response.data;

      if (response.success) {
        const { token, name, id } = res;
        const normalizedRole = formData.role.toLowerCase();

        localStorage.setItem("token", token);
        localStorage.setItem("Name", name);

        login({
          token,
          role: normalizedRole as AuthContextModel.Role,
          id,
          name,
        });

        const roleRedirects: LoginModel.RedirectMap = {
          user: "/user/Dashboard",
          admin: "/admin/Dashboard",
        };

        const redirectTo = roleRedirects[normalizedRole];

        if (redirectTo) {
          navigate(redirectTo);
        } else {
          alert("Unknown role. Cannot redirect.");
        }
      } else {
        setErrorMessage("Invalid email or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("Error during login. Please try again later.");
    }
  };

  const handleSignUp = () => {
    navigate("/customer/register");
  };

  return {
    formData,
    rememberMe,
    showPassword,
    errorMessage,
    handleFormData,
    handleSetRememberMe,
    handleSetShowPassword,
    handleLogin,
    handleSignUp,
  };
};