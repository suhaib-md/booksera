import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function AuthGuard({ children }) {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth(); // Use isAuthenticated instead of user

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login"); // Redirect if not authenticated
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Checking authentication...</div>;
  }

  return children; // Render children if authenticated
}

export default AuthGuard;