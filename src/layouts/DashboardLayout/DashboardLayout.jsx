import { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatArea from "../../components/chat/ChatArea";
import MessageInput from "../../components/chat/MessageInput";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../hooks/useSocket";
import { messagesApi } from "../../services/api";
import "./DashboardLayout.css";

// Demo fallback messages per department (used when backend is unreachable)
const DEMO_MESSAGES = {
  ICU: [
    { id: "d1", senderId: "u1", senderName: "Dr. Sarah Jenkins", text: "Has anyone checked the latest labs for room 402?", timestamp: new Date(Date.now() - 20 * 60000).toISOString() },
    { id: "d2", senderId: "u2", senderName: "Dr. Michael Chen", text: "Yes, Glucose levels are stable. I'll update the chart.", timestamp: new Date(Date.now() - 16 * 60000).toISOString() },
  ],
  Lab: [
    { id: "d3", senderId: "u3", senderName: "Dr. Lisa Park", text: "CBC results for ICU patients are ready.", timestamp: new Date(Date.now() - 30 * 60000).toISOString() },
    { id: "d4", senderId: "u4", senderName: "Tech. Ryan Gomez", text: "Blood culture samples received. Processing now.", timestamp: new Date(Date.now() - 10 * 60000).toISOString() },
  ],
  Pharmacy: [
    { id: "d5", senderId: "u5", senderName: "PharmD. Anna Wu", text: "Warfarin order for room 308 — please confirm dose.", timestamp: new Date(Date.now() - 45 * 60000).toISOString() },
  ],
  Emergency: [
    { id: "d6", senderId: "u6", senderName: "Dr. James Okafor", text: "Incoming trauma in 10 minutes. Team to bay 3.", timestamp: new Date(Date.now() - 5 * 60000).toISOString() },
    { id: "d7", senderId: "u7", senderName: "Nurse Priya Patel", text: "Bay 3 is ready. IV lines prepared.", timestamp: new Date(Date.now() - 3 * 60000).toISOString() },
  ],
};

// Normalize a message from the API to a consistent shape
function normalizeMessage(msg) {
  return {
    id: msg._id || msg.id,
    senderId: msg.senderId?.toString?.() || msg.senderId,
    senderName: msg.senderName,
    senderProfilePic: msg.senderProfilePic,
    text: msg.text,
    image: msg.image,
    department: msg.department,
    // ✅ API returns createdAt; socket sends timestamp
    timestamp: msg.createdAt || msg.timestamp,
  };
}

export default function DashboardLayout() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [department, setDepartment] = useState("ICU");
  const [loading, setLoading] = useState(false);

  // Load messages when department changes
  useEffect(() => {
    setLoading(true);
    setMessages([]); // clear while loading
    const load = async () => {
      try {
        const { data } = await messagesApi.getByDepartment(department);
        setMessages(data.map(normalizeMessage));
      } catch {
        // Fallback to demo data if backend unreachable
        setMessages(DEMO_MESSAGES[department] || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [department]);

  // Socket: receive incoming messages in real-time
  const handleIncoming = useCallback((msg) => {
    setMessages((prev) => {
      // Deduplicate: if we already have this message (from optimistic update), skip
      const normalized = normalizeMessage(msg);
      const exists = prev.some(
        (m) => m.id === normalized.id ||
               (m.id?.startsWith?.("local-") && m.text === normalized.text && m.senderId === normalized.senderId)
      );
      if (exists) return prev;
      return [...prev, normalized];
    });
  }, []);

  const { sendMessage } = useSocket(department, handleIncoming);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const optimisticId = `local-${Date.now()}`;
    const msg = {
      id: optimisticId,
      senderId: user?.id,       // ✅ normalized shape from AuthContext
      senderName: user?.name,   // ✅ normalized shape from AuthContext
      text,
      department,
      timestamp: new Date().toISOString(),
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, msg]);

    // Emit via socket (broadcasts to other users in the room)
    sendMessage(msg);

    // Persist via REST API
    try {
      await messagesApi.send({ text, department });
    } catch (err) {
      console.error("Failed to persist message:", err.message);
      // Message already shown; could add retry/error indicator here
    }
  };

  return (
    <div className="dashboard">
      <Navbar department={department} setDepartment={setDepartment} />

      <div className="dashboard-body">
        <Sidebar department={department} />

        <div className="chat-container">
          <ChatHeader department={department} />
          {loading ? (
            <div className="chat-loading">Loading messages…</div>
          ) : (
            <ChatArea messages={messages} />
          )}
          <MessageInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
