import api from "./api.js";

export const evaluacionPostulacionService = {
  async getAll() {
    const response = await api.get("/evaluaciones-postulacion");
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/evaluaciones-postulacion/${id}`);
    return response.data;
  },

  async getByPostulante(usuarioId) {
    const response = await api.get(`/evaluaciones-postulacion/postulante/${usuarioId}`);
    return response.data;
  },

  async getByEstado(estado) {
    const response = await api.get(`/evaluaciones-postulacion/estado/${estado}`);
    return response.data;
  },

  async assign(data) {
    const response = await api.post("/evaluaciones-postulacion/asignar", data);
    return response.data;
  },

  async submit(data) {
    const response = await api.post("/evaluaciones-postulacion/enviar", data);
    return response.data;
  },

  async review(id, data) {
    const response = await api.patch(
      `/evaluaciones-postulacion/${id}/revision-tecnica`,
      data
    );
    return response.data;
  },
};