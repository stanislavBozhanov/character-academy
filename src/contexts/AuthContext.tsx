import React, { createContext, useState } from "react";

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthContext = createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    // TODO: implement login
    console.log("login");
    setIsAuthenticated(true);
  };

  const logout = () => {
    // TODO: implement logout
    console.log("logout");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
