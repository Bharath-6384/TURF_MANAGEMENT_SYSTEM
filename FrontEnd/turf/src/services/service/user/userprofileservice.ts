import { useEffect, useState }                   from "react";
import { ApiService }                            from "../../common/apiservices/api-service";
import { getUserFromToken }                      from "../../service/common/auth";
import { UserProfile, UserProfileMethods }       from "../../../model/user/userprofilemodel";

export const UserProfileService = () => {

  const [profile, setProfile]                    = useState<UserProfile.Profile | null>(null);
  const [loading, setLoading]                    = useState(true);
  const [errorMessage, setErrorMessage]          = useState("");
  const [successMessage, setSuccessMessage]      = useState("");
  const [avatarPreview, setAvatarPreview]        = useState<string | null>(null);
  const [isEditing, setIsEditing]                = useState(false);
  const [formData, setFormData]                  = useState<UserProfile.Params>(UserProfile.InitialData);
  const apiService                               = new ApiService();
  const user                                     = getUserFromToken();

  const handleAvatarChange: UserProfileMethods.Methods["handleAvatarChange"] = (e) => {
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

  const handleEdit: UserProfileMethods.Methods["handleEdit"] = () => {
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

  const handleCancel: UserProfileMethods.Methods["handleCancel"] = () => {
    if (!profile) {
      return;
    }

    setFormData({
      fullname: profile.fullname,
      phone: profile.phone || ""
    });

    setAvatarPreview(null);
    setErrorMessage("");
    setSuccessMessage("");
    setIsEditing(false);
  };

  const handleChange: UserProfileMethods.Methods["handleChange"] = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchProfile: UserProfileMethods.Methods["fetchProfile"] = async () => {
    if (!user?.email) {
      setErrorMessage("User email not found.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const requestData: UserProfile.Request = {
        email: user.email
      };

      const response = (await apiService.sendAuthRequest(UserProfile.path, requestData, "POST")) as UserProfile.Retval;

      if (response.success) {
        setProfile(response.data);

        setFormData({
          fullname: response.data.fullname,
          phone: response.data.phone || ""
        });

      } else {
        setProfile(null);
        setErrorMessage("Unable to load profile.");
      }

    } catch (error: any) {
      console.error(error);

      setProfile(null);

      setErrorMessage(
        error?.response?.data?.message ||
        error?.message ||
        "Error loading profile."
      );

    } finally {
      setLoading(false);
    }
  };

  const handleSave: UserProfileMethods.Methods["handleSave"] = async () => {
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

    if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      setErrorMessage("Phone number must contain exactly 10 digits.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const requestData: UserProfile.UpdateRequest = {
        email: profile.email,
        fullname: formData.fullname.trim(),
        phone: formData.phone.trim()
      };

      const response = (await apiService.sendAuthRequest(UserProfile.updatePath, requestData, "PUT")) as UserProfile.UpdateRetval;

      if (response.success) {
        setProfile(response.data);

        setFormData({
          fullname: response.data.fullname,
          phone: response.data.phone || ""
        });

        setIsEditing(false);
        setAvatarPreview(null);
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