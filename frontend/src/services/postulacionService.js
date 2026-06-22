import api from "./api.js";

export const postulacionService = {
  async getAll() {
    const response = await api.get("/postulaciones");
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/postulaciones/${id}`);
    return response.data;
  },

  async getByUsuario(usuarioId) {
    const response = await api.get(`/postulaciones/usuario/${usuarioId}`);
    return response.data;
  },

  async getByVacante(vacanteId) {
    const response = await api.get(`/postulaciones/vacante/${vacanteId}`);
    return response.data;
  },

  async create(postulacionData) {
    const response = await api.post("/postulaciones", postulacionData);
    return response.data;
  },

  async reviewRrhh(id, data) {
    const response = await api.patch(`/postulaciones/${id}/revision-rrhh`, data);
    return response.data;
  },
};