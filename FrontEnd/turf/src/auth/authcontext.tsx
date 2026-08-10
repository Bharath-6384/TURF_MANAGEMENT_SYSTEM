import React, { createContext, useContext, useState, useEffect } from "react";
import Loading from "../component/common/loading/loading";
import { getUserFromToken } from "../services/service/common/auth";
import { AuthContextModel } from "../model/common/authcontextmodel";

const AuthContext = createContext<AuthContextModel.AuthContextType | undefined>(undefined);

export const useAuth = ():AuthContextModel.AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider: React.FC<AuthContextModel.AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthContextModel.AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const verifyToken = ():AuthContextModel.AuthUser | null => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("Name");
    if (!token || !name) return null;

    const decodedUser = getUserFromToken();
    if (!decodedUser || !decodedUser.role || !decodedUser.email) return null;

    return {  ...decodedUser ,token, name } as AuthContextModel.AuthUser;
  };

  useEffect(() => {
    const validUser = verifyToken();
    if (validUser) {
      setUser(validUser);
    } else {
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("Name");
    }
    setLoading(false);
  }, []);

  const login = (userData: AuthContextModel.AuthUser) => {
    setUser(userData);
    localStorage.setItem("token", userData.token);
    localStorage.setItem("Name", userData.name);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("Name");
  };

  if (loading) return <Loading message="Verifying authentication..." />;

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
