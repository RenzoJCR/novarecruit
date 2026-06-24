import { Client } from "@stomp/stompjs";

function getWebSocketUrl() {
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL;
  }

  const protocol = window.location.protocol === "https:" ? "wss" : "ws";

  /*
   * En producción:
   * http://57.156.65.62  -> ws://57.156.65.62/ws
   *
   * En local con Vite, si no defines VITE_WS_URL,
   * intentará conectarse al mismo host de Vite.
   * Para local puedes crear frontend/.env con:
   * VITE_WS_URL=ws://localhost:8080/ws
   */
  return `${protocol}://${window.location.host}/ws`;
}

export const websocketService = {
  connectToNotifications(usuarioId, onNotification) {
    if (!usuarioId) return null;

    const client = new Client({
      brokerURL: getWebSocketUrl(),
      reconnectDelay: 5000,
      debug: () => {},
      onConnect: () => {
        console.log("WebSocket/STOMP conectado correctamente.");

        client.subscribe(`/topic/notificaciones/${usuarioId}`, (message) => {
          const notification = JSON.parse(message.body);
          onNotification(notification);
        });
      },
      onStompError: (frame) => {
        console.error("Error STOMP:", frame);
      },
      onWebSocketError: (error) => {
        console.error("Error WebSocket:", error);
      },
    });

    client.activate();

    return client;
  },

  disconnect(client) {
    if (client) {
      client.deactivate();
    }
  },
};