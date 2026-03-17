import { useEffect, useState } from "react";
import { staffApi } from "../../services/api";
import "./Sidebar.css";

const DEMO_STAFF = {
  ICU: [
    { id: "1", name: "Dr. Sarah Jenkins", role: "Doctor", online: true },
    { id: "2", name: "Dr. Michael Chen",  role: "Doctor", online: true },
    { id: "3", name: "Nurse Emily Davis", role: "Nurse",  online: false },
    { id: "4", name: "Nurse David Kim",   role: "Nurse",  online: true },
  ],
  Lab: [
    { id: "5", name: "Dr. Lisa Park",     role: "Pathologist", online: true },
    { id: "6", name: "Tech. Ryan Gomez",  role: "Lab Tech",    online: false },
  ],
  Pharmacy: [
    { id: "7", name: "PharmD. Anna Wu",   role: "Pharmacist",  online: true },
    { id: "8", name: "PharmD. Carlos R.", role: "Pharmacist",  online: true },
  ],
  Emergency: [
    { id: "9",  name: "Dr. James Okafor", role: "ER Doctor",  online: true },
    { id: "10", name: "Nurse Priya Patel",role: "ER Nurse",   online: true },
    { id: "11", name: "Dr. Fatima Al-H.", role: "ER Doctor",  online: false },
  ],
};

function getInitials(name) {
  return name.split(" ").slice(0, 2).map(n => n[0]).join("");
}

function AvatarColors(name) {
  const hues = [210, 160, 270, 340, 30, 190];
  const idx  = name.charCodeAt(0) % hues.length;
  return `hsl(${hues[idx]}, 60%, 92%)`;
}

export default function Sidebar({ department }) {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await staffApi.getByDepartment(department);
        setStaff(data);
      } catch {
        setStaff(DEMO_STAFF[department] || []);
      }
    };
    if (department) load();
  }, [department]);

  return (
    <aside className="sidebar">
      <div className="sidebar-section-title">Staff</div>
      <div className="sidebar-staff-list">
        {staff.map((member) => (
          <div key={member.id} className="sidebar-staff-item">
            <div
              className="staff-avatar"
              style={{ background: AvatarColors(member.name) }}
            >
              {member.avatar
                ? <img src={member.avatar} alt={member.name} />
                : <span style={{ color: "#374151" }}>{getInitials(member.name)}</span>
              }
              {member.online && <span className="staff-online-dot" />}
            </div>
            <div className="staff-info">
              <div className="staff-name">{member.name}</div>
              <div className="staff-role">{member.role}</div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
