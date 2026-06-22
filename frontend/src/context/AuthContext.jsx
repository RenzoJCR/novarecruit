import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService.js";

const AuthContext = createContext(null);

const TOKEN_KEY = "novarecruit_token";
const USER_KEY = "novarecruit_user";

function buildUserFromAuth(authData) {
  return {
    id: authData.userId,
    nombreCompleto: authData.nombreCompleto,
    correo: authData.correo,
    rolNombre: authData.rolNombre,
    correoVerificado: authData.correoVerificado,
    debeCambiarPassword: authData.debeCambiarPassword,
  };
}

function getStoredUser() {
  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [loadingAuth, setLoadingAuth] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [currentUser]);

  const saveSession = (authData) => {
    if (!authData?.token) return null;

    const user = buildUserFromAuth(authData);

    setToken(authData.token);
    setCurrentUser(user);

    return user;
  };

  const login = async (credentials) => {
    setLoadingAuth(true);

    try {
      const data = await authService.login(credentials);

      if (data.token) {
        saveSession(data);
      }

      return data;
    } finally {
      setLoadingAuth(false);
    }
  };

  const register = async (payload) => {
    setLoadingAuth(true);

    try {
      return await authService.register(payload);
    } finally {
      setLoadingAuth(false);
    }
  };

  const verifyEmail = async (payload) => {
    setLoadingAuth(true);

    try {
      const data = await authService.verifyEmail(payload);

      if (data.token) {
        saveSession(data);
      }

      return data;
    } finally {
      setLoadingAuth(false);
    }
  };

  const resendCode = async (payload) => {
    setLoadingAuth(true);

    try {
      return await authService.resendCode(payload);
    } finally {
      setLoadingAuth(false);
    }
  };

  const changePassword = async (payload) => {
    setLoadingAuth(true);

    try {
      const data = await authService.changePassword(payload);

      if (data.token) {
        saveSession(data);
      }

      return data;
    } finally {
      setLoadingAuth(false);
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const value = useMemo(
    () => ({
      token,
      currentUser,
      loadingAuth,
      isAuthenticated: Boolean(token && currentUser),
      login,
      register,
      verifyEmail,
      resendCode,
      changePassword,
      logout,
      saveSession,
    }),
    [token, currentUser, loadingAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider.");
  }

  return context;
}