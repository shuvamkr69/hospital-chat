import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useSocketContext } from "../context/SocketContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export function useSocket(department, onMessage) {
  const socketRef = useSocketContext();
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!department) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join_department", department);
    });

    socket.on("receive_message", (message) => {
      onMessageRef.current?.(message);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.emit("leave_department", department);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [department, socketRef]);

  const sendMessage = (payload) => {
    
    socketRef.current?.emit("send_message", payload);
  };

  return { sendMessage };
}
