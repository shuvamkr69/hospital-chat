import "./ChatHeader.css";

const DEPT_META = {
  ICU:       { members: 8,  label: "ICU Department" },
  Lab:       { members: 4,  label: "Laboratory" },
  Pharmacy:  { members: 5,  label: "Pharmacy" },
  Emergency: { members: 12, label: "Emergency" },
};

export default function ChatHeader({ department }) {
  const meta = DEPT_META[department] || { members: 0, label: department };

  return (
    <div className="chat-header">
      <div className="chat-header-info">
        <div className="chat-header-title">{meta.label}</div>
        <div className="chat-header-meta">
          <span className="chat-header-online-dot" />
          {meta.members} members online
        </div>
      </div>
    </div>
  );
}
