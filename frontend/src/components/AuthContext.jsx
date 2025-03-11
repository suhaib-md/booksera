import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/profile/", {
        withCredentials: true,
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile(); // Fetch on initial load
  }, []);

  const login = async (credentials) => {
    try {
      await axios.post("http://localhost:8000/api/login/", credentials, {
        withCredentials: true,
      });
      await fetchUserProfile(); // Fetch profile after login
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:8000/api/logout/", {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Expose setUser to consumers
  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);