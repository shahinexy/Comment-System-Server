import { ExtendedSocket } from "../types";

export function handlePostRoom(socket: ExtendedSocket, io: any) {
  socket.on("joinPost", (data: { postId: string }) => {
    if (!data.postId) return;

    socket.join(data.postId);

    socket.emit("joinedPost", {
      message: `Joined post room ${data.postId}`,
      postId: data.postId,
    });
  });

  socket.on("leavePost", (data: { postId: string }) => {
    if (!data.postId) return;

    socket.leave(data.postId);

    socket.emit("leftPost", {
      message: `Left post room ${data.postId}`,
      postId: data.postId,
    });
  });
}
