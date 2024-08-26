import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchUserDetails } from "../components/User/UserProfile/UserDetailsApi";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setIsAuthenticated(true);
    fetchUserDetails()
      .then((userData) => setUser(userData))
      .catch((err) => {
        console.error(err);
        logout();
      });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserDetails()
        .then((userData) => setUser(userData))
        .catch((err) => {
          console.error(err);
          logout();
        });
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function getAuthToken() {
  const token = localStorage.getItem("token");
  return token;
}
