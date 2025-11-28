import prisma from "../../../../shared/prisma";
import { ExtendedSocket } from "../types";

export async function handleReaction(
  socket: ExtendedSocket,
  data: any,
  io: any
) {
  try {
    const { postId, reactionType } = data;

    if (!socket.userId) {
      socket.emit("socketError", { message: "Unauthorized." });
      return;
    }

    if (!postId || !["LIKE", "DISLIKE"].includes(reactionType)) {
      socket.emit("socketError", { message: "Invalid reaction payload." });
      return;
    }

    const existingReaction = await prisma.postReaction.findFirst({
      where: { postId, userId: socket.userId },
      select: { id: true, reactionType: true, userId: true },
    });

    let viewerReaction = null;

    if (existingReaction && existingReaction.reactionType === reactionType) {
      await prisma.postReaction.delete({
        where: { id: existingReaction.id },
      });
      viewerReaction = null;
    } else if (existingReaction) {
      const updated = await prisma.postReaction.update({
        where: { id: existingReaction.id },
        data: { reactionType },
      });
      viewerReaction = {
        reactionType: updated.reactionType,
        userId: updated.userId,
      };
    } else {
      const created = await prisma.postReaction.create({
        data: { postId, userId: socket.userId, reactionType },
      });
      viewerReaction = {
        reactionType: created.reactionType,
        userId: created.userId,
      };
    }

    const [likes, dislikes] = await Promise.all([
      prisma.postReaction.count({ where: { postId, reactionType: "LIKE" } }),
      prisma.postReaction.count({ where: { postId, reactionType: "DISLIKE" } }),
    ]);

    const updatePayload = {
      type: "REACTION_UPDATED",
      postId,
      likeCount: likes,
      dislikeCount: dislikes,
      viewerReaction,
    };

    io.to(postId).emit("reactionUpdated", updatePayload);

    socket.emit("reactionUpdated", updatePayload);
  } catch (err: any) {
    socket.emit("socketError", {
      code: "REACTION_ERROR",
      message: "Failed to update reaction.",
    });
  }
}
