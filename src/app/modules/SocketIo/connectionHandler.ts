import { Server } from "socket.io";
import { handleAuthenticate } from "./eventHandlers/authenticate";
import { handleMessage } from "./eventHandlers/handleMessage";
import { ExtendedSocket } from "./types";
import { handleReaction } from "./eventHandlers/handleReaction";

export function handleConnection(socket: ExtendedSocket, io: Server) {
  console.log("Client connected:", socket.id);

  socket.onAny((event, data) => {
    console.log("📩 Received event:", event, data);
  });

  socket.on("authenticate", async (data) => {
    await handleAuthenticate(socket, data, io);
  });

  socket.on("message", async (data) => {
    await handleMessage(socket, data);
  });

    socket.on("reactPost", async (data) => {
    await handleReaction(socket, data, io);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    if (socket.userId) {
      // handle cleanup if needed
    }
  });
}
