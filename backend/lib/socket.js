import { Server } from "socket.io";
import http from "http";
import express from "express";

import { User } from "../models/user.model.js";
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

// userId → socketId map (for online presence)
const userSocketMap = {};
// department -> Set of socket ids
const departmentSockets = new Map();
// socketId -> Set of departments joined
const socketDepartments = new Map();

// socketId -> lightweight user profile
const socketUserMap = new Map();

const emitDepartmentOnlineState = () => {
  const counts = {};
  const members = {};

  for (const [dept, set] of departmentSockets.entries()) {
    counts[dept] = set.size;
    members[dept] = Array.from(set)
      .map((socketId) => socketUserMap.get(socketId))
      .filter(Boolean);
  }

  io.emit("departmentOnline", counts);
  io.emit("departmentMembers", members);
};
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;

    User.findById(userId)
      .select("_id fullName email profilePic")
      .lean()
      .then((user) => {
        if (!user) return;

        socketUserMap.set(socket.id, {
          id: user._id.toString(),
          name: user.fullName,
          email: user.email,
          profilePic: user.profilePic || "",
        });

        emitDepartmentOnlineState();
      })
      .catch(() => {});
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // JOIN
  socket.on("join_department", (department) => {
    socket.join(department);

    if (!departmentSockets.has(department)) {
      departmentSockets.set(department, new Set());
    }
    departmentSockets.get(department).add(socket.id);

    if (!socketDepartments.has(socket.id)) {
      socketDepartments.set(socket.id, new Set());
    }
    socketDepartments.get(socket.id).add(department);

    emitDepartmentOnlineState();
  });

  // LEAVE
  socket.on("leave_department", (department) => {
    socket.leave(department);

    if (departmentSockets.has(department)) {
      departmentSockets.get(department).delete(socket.id);
      if (departmentSockets.get(department).size === 0) {
        departmentSockets.delete(department);
      }
    }

    if (socketDepartments.has(socket.id)) {
      socketDepartments.get(socket.id).delete(department);
    }

    emitDepartmentOnlineState();
  });

  // MESSAGE
  socket.on("send_message", (message) => {
    const { department } = message;
    if (department) {
      socket.to(department).emit("receive_message", message);
    }
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    if (userId) {
      delete userSocketMap[userId];
    }

    if (socketDepartments.has(socket.id)) {
      for (const dept of socketDepartments.get(socket.id)) {
        if (departmentSockets.has(dept)) {
          departmentSockets.get(dept).delete(socket.id);
          if (departmentSockets.get(dept).size === 0) {
            departmentSockets.delete(dept);
          }
        }
      }
      socketDepartments.delete(socket.id);
    }

    socketUserMap.delete(socket.id);

    emitDepartmentOnlineState();
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
