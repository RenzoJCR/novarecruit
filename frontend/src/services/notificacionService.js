import api from "./api.js";

export const notificacionService = {
  async getByUsuario(usuarioId) {
    const response = await api.get(`/notificaciones/usuario/${usuarioId}`);
    return response.data;
  },

  async getUnreadByUsuario(usuarioId) {
    const response = await api.get(
      `/notificaciones/usuario/${usuarioId}/no-leidas`
    );
    return response.data;
  },

  async markAsRead(id) {
    const response = await api.patch(`/notificaciones/${id}/leer`);
    return response.data;
  },
};