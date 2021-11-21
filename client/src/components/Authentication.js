import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Authentication({ children }) {
  const { auth } = useAuth();
  const location = useLocation();

  return auth.token ? (
    children
  ) : (
    <Navigate to="/signin" replace state={{ path: location.pathname }} />
  );
}
