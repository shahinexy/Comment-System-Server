import { Server } from "socket.io";
import { handleAuthenticate } from "./eventHandlers/authenticate";
import { ExtendedSocket } from "./types";
import { handleReaction } from "./eventHandlers/handleReaction";
import { handlePostRoom } from "./eventHandlers/handlePostRoom";
import { handleCreateComment } from "./eventHandlers/handleCreateComment";
import { handleCreateCommentReply } from "./eventHandlers/handleCreateCommentReplay";
import { handleUpdateComment } from "./eventHandlers/handleUpdateComment";
import { handleDeleteComment } from "./eventHandlers/handleDeleteComment";

export function handleConnection(socket: ExtendedSocket, io: Server) {

  // socket.onAny((event, data) => {
  //   console.log("Received event:", event, data);
  // });

  handlePostRoom(socket, io);

  socket.on("authenticate", async (data) => {
    await handleAuthenticate(socket, data, io);
  });

  socket.on("reactPost", async (data) => {
    await handleReaction(socket, data, io);
  });

  socket.on("createComment", async (data) => {
    await handleCreateComment(socket, data, io);
  });

  socket.on("createCommentReply", async (data) => {
    await handleCreateCommentReply(socket, data, io);
  });

  socket.on("updateComment", async (data) => {
    await handleUpdateComment(socket, data, io);
  });

  socket.on("deleteComment", async (data) => {
    await handleDeleteComment(socket, data, io);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
}
