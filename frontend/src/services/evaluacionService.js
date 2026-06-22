import api from "./api.js";

export const evaluacionService = {
  async getAll() {
    const response = await api.get("/evaluaciones");
    return response.data;
  },

  async getActive() {
    const response = await api.get("/evaluaciones/activas");
    return response.data;
  },

  async getByVacante(vacanteId) {
    const response = await api.get(`/evaluaciones/vacante/${vacanteId}`);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/evaluaciones/${id}`);
    return response.data;
  },

  async create(evaluacionData) {
    const response = await api.post("/evaluaciones", evaluacionData);
    return response.data;
  },

  async deactivate(id) {
    await api.delete(`/evaluaciones/${id}`);
  },
};