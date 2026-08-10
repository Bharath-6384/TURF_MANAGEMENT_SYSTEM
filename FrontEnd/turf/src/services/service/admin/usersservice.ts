import { useEffect, useState }                    from "react";
import { UsersModel, UsersMethods, UpdateUser }  from "../../../model/admin/usersmodel";
import { ApiService }                            from "../../common/apiservices/api-service";
import { UserFilters }                           from "../../constants/FilterConstants";
import { filterData }                            from "../common/searchbarservice";

export const UsersService = () => {
  const [users, setUsers]                 = useState<UsersModel.User[]>([]);
  const [selectedUser, setSelectedUser]    = useState<UsersModel.User | null>(null);
  const [activeFilter, setActiveFilter]    = useState<string>("All");
  const [searchText, setSearchText]        = useState<string>("");
  const [loading, setLoading]              = useState<boolean>(true);
  const [page, setPage]                    = useState<number>(1);
  const [error, setError]                  = useState<string>("");
  const [isEditing, setIsEditing]          = useState<boolean>(false);

  const apiService                        = new ApiService();
  const limit                             = 10;

  const handleSetSearchText: UsersMethods.Methods["handleSetSearchText"] = (e) => {
    setSearchText(e.target.value);
    setPage(1);
  };

  const handleSetActiveFilter: UsersMethods.Methods["handleSetActiveFilter"] = (filter) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const handleSelectUser: UsersMethods.Methods["handleSelectUser"] = (user) => {
    setSelectedUser(user);
    setIsEditing(false);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleEditUser = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) {
      return;
    }

    try {
      const requestData: UpdateUser.Request = {
        fullname: selectedUser.fullname,
        email: selectedUser.email,
        phone: selectedUser.phone,
      };

      const response = (await apiService.sendAuthRequest(`${UpdateUser.path}/${selectedUser.user_id}`, requestData, "PUT")) as UpdateUser.Retval;

      if (response.success) {
        setUsers((prev) =>
          prev.map((user) =>
            user.user_id === selectedUser.user_id
              ? {
                  ...user,
                  ...response.data.user,
                }
              : user
          )
        );

        setSelectedUser((prev) =>
          prev
            ? {
                ...prev,
                ...response.data.user,
              }
            : null
        );

        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const fetchUsers: UsersMethods.Methods["fetchUsers"] = async () => {
    try {
      setLoading(true);

      const response = (await apiService.sendAuthRequest(UsersModel.path, {}, "GET")) as UsersModel.Retval;

      if (response.success) {
        setUsers(response.data);

        if (response.data.length > 0) {
          setSelectedUser(response.data[0]);
        }
      } else {
        setError("Failed to load users.");
      }
    } catch (error) {
      console.error(error);
      setError("Error loading users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const searchedUsers = filterData(
    users,
    searchText,
    "",
    [
      "user_id",
      "fullname",
      "email",
      "phone",
      "role_name",
    ]
  );

  const filteredUsers =
    activeFilter === "All"
      ? searchedUsers
      : searchedUsers.filter(
          (user) =>
            user.role_name.toLowerCase() ===
            activeFilter.toLowerCase()
        );

  const totalPages = Math.ceil(
    filteredUsers.length / limit
  );

  const displayedUsers = filteredUsers.slice(
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

  const totalUsers = users.length;

  const adminUsers = users.filter(
    (user) =>
      user.role_name.toLowerCase() ===
      "admin"
  ).length;

  const normalUsers = users.filter(
    (user) =>
      user.role_name.toLowerCase() !==
      "admin"
  ).length;

  return {
    users,
    loading,
    error,
    searchText,
    activeFilter,
    filteredUsers,
    displayedUsers,
    selectedUser,
    totalUsers,
    adminUsers,
    normalUsers,
    page,
    totalPages,
    isEditing,
    filters: UserFilters,
    handlePageChange,
    handleSetSearchText,
    setSelectedUser,
    handleSetActiveFilter,
    handleSelectUser,
    handleEditUser,
    handleCancelEdit,
    handleUpdateUser,
  };
};