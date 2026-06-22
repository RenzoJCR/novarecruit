import api from "./api.js";

export const logService = {
  async getLatest() {
    const response = await api.get("/logs");
    return response.data;
  },
};