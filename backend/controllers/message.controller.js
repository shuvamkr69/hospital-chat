import { User } from "../models/user.model.js";
import Message from "../models/message.model.js"; // ✅ fixed: was "massage.model.js"
import cloudinary from "../lib/cloudinary.js";
import { io } from "../lib/socket.js";

// GET /api/messages/users — sidebar user list
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/messages/department/:dept — fetch messages for a department
export const getMessagesByDepartment = async (req, res) => {
  try {
    const { dept } = req.params;
    const messages = await Message.find({ department: dept })
      .sort({ createdAt: 1 })
      .limit(100); // last 100 messages

    // Enrich messages with sender profile pictures
    const enrichedMessages = await Promise.all(
      messages.map(async (msg) => {
        const sender = await User.findById(msg.senderId).select("profilePic");
        return {
          ...msg.toObject(),
          senderProfilePic: sender?.profilePic || "",
        };
      }),
    );

    res.status(200).json(enrichedMessages);
  } catch (error) {
    console.error("Error in getMessagesByDepartment:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/messages — send a message to a department
export const sendMessage = async (req, res) => {
  try {
    const { text, image, department } = req.body;
    const senderId = req.user._id;
    const senderName = req.user.fullName;
    const senderProfilePic = req.user.profilePic || "";

    if (!department) {
      return res.status(400).json({ error: "department is required" });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      senderName,
      department,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // ✅ Broadcast to department room via socket (server-side emit)
    io.to(department).emit("receive_message", {
      id: newMessage._id,
      senderId: senderId.toString(),
      senderName,
      senderProfilePic,
      department,
      text: newMessage.text,
      image: newMessage.image,
      timestamp: newMessage.createdAt,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
