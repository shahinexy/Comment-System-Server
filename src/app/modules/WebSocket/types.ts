import { WebSocket } from "ws";

export interface ExtendedWebSocket extends WebSocket {
  userId?: string;
}

export type WebSocketEvent =
  | "authenticate"
  | "message"
  | "fetchChats"
  | "unReadMessages"
  | "messageList"
  | "userStatus";
