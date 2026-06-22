import api from "./api.js";

export const roleService = {
  async getAll() {
    const response = await api.get("/roles");
    return response.data;
  },

  async getActive() {
    const response = await api.get("/roles/activos");
    return response.data;
  },
};