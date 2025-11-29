import prisma from "../../../../shared/prisma";
import { ExtendedSocket } from "../types";

export const handleDeleteComment = async (
  socket: ExtendedSocket,
  data: any,
  io: any
) => {
  try {
    const { commentId, type } = data;

    if (!socket.userId) {
      return socket.emit("socketError", { message: "Unauthorized." });
    }

    if (!commentId) {
      return socket.emit("socketError", { message: "Invalid delete payload." });
    }

    if (type !== "comment" && type !== "commentReply") {
      return socket.emit("socketError", {
        message:
          'Invalid comment type. Type must be "comment" or "commentReply".',
      });
    }

    let payload: any = {};

    if (type === "comment") {
      const existingComment = await prisma.postComment.findUnique({
        where: { id: commentId },
        select: { id: true, postId: true, userId: true },
      });

      if (!existingComment) {
        return socket.emit("socketError", { message: "Comment not found." });
      }

      if (existingComment.userId !== socket.userId) {
        return socket.emit("socketError", {
          message: "You cannot delete this comment.",
        });
      }

      await prisma.commentReply.deleteMany({
        where: { postCommentId: commentId },
      });

      await prisma.postComment.delete({ where: { id: commentId } });

      payload = {
        type: "COMMENT_DELETED",
        commentId,
        postId: existingComment.postId,
      };
    } else {
      const existingReply = await prisma.commentReply.findUnique({
        where: { id: commentId },
        select: {
          id: true,
          userId: true,
          postComment: { select: { postId: true } },
        },
      });

      if (!existingReply) {
        return socket.emit("socketError", { message: "Reply not found." });
      }

      if (existingReply.userId !== socket.userId) {
        return socket.emit("socketError", {
          message: "You cannot delete this reply.",
        });
      }

      await prisma.commentReply.delete({ where: { id: commentId } });

      payload = {
        type: "COMMENT_REPLY_DELETED",
        commentId: commentId,
        postId: existingReply.postComment.postId,
      };
    }

    io.to(payload.postId).emit("deleteComment", payload);

    socket.emit("deleteComment", payload);
  } catch (error: any) {
    socket.emit("socketError", {
      code: "COMMENT_DELETE_ERROR",
      message: "Failed to delete comment.",
    });
  }
};
