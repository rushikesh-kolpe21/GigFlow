import { io } from "socket.io-client";

const socketUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const socket = io(socketUrl, {
  withCredentials: true
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

