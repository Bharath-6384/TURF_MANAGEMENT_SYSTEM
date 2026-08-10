import { useEffect, useState }                     from "react";
import { AdminProfileMethods, AdminProfileModel }  from "../../../model/admin/adminprofilemodel";
import { ApiService }                              from "../../common/apiservices/api-service";
import { getUserFromToken }                        from "../../service/common/auth";

export const AdminProfileService = () => {
  const [profile, setProfile]                = useState<AdminProfileModel.Profile | null>(null);
  const [loading, setLoading]                = useState<boolean>(true);
  const [errorMessage, setErrorMessage]      = useState<string>("");
  const [successMessage, setSuccessMessage]  = useState<string>("");
  const [avatarPreview, setAvatarPreview]    = useState<string | null>(null);
  const [isEditing, setIsEditing]            = useState<boolean>(false);

  const [formData, setFormData] = useState({
    fullname: "",
    phone: ""
  });

  const apiService = new ApiService();
  const user        = getUserFromToken();

  const handleAvatarChange: AdminProfileMethods.Methods["handleAvatarChange"] = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setAvatarPreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleEdit: AdminProfileMethods.Methods["handleEdit"] = () => {
    if (!profile) {
      return;
    }

    setFormData({
      fullname: profile.fullname,
      phone: profile.phone || ""
    });

    setSuccessMessage("");
    setErrorMessage("");
    setIsEditing(true);
  };

  const handleCancel: AdminProfileMethods.Methods["handleCancel"] = () => {
    if (profile) {
      setFormData({
        fullname: profile.fullname,
        phone: profile.phone || ""
      });
    }

    setAvatarPreview(null);
    setErrorMessage("");
    setSuccessMessage("");
    setIsEditing(false);
  };

  const handleChange: AdminProfileMethods.Methods["handleChange"] = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave: AdminProfileMethods.Methods["handleSave"] = async () => {
    if (!profile) {
      return;
    }

    if (!formData.fullname.trim()) {
      setErrorMessage("Full name is required.");
      return;
    }

    if (!formData.phone.trim()) {
      setErrorMessage("Phone number is required.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const requestData: AdminProfileModel.UpdateRequest = {
        email: profile.email,
        fullname: formData.fullname.trim(),
        phone: formData.phone.trim()
      };

      const response = (await apiService.sendAuthRequest(AdminProfileModel.updatePath, requestData, "PUT")) as AdminProfileModel.UpdateRetval;

      if (response.success) {
        setProfile(response.data);

        setFormData({
          fullname: response.data.fullname,
          phone: response.data.phone || ""
        });

        setIsEditing(false);
        setSuccessMessage("Profile updated successfully.");
      } else {
        setErrorMessage("Unable to update profile.");
      }
    } catch (error: any) {
      console.error(error);

      setErrorMessage(
        error?.response?.data?.message ||
        error?.message ||
        "Error updating profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile: AdminProfileMethods.Methods["fetchProfile"] = async () => {
    if (!user?.email) {
      setErrorMessage("Admin email not found.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const requestData: AdminProfileModel.Request = {
        email: user.email
      };

      const response = (await apiService.sendAuthRequest(AdminProfileModel.path, requestData, "POST")) as AdminProfileModel.Retval;

      if (response.success) {
        setProfile(response.data);

        setFormData({
          fullname: response.data.fullname,
          phone: response.data.phone || ""
        });
      } else {
        setProfile(null);
        setErrorMessage("Unable to load admin profile.");
      }
    } catch (error: any) {
      console.error(error);

      setProfile(null);

      setErrorMessage(
        error?.response?.data?.message ||
        error?.message ||
        "Error loading admin profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    errorMessage,
    successMessage,
    avatarPreview,
    isEditing,
    formData,
    fetchProfile,
    handleAvatarChange,
    handleEdit,
    handleCancel,
    handleChange,
    handleSave
  };
};