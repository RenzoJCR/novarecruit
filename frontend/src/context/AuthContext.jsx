import { createContext, useContext, useState } from "react";
import { mockUsers } from "../data/users.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(mockUsers.postulante);

  const loginAs = (role) => {
    setCurrentUser(mockUsers[role]);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loginAs,
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