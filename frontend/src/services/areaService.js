import api from "./api.js";

export const areaService = {
  async getAll() {
    const response = await api.get("/areas");
    return response.data;
  },

  async getActive() {
    const data = await this.getAll();
    return data.filter((area) => area.estado === true);
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
};