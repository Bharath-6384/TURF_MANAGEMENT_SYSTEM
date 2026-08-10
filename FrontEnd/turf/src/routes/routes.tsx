import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../auth/authcontext";
import PrivateRoute from "../auth/privateroute";
import Layout from "../component/common/layout/layout";
import LoginPage from "../component/common/login/login-page";
import LandingPage from "../component/common/landing/landingpage";
import UserDashboard from "../component/user/userdashboard/userdashboard";
import AdminDashboard from "../component/admin/admindashboard/admindashboard";
import Bookings from "../component/admin/bookings/bookings";
import Turfs from "../component/admin/turfs/turfs";
import Users from "../component/admin/users/users";
import RegisterTurf from "../component/admin/registerturf/registerturf";
import ExploreTurfs from "../component/common/exploreturfs/exploreturfs";
import BookTurf from "../component/user/bookturf/bookturf";
import Turf from "../component/user/turfs/turfs";
import UserBookings from "../component/user/userbooking/userbooking";
import UserProfile from "../component/user/userprofile/userprofile";
import AdminProfile from "../component/admin/adminprofile/adminprofile";
import Signup from "../component/common/signup/signup";
import ForgotPassword from "../component/common/forgetpassword/forgetpassword";
import ForgotPasswordOtp from "../component/common/forgotpasswordotp/forgotpasswordotp";
import ResetPassword from "../component/common/resetpassword/resetpassword";
import Notifications from "../component/common/notifications/notifications";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/exploreturfs" element={<ExploreTurfs />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/forgotpasswordotp" element={<ForgotPasswordOtp />} />
          <Route path="/resetpassword" element={<ResetPassword />} />

          {/* Common (User + Admin) */}
          <Route element={<PrivateRoute roles={["user", "admin"]} />}>
            <Route element={<Layout />}>
              <Route path="/common/notifications" element={<Notifications />} />
            </Route>
          </Route>

          {/* User */}
          <Route element={<PrivateRoute roles={["user"]} />}>
            <Route element={<Layout />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/bookturf" element={<BookTurf />} />
              <Route path="/user/turfs" element={<Turf />} />
              <Route path="/user/bookings" element={<UserBookings />} />
              <Route path="/user/userprofile" element={<UserProfile />} />
            </Route>
          </Route>

          {/* Admin */}
          <Route element={<PrivateRoute roles={["admin"]} />}>
            <Route element={<Layout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/bookings" element={<Bookings />} />
              <Route path="/admin/turfs" element={<Turfs />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/registerturf" element={<RegisterTurf />} />
              <Route path="/admin/adminprofile" element={<AdminProfile />} />
            </Route>
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;