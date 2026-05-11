import { createContext, useContext, useState } from "react";
import { mockUsers } from "../data/users";  

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(mockUsers.postulante);

  const loginAs = (role) => {
    setCurrentUser(mockUsers[role]);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loginAs,
        logout,
        isAuthenticated: Boolean(currentUser),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}