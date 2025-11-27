import prisma from "../../../../shared/prisma";
import { ExtendedWebSocket } from "../types";

export async function handleFetchChats(ws: ExtendedWebSocket, data: any) {
  if (!ws.userId) {
    console.log("User not authenticated");
    return;
  }

  const chats = await prisma.user.findMany({
    where: { role: "ADMIN" },
  });

  ws.send(
    JSON.stringify({
      event: "fetchChats",
      data: chats,
    })
  );
}
