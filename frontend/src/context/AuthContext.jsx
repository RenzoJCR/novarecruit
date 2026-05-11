import { createContext, useContext, useEffect, useState } from "react";
import { mockUsers } from "../data/users.js";

const AuthContext = createContext(null);

const STORAGE_KEY = "novarecruit_user";

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);

    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
    }

    return null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentUser]);

  const loginAs = (role) => {
    const user = mockUsers[role];

    if (!user) {
      return {
        ok: false,
        message: "Rol no válido.",
      };
    }

    setCurrentUser(user);

    return {
      ok: true,
      user,
    };
  };

  const registerApplicant = (applicantData) => {
    const newApplicant = {
      id: Date.now(),
      name: `${applicantData.names} ${applicantData.lastnames}`,
      role: "postulante",
      roleLabel: "Postulante",
      email: applicantData.email,
      phone: applicantData.phone,
      linkedin: applicantData.linkedin,
      github: applicantData.github,
      cvUrl: applicantData.cvUrl,
      summary: applicantData.summary,
    };

    setCurrentUser(newApplicant);

    return {
      ok: true,
      user: newApplicant,
    };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loginAs,
        registerApplicant,
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