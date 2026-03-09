function Navbar({ department, setDepartment }) {

  return (
    <div className="navbar">

      <h2>Hospital Chat</h2>

      <div className="tabs">
        {["ICU", "Lab", "Pharmacy", "Emergency"].map((dept) => (
          <button
            key={dept}
            className={department === dept ? "active" : ""}
            onClick={() => setDepartment(dept)}
          >
            {dept}
          </button>
        ))}
      </div>

    </div>
  );
}

export default Navbar;