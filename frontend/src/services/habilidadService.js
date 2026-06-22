import api from "./api.js";

export const habilidadService = {
  async getAll() {
    const response = await api.get("/habilidades");
    return response.data;
  },

  async getActive() {
    const response = await api.get("/habilidades/activas");
    return response.data;
  },

  async create(habilidadData) {
    const response = await api.post("/habilidades", habilidadData);
    return response.data;
  },

  async update(id, habilidadData) {
    const response = await api.put(`/habilidades/${id}`, habilidadData);
    return response.data;
  },

  async deactivate(id) {
    await api.delete(`/habilidades/${id}`);
  },
};