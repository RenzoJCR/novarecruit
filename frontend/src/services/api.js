import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.nombre ||
      error.response?.data?.descripcion ||
      "Ocurrió un error al comunicarse con el servidor.";

    return Promise.reject({
      ...error,
      userMessage: message,
    });
  }
);

export default api;