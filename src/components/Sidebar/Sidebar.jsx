import { useAuth } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";
import "./Sidebar.css";

function getInitials(name) {
  return name.split(" ").slice(0, 2).map(n => n[0]).join("");
}

function AvatarColors(name) {
  const hues = [210, 160, 270, 340, 30, 190];
  const idx  = name.charCodeAt(0) % hues.length;
  return `hsl(${hues[idx]}, 60%, 92%)`;
}

export default function Sidebar({ department }) {
  const { departmentMembers } = useSocketContext();
  const { user } = useAuth();

  const members = departmentMembers?.[department] || [];

  // ✅ Sort: Me first
  const sortedMembers = [...members].sort((a, b) => {
    if (a.id === user?.id) return -1;
    if (b.id === user?.id) return 1;
    return 0;
  });

  return (
    <aside className="sidebar">
      <div className="sidebar-section-title">Online Staff</div>

      <div className="sidebar-staff-list">
        {sortedMembers.map((member) => {
          const isMe = member.id === user?.id;

          return (
            <div key={member.id} className="sidebar-staff-item">
              <div
                className="staff-avatar"
                style={{ background: AvatarColors(member.name) }}
              >
                {member.profilePic ? (
                  <img src={member.profilePic} alt={member.name} />
                ) : (
                  <span style={{ color: "#374151" }}>
                    {getInitials(member.name)}
                  </span>
                )}
                <span className="staff-online-dot" />
              </div>

              <div className="staff-info">
                <div className="staff-name">
                  {member.name} {isMe ? "(Me)" : ""}
                </div>
                <div className="staff-role">
                  Online
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}