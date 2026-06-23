import api from "./api.js";

export const userService = {
  async getAll() {
    const response = await api.get("/usuarios");
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  async create(userData) {
    const response = await api.post("/usuarios", userData);
    return response.data;
  },

  async update(id, userData) {
    const response = await api.put(`/usuarios/${id}`, userData);
    return response.data;
  },

  async deactivate(id) {
    await api.delete(`/usuarios/${id}`);
  },

  async reactivate(id) {
    const response = await api.patch(`/usuarios/${id}/reactivar`);
    return response.data;
  },
};