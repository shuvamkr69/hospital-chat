import "./Sidebar.css";

function Sidebar() {

  return (
    <div className="sidebar">

      <h4>STAFF</h4>

      <div className="staff">

        <div className="staff-member">
          <div className="avatar"></div>
          <div>
            <p>Dr. Sarah Jenkins</p>
            <span>Doctor</span>
          </div>
        </div>

        <div className="staff-member">
          <div className="avatar"></div>
          <div>
            <p>Dr. Michael Chen</p>
            <span>Doctor</span>
          </div>
        </div>

        <div className="staff-member">
          <div className="avatar"></div>
          <div>
            <p>Nurse Emily Davis</p>
            <span>Nurse</span>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Sidebar;