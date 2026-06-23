import { Client } from "@stomp/stompjs";

const WS_URL = "ws://localhost:8080/ws";

export const websocketService = {
  connectToNotifications(currentUserId, onNotificationReceived) {
    /*
     * Cliente STOMP conectado con WebSocket nativo.
     *
     * Ya no usamos SockJS porque en Vite puede generar el error:
     * "global is not defined".
     *
     * El backend publica en /topic/notificaciones.
     * Este cliente escucha ese canal y filtra por usuarioId.
     */
    const client = new Client({
      brokerURL: WS_URL,

      reconnectDelay: 5000,

      onConnect: () => {
        console.log("WebSocket/STOMP conectado correctamente.");

        client.subscribe("/topic/notificaciones", (message) => {
          try {
            const notification = JSON.parse(message.body);

            const isForCurrentUser =
              Number(notification.usuarioId) === Number(currentUserId);

            if (isForCurrentUser) {
              onNotificationReceived(notification);
            }
          } catch (error) {
            console.error("Error leyendo notificación WebSocket:", error);
          }
        });
      },

      onStompError: (frame) => {
        console.error("Error STOMP:", frame.headers.message);
        console.error("Detalle:", frame.body);
      },

      onWebSocketError: (error) => {
        console.error("Error WebSocket:", error);
      },

      onDisconnect: () => {
        console.log("WebSocket/STOMP desconectado.");
      },
    });

    client.activate();

    return client;
  },

  disconnect(client) {
    if (client && client.active) {
      client.deactivate();
    }
  },
};