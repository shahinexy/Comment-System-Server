import prisma from "../../../../shared/prisma";
import { ExtendedSocket } from "../types";

export const handleCreateComment = async (
  socket: ExtendedSocket,
  data: any,
  io: any
) => {
  try {
    const { postId, content } = data;

    if (!socket.userId) {
      return socket.emit("socketError", { message: "Unauthorized." });
    }

    if (!postId || !content) {
      return socket.emit("socketError", {
        message: "Invalid comment payload.",
      });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      return socket.emit("socketError", { message: "Post not found." });
    }

    const newComment = await prisma.postComment.create({
      data: {
        content,
        postId,
        userId: socket.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            image: true,
          },
        },
      },
    });

    const payload = {
      type: "COMMENT_CREATED",
      comment: newComment,
    };

    io.to(postId).emit("newComment", payload);

    socket.emit("newComment", payload);
  } catch (error: any) {
    socket.emit("socketError", {
      code: "COMMENT_ERROR",
      message: "Failed to create comment.",
    });
  }
};
