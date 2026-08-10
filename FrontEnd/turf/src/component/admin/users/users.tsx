import { FiSearch, FiMail, FiPhone, FiCalendar, FiChevronDown }  from "react-icons/fi";
import { FaCheckCircle }                                         from "react-icons/fa";
import Pagination                                                from "../../common/pagination/pagination";
import { UsersService }                                          from "../../../services/service/admin/usersservice";
import "../bookings/bookings.css";
import "./users.css";

const Users = () => {
  const {
    loading,
    searchText,
    activeFilter,
    filteredUsers,
    selectedUser,
    filters,
    totalUsers,
    adminUsers,
    normalUsers,
    page,
    totalPages,
    isEditing,
    setSelectedUser,
    handlePageChange,
    handleSetSearchText,
    handleSetActiveFilter,
    handleSelectUser,
    handleEditUser,
    handleCancelEdit,
    handleUpdateUser,
  } = UsersService();

  if (loading) {
    return <div className="fg-bookings-page"><div className="fg-loading">Loading users...</div></div>;
  }

  return (
    <div className="fg-bookings-page">
      <div className="fg-overview-header">
        <div className="fg-overview-title">
          <h1>USERS OVERVIEW</h1>
          <p>Manage and monitor all registered users.</p>
        </div>

        <div className="fg-overview-stats">
          <div className="fg-orb fg-orb--revenue">
            <div className="fg-orb-inner">
              <span>Total Users</span>
              <h2>{totalUsers}</h2>
            </div>
          </div>

          <div className="fg-orb fg-orb--total">
            <div className="fg-orb-inner">
              <span>Admin Users</span>
              <h2>{adminUsers}</h2>
            </div>
          </div>

          <div className="fg-orb fg-orb--unpaid">
            <div className="fg-orb-inner">
              <span>Normal Users</span>
              <h2>{normalUsers}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="fg-main-layout">
        <div className="fg-left-col">
          <div className="fg-search fg-glass">
            <FiSearch />
            <input
              type="text"
              placeholder="Search by ID, name, email, phone..."
              value={searchText}
              onChange={handleSetSearchText}
            />
          </div>

          <div className="fg-table-card fg-glass">
            <table className="fg-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Registered On</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.user_id}
                      onClick={() => handleSelectUser(user)}
                      className={selectedUser?.user_id === user.user_id ? "fg-row--active" : ""}
                    >
                      <td>{user.user_id}</td>
                      <td>
                        <div className="fg-customer">
                          <div className="fg-avatar">{user.fullname?.charAt(0).toUpperCase()}</div>
                          <div>
                            <h4>{user.fullname}</h4>
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>{user.phone}</td>
                      <td>
                        <span
                          className={
                            user.role_name.toLowerCase() === "admin"
                              ? "fg-status fg-status--completed"
                              : "fg-status fg-status--pending"
                          }
                        >
                          {user.role_name}
                        </span>
                      </td>
                      <td>{new Date(user.datetime_reg).toLocaleDateString()}</td>
                      <td>
                        <FiChevronDown />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="fg-empty">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="fg-pagination">
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        </div>

        <div className="fg-right-col">
          <div className="fg-filter-arc">
            {filters.map((filter) => (
              <button
                key={filter.value}
                className={activeFilter === filter.value ? "fg-pill--active" : ""}
                onClick={() => handleSetActiveFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {selectedUser && (
            <div className="fg-detail-card fg-glass">
              <div className="fg-detail-header">
                <div className="fg-detail-id">USER #{selectedUser.user_id}</div>
                <div
                  className={
                    selectedUser.role_name.toLowerCase() === "admin"
                      ? "fg-status fg-status--completed"
                      : "fg-status fg-status--pending"
                  }
                >
                  {selectedUser.role_name}
                </div>
              </div>

              <div className="fg-detail-body">
                <div className="fg-detail-avatar">{selectedUser.fullname?.charAt(0).toUpperCase()}</div>
                <div className="fg-detail-user">
                  {isEditing ? (
                    <input
                      className="users-edit-input"
                      value={selectedUser.fullname}
                      onChange={(e) => setSelectedUser({ ...selectedUser, fullname: e.target.value })}
                    />
                  ) : (
                    <h2>{selectedUser.fullname}</h2>
                  )}

                  {!isEditing && <p>{selectedUser.email}</p>}
                </div>
              </div>

              <div className="fg-info-list">
                <div className="fg-info-row">
                  <FiMail />
                  {isEditing ? (
                    <input
                      className="users-edit-input"
                      value={selectedUser.email}
                      onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                    />
                  ) : (
                    <span>{selectedUser.email}</span>
                  )}
                </div>

                <div className="fg-info-row">
                  <FiPhone />
                  {isEditing ? (
                    <input
                      className="users-edit-input"
                      value={selectedUser.phone}
                      onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                    />
                  ) : (
                    <span>{selectedUser.phone}</span>
                  )}
                </div>

                <div className="fg-info-row">
                  <FiCalendar />
                  <span>{new Date(selectedUser.datetime_reg).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="fg-payment-card">
                <div>
                  <span className="fg-payment-label">User ID</span>
                  <h3>#{selectedUser.user_id}</h3>
                </div>
                <div>
                  <span className="fg-payment-label">Role</span>
                  <h1>{selectedUser.role_name}</h1>
                </div>
              </div>

              <div className="fg-summary">
                <div className="fg-summary-item">
                  <FaCheckCircle className="fg-summary-icon fg-summary-icon--success" />
                  <div>
                    <span>Status</span>
                    <strong>Active</strong>
                  </div>
                </div>
              </div>

              <div className="users-detail-actions">
                {!isEditing ? (
                  <button className="users-edit-btn" onClick={handleEditUser}>Edit User</button>
                ) : (
                  <>
                    <button className="users-save-btn" onClick={handleUpdateUser}>Save Changes</button>
                    <button className="users-cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;