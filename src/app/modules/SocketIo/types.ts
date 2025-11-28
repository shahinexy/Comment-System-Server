import { Socket } from "socket.io";

export interface ExtendedSocket extends Socket {
  userId?: string;
}

export type SocketEvent =
  | "authenticate"
  | "reactPost"
  | "createComment"
  | "createCommentReply"
  | "updateComment"
  | "deleteComment";
