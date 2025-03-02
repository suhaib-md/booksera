import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AuthGuard({ children }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/user/", {
        withCredentials: true, // Send cookies
      })
      .then((response) => {
        console.log("User data:", response.data);
        setIsAuthenticated(true);
      })
      .catch((err) => {
        console.error("Auth Failed:", err.response);
        setIsAuthenticated(false);
        navigate("/login");
      });
  }, [navigate]);

  if (isAuthenticated === null) {
    return <div className="h-screen flex items-center justify-center">Checking authentication...</div>;
  }

  return children;
}

export default AuthGuard;
