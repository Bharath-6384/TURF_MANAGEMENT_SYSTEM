import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { useAuth } from "./authcontext";
import Loading from "../component/common/loading/loading";

type Role = "user" | "admin";

interface PrivateRouteProps {
  roles?: Role[];
  matchIdParam?: string;
}

const PrivateRoute = ({
  roles = [],
  matchIdParam,
}: PrivateRouteProps) => {
  const { user, loading } = useAuth();

  const location = useLocation();

  const params = useParams();

  if (loading) {
    return <Loading message="Verifying authentication..." />;
  }

  if (!user || !user.token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          message: "You must be logged in to access this page.",
          from: location,
        }}
      />
    );
  }

  const userRole = user.role.toLowerCase() as Role;

  if (roles.length && !roles.includes(userRole)) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          message: "You are not authorized to access this page.",
        }}
      />
    );
  }

  if (matchIdParam) {
    const urlId = params[matchIdParam];

    if (urlId && urlId !== String(user.id)) {
      return (
        <Navigate
          to="/"
          replace
          state={{
            message: "You are not authorized to access this page.",
          }}
        />
      );
    }
  }

  return <Outlet />;
};

export default PrivateRoute;