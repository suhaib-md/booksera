import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Import AuthContext

function AuthGuard({ children }) {
  const navigate = useNavigate();
  const { user, loading } = useAuth(); // Use user and loading from AuthContext

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login"); // Redirect if not authenticated
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Checking authentication...</div>;
  }

  return children; // Render children if authenticated
}

export default AuthGuard;