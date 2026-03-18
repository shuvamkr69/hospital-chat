import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    // ✅ Department field for channel-based messaging (ICU, Lab, Pharmacy, Emergency)
    department: {
      type: String,
      required: true,
      enum: ["ICU", "Lab", "Pharmacy", "Emergency"],
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

// Index for fast department-based queries
messageSchema.index({ department: 1, createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
