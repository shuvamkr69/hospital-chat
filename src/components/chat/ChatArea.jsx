import { useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import "./ChatArea.css";

function getInitials(name = "") {
  return name.split(" ").slice(0, 2).map(n => n[0]).join("");
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function MessageBubble({ message, isSent }) {
  return (
    <div className={`message-group ${isSent ? "sent" : "received"}`}>
      {!isSent && (
        <div className="message-sender-row">
          <div className="message-sender-avatar">
            {getInitials(message.senderName)}
          </div>
          <span className="message-sender-name">{message.senderName}</span>
        </div>
      )}
      <div className="message-bubble">{message.text}</div>
      <div className="message-time">{formatTime(message.timestamp)}</div>
    </div>
  );
}

export default function ChatArea({ messages }) {
  const { user } = useAuth();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages.length) {
    return (
      <div className="chat-area">
        <div className="chat-empty">
          <div className="chat-empty-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <p>No messages yet. Start the conversation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-area">
      {messages.map((msg, i) => {
        const isSent = msg.senderId === user?.id;

        // Date divider
        const showDate =
          i === 0 ||
          new Date(msg.timestamp).toDateString() !==
          new Date(messages[i - 1].timestamp).toDateString();

        return (
          <div key={msg.id || i}>
            {showDate && (
              <div className="chat-date-divider">
                <span>
                  {new Date(msg.timestamp).toLocaleDateString([], {
                    weekday: "long", month: "short", day: "numeric"
                  })}
                </span>
              </div>
            )}
            <MessageBubble message={msg} isSent={isSent} />
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
