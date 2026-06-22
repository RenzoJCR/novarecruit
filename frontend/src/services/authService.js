import api from "./api.js";

export const authService = {
  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  async register(data) {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  async verifyEmail(data) {
    const response = await api.post("/auth/verify-email", data);
    return response.data;
  },

  async resendCode(data) {
    const response = await api.post("/auth/resend-code", data);
    return response.data;
  },

  async changePassword(data) {
    const response = await api.patch("/auth/change-password", data);
    return response.data;
  },
};