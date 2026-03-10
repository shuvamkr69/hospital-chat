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

// Demo seed messages per department
const DEMO_MESSAGES = {
  ICU: [
    { id: "1", senderId: "1", senderName: "Dr. Sarah Jenkins", text: "Has anyone checked the latest labs for room 402?", timestamp: new Date(Date.now() - 20 * 60000).toISOString() },
    { id: "2", senderId: "demo-001", senderName: "You", text: "Yes, just came in. Glucose levels are stable.", timestamp: new Date(Date.now() - 18 * 60000).toISOString() },
    { id: "3", senderId: "2", senderName: "Dr. Michael Chen", text: "Great, I will update the chart now. Thanks!", timestamp: new Date(Date.now() - 16 * 60000).toISOString() },
  ],
  Lab: [
    { id: "4", senderId: "5", senderName: "Dr. Lisa Park", text: "CBC results for patients in ICU are ready.", timestamp: new Date(Date.now() - 30 * 60000).toISOString() },
    { id: "5", senderId: "6", senderName: "Tech. Ryan Gomez", text: "Blood culture samples received. Processing now.", timestamp: new Date(Date.now() - 10 * 60000).toISOString() },
  ],
  Pharmacy: [
    { id: "6", senderId: "7", senderName: "PharmD. Anna Wu", text: "Warfarin order for room 308 — please confirm dose.", timestamp: new Date(Date.now() - 45 * 60000).toISOString() },
  ],
  Emergency: [
    { id: "7", senderId: "9", senderName: "Dr. James Okafor", text: "Incoming trauma in 10 minutes. Team to bay 3.", timestamp: new Date(Date.now() - 5 * 60000).toISOString() },
    { id: "8", senderId: "10", senderName: "Nurse Priya Patel", text: "Bay 3 is ready. IV lines prepared.", timestamp: new Date(Date.now() - 3 * 60000).toISOString() },
  ],
};

export default function DashboardLayout() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [department, setDepartment] = useState("ICU");
  const [loading, setLoading] = useState(false);

  // Load messages when department changes
  useEffect(() => {
    setLoading(true);
    const load = async () => {
      try {
        const { data } = await messagesApi.getByDepartment(department);
        setMessages(data);
      } catch {
        // Fall back to demo data
        setMessages(DEMO_MESSAGES[department] || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [department]);

  // Socket: receive incoming messages
  const handleIncoming = useCallback((msg) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const { sendMessage } = useSocket(department, handleIncoming);

  const handleSend = async (text) => {
    const msg = {
      id: `local-${Date.now()}`,
      senderId: user?.id,
      senderName: user?.name,
      text,
      department,
      timestamp: new Date().toISOString(),
    };

    // Optimistic update
    setMessages((prev) => [...prev, msg]);

    // Emit via socket
    sendMessage(msg);

    // Also persist via REST
    try {
      await messagesApi.send(msg);
    } catch {
      // Message already shown optimistically; handle retry logic here if needed
    }
  };

  return (
    <div className="dashboard">
      <Navbar department={department} setDepartment={setDepartment} />

      <div className="dashboard-body">
        <Sidebar department={department} />

        <div className="chat-container">
          <ChatHeader department={department} />
          {loading
            ? <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-tertiary)", fontSize: "var(--text-sm)" }}>Loading messages…</div>
            : <ChatArea messages={messages} />
          }
          <MessageInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
