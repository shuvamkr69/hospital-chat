import { useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useSocketContext } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export function useSocket(department, onMessage) {
  const { socketRef, setDepartmentCounts, setDepartmentMembers } =
    useSocketContext();
  const { user } = useAuth();
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!department) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      withCredentials: true,
      query: {
        userId: user?.id || "",
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join_department", department);
    });

    socket.on("departmentOnline", (counts) => {
      setDepartmentCounts?.(counts || {});
    });

    // ✅ NEW: listen for members
    socket.on("departmentMembers", (members) => {
      setDepartmentMembers?.(members || {});
    });

    socket.on("receive_message", (message) => {
      onMessageRef.current?.(message);
    });

    return () => {
      socket.emit("leave_department", department);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [department, user?.id]);

  const sendMessage = useCallback(
    (payload) => {
      socketRef.current?.emit("send_message", payload);
    },
    [socketRef],
  );

  return { sendMessage };
}
