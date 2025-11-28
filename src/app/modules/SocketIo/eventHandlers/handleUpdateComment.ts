import prisma from "../../../../shared/prisma";
import { ExtendedSocket } from "../types";

export const handleUpdateComment = async (
  socket: ExtendedSocket,
  data: any,
  io: any
) => {
  try {
    const { commentId, content, type } = data;

    if (!socket.userId) {
      return socket.emit("socketError", { message: "Unauthorized." });
    }

    if (!commentId || !content) {
      return socket.emit("socketError", { message: "Invalid update payload." });
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
          message: "You cannot edit this comment.",
        });
      }

      const updatedComment = await prisma.postComment.update({
        where: { id: commentId },
        data: { content },
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

      payload = {
        type: "COMMENT_UPDATED",
        comment: updatedComment,
        postId: existingComment.postId,
      };
    } else {
      const existingCommentReply = await prisma.commentReply.findUnique({
        where: { id: commentId },
        select: {
          id: true,
          userId: true,
          postComment: { select: { postId: true } },
        },
      });

      if (!existingCommentReply) {
        return socket.emit("socketError", { message: "Comment not found." });
      }

      if (existingCommentReply.userId !== socket.userId) {
        return socket.emit("socketError", {
          message: "You cannot edit this comment.",
        });
      }

      const updatedComment = await prisma.commentReply.update({
        where: { id: commentId },
        data: { content },
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

      payload = {
        type: "COMMENT_REPLY_UPDATED",
        comment: updatedComment,
        postId: existingCommentReply.postComment.postId,
      };
    }

    io.to(payload.postId).emit("updateComment", payload);

    socket.emit("updateComment", payload);
  } catch (error: any) {
    socket.emit("socketError", {
      code: "COMMENT_EDIT_ERROR",
      message: "Failed to edit comment.",
    });
  }
};
