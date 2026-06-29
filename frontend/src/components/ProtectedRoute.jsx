import { Navigate } from "react-router-dom";
import { useAuthModal } from "../contexts/AuthModalContext";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  const { setAuthModalOpen } = useAuthModal();

  if (!token) {
    // Open auth modal instead of redirecting to login page
    setAuthModalOpen(true);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
