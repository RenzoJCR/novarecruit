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

  async getByPostulante(postulanteId) {
    const response = await api.get(
      `/evaluaciones-postulacion/postulante/${postulanteId}`
    );
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

  async submit(id, data) {
    const payload = {
      evaluacionPostulacionId: Number(id),
      respuestas: data.respuestas || [],
    };

    const response = await api.post(
      "/evaluaciones-postulacion/enviar",
      payload
    );

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