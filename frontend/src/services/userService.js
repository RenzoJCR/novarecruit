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

  async create(usuarioData) {
    const response = await api.post("/usuarios", usuarioData);
    return response.data;
  },

  async update(id, usuarioData) {
    const response = await api.put(`/usuarios/${id}`, usuarioData);
    return response.data;
  },

  async deactivate(id) {
    await api.delete(`/usuarios/${id}`);
  },
};