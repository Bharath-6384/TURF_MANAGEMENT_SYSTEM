import { jwtDecode } from "jwt-decode";
import { TokenModel } from "../../../model/common/tokenModel";

export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<TokenModel.TokenPayload>(token);

    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name,
    };
  } catch (err) {
    console.error("invalid token:", err);
    return null;
  }
};