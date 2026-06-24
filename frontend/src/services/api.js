import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("novarecruit_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const backendMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data;

    error.userMessage =
      typeof backendMessage === "string"
        ? backendMessage
        : "Ocurrió un error inesperado.";

    return Promise.reject(error);
  }
);

export default api;