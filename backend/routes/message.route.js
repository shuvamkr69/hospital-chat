import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessagesByDepartment,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller.js"; // ✅ fixed controller filename

const router = express.Router();

// GET /api/messages/users  — list of users for sidebar
router.get("/users", protectRoute, getUsersForSidebar);

// GET /api/messages/department/:dept  — fetch messages by department
router.get("/department/:dept", protectRoute, getMessagesByDepartment);

// POST /api/messages  — send a message to a department
router.post("/", protectRoute, sendMessage);

export default router;
