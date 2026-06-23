import api from "./api.js";

export const areaService = {
  async getAll() {
    const response = await api.get("/areas");
    return response.data;
  },

  async getActive() {
    const response = await api.get("/areas/activas");
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/areas/${id}`);
    return response.data;
  },

  async create(areaData) {
    const response = await api.post("/areas", areaData);
    return response.data;
  },

  async update(id, areaData) {
    const response = await api.put(`/areas/${id}`, areaData);
    return response.data;
  },

  async deactivate(id) {
    await api.delete(`/areas/${id}`);
  },

  async reactivate(id) {
    const response = await api.patch(`/areas/${id}/reactivar`);
    return response.data;
  },
};