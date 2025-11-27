import { Server } from "http";
import { WebSocketServer } from "ws";
import { handleConnection } from "./connectionHandler";
import { ExtendedWebSocket } from "./types";

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws: ExtendedWebSocket) => {
    console.log("WebSocket connection established");
    handleConnection(ws, wss);
  });

  return wss;
}
