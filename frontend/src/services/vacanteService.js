import api from "./api.js";

export const vacanteService = {
  async getAll() {
    const response = await api.get("/vacantes");
    return response.data;
  },

  async getActive() {
    const response = await api.get("/vacantes/activas");
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/vacantes/${id}`);
    return response.data;
  },

  async create(vacanteData) {
    const response = await api.post("/vacantes", vacanteData);
    return response.data;
  },

  async update(id, vacanteData) {
    const response = await api.put(`/vacantes/${id}`, vacanteData);
    return response.data;
  },

  async selectWinner(vacanteId, postulacionId) {
    const response = await api.patch(
      `/vacantes/${vacanteId}/seleccionar-ganador/${postulacionId}`
    );
    return response.data;
  },

  async cancel(id) {
    await api.delete(`/vacantes/${id}`);
  },
};