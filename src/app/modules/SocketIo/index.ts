import { Server } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { handleConnection } from "./connectionHandler";

export function setupSocketIO(server: Server) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    },
  });

  io.on("connection", (socket: Socket)=>{
    handleConnection(socket, io)
  })

  return;
}
