import WebSocket, { WebSocketServer } from "ws";

let matchedUserId: number | null = null;

export const initWebSocket = () => {
  const wsServer = new WebSocketServer({ port: 8080 });

  wsServer.on("connection", (ws: WebSocket) => {
    console.log("WebSocket client connected");

    let lastSentUserId: number | null = null;

    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN && matchedUserId !== lastSentUserId) {
        ws.send(JSON.stringify({ matched_user_id: matchedUserId }));
        lastSentUserId = matchedUserId;
      }
    }, 1000);

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
      clearInterval(interval);
    });
  });

  wsServer.on("error", (error: any) => {
    console.error("WebSocket server error:", error);
  });

  console.log("WebSocket server running on port 8080");
};
