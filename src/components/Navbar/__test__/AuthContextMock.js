// AuthContextMock.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const MockAuthProvider = ({ children, isAuthenticated = false, user = null }) => {
  const [authState, setAuthState] = useState({ isAuthenticated, user });

  const login = (userData) => {
    setAuthState({ isAuthenticated: true, user: userData });
  };

  const logout = () => {
    setAuthState({ isAuthenticated: false, user: null });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
