import "./ChatHeader.css";
import { useSocketContext } from "../../context/SocketContext";

const DEPT_META = {
  ICU: { members: 8, label: "ICU Department" },
  Lab: { members: 4, label: "Laboratory" },
  Pharmacy: { members: 5, label: "Pharmacy" },
  Emergency: { members: 12, label: "Emergency" },
};

export default function ChatHeader({ department }) {
  const { departmentCounts } = useSocketContext();
  const meta = DEPT_META[department] || { members: 0, label: department };
  const liveMembers = departmentCounts?.[department] ?? 0;

  return (
    <div className="chat-header">
      <div className="chat-header-info">
        <div className="chat-header-title">{meta.label}</div>
        <div className="chat-header-meta">
          <span className="chat-header-online-dot" />
          {liveMembers} members online
        </div>
      </div>
    </div>
  );
}
