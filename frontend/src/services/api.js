import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/*
 * Este interceptor agrega el JWT a cada petición.
 *
 * En nuestro proyecto el token se guarda como:
 * localStorage["novarecruit_token"]
 *
 * Si el backend no recibe este header:
 * Authorization: Bearer TOKEN
 * Spring Security responde 403 en rutas protegidas.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("novarecruit_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/*
 * Este interceptor convierte errores del backend en mensajes entendibles.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const backendMessage =
      error.response?.data?.message ||
      error.response?.data?.mensaje ||
      error.response?.data?.error;

    if (status === 401) {
      error.userMessage =
        "Tu sesión expiró o no es válida. Inicia sesión nuevamente.";
    } else if (status === 403) {
      error.userMessage =
        "No tienes permisos para realizar esta acción.";
    } else if (backendMessage) {
      error.userMessage = backendMessage;
    } else {
      error.userMessage = "Ocurrió un error al comunicarse con el servidor.";
    }

    return Promise.reject(error);
  }
);

export default api;