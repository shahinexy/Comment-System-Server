
import { ExtendedWebSocket } from "../types";



export async function handleMessage(ws: ExtendedWebSocket, data: any) {
  const { message } = data;

  const userId = ws.userId;

  if (!userId)
    return ws.send(
      JSON.stringify({ event: "error", message: "User not found" })
    );



  const response = "response get"

  if (response) {


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
