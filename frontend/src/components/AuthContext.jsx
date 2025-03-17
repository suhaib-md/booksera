import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { backendAPI } from "../utils/api";

// Configure axios to include credentials in requests
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status without causing redirects
  const checkAuthStatus = async () => {
    try {
      const response = await backendAPI.get("/auth-status/");
      if (response.data.authenticated) {
        setUser({
          username: response.data.username,
          email: response.data.email
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the full user profile - only when we know we're authenticated
  const fetchUserProfile = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await backendAPI.get("/profile/");
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Initial authentication check
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Get full profile when authentication state changes to true
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated]);

  const login = async (credentials) => {
    try {
      await backendAPI.post("/login/", credentials);
      await checkAuthStatus(); // First verify authentication
      await fetchUserProfile(); // Then get full profile
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await backendAPI.post("/logout/");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        setUser, 
        isAuthenticated, 
        login, 
        logout, 
        loading,
        refreshProfile: fetchUserProfile 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);