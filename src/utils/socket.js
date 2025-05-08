import { io } from "socket.io-client";
import { SOCKET_URL } from "../components/common/endpoints";

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  secure: true,
  autoConnect: false,
});
export const connectSocket = () => {
  socket.connect();
};
export const disconnectSocket = () => {
  socket.disconnect();
};
