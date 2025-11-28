import prisma from "../../../../shared/prisma";
import { ExtendedSocket } from "../types";

export const handleCreateCommentReply = async (
  socket: ExtendedSocket,
  data: any,
  io: any
) => {
  try {
    const { commentId, content } = data;

    if (!socket.userId) {
      return socket.emit("socketError", { message: "Unauthorized." });
    }

    if (!commentId || !content) {
      return socket.emit("socketError", {
        message: "Invalid comment payload.",
      });
    }

    const postComment = await prisma.postComment.findUnique({
      where: { id: commentId },
      select: { id: true, postId: true },
    });

    if (!postComment) {
      return socket.emit("socketError", { message: "Comment not found." });
    }

    const newComment = await prisma.commentReply.create({
      data: {
        content,
        postCommentId: commentId,
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
      type: "COMMENT_REPLY_CREATED",
      comment: newComment,
    };

    io.to(postComment.postId).emit("newCommentReply", payload);

    socket.emit("newCommentReply", payload);
  } catch (error: any) {
    socket.emit("socketError", {
      code: "COMMENT_ERROR",
      message: "Failed to create comment reply.",
    });
  }
};
