
import { ExtendedWebSocket } from "../types";



export async function handleMessage(ws: ExtendedWebSocket, data: any) {
  const { message } = data;

  const userId = ws.userId;

  if (!userId)
    return ws.send(
      JSON.stringify({ event: "error", message: "User not found" })
    );

  const wordCount = message.trim().split(/\s+/).length;

  // if (wordCount <= 10) {
  //   const warning = "🚫 Please write more than 10 words.";
  //   await prisma.chat.create({
  //     data: { userId, message: warning, role: "AI" },
  //   });

  //   ws.send(JSON.stringify({ event: "message", data: warning }));
  // }

  // await prisma.chat.create({
  //   data: { userId, message, role: "USER" },
  // });

  // const isFitnessRelated = fitnessKeywords.some((word) =>
  //   message.toLowerCase().includes(word)
  // );

  // if (!isFitnessRelated) {
  //   const warning =
  //     "🚫 This is a fitness assistant. Please ask fitness-related questions only!";
  //   await prisma.chat.create({
  //     data: { userId, message: warning, role: "AI" },
  //   });

  //   ws.send(JSON.stringify({ event: "message", data: warning }));
  // }

  const response = "response get"

  if (response) {
    // await prisma.chat.create({
    //   data: { userId, message: response.text, role: "AI" },
    // });

    ws.send(JSON.stringify({ event: "message", data: response }));
  } else {
    ws.send(
      JSON.stringify({
        event: "message",
        data: "Failed to generate tips. Please try again later.",
      })
    );
  }
}
