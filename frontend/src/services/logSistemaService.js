import api from "./api.js";

export const logSistemaService = {
  async getAll() {
    const response = await api.get("/logs");
    return response.data;
  },

  async getByUsuario(usuarioId) {
    const response = await api.get(`/logs/usuario/${usuarioId}`);
    return response.data;
  },

  async getByModulo(modulo) {
    const response = await api.get(`/logs/modulo/${modulo}`);
    return response.data;
  },
};