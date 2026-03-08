import './Sidebar.css';


  function Sidebar({ setDepartment }) {
  return (
    <div className="sidebar">
      
      <h3>Departments</h3>

      <ul>
        <li onClick={() => setDepartment("ICU")}>ICU</li>
        <li onClick={() => setDepartment("Lab")}>Lab</li>
        <li onClick={() => setDepartment("Pharmacy")}>Pharmacy</li>
        <li onClick={() => setDepartment("Emergency")}>Emergency</li>
      </ul>
    </div>
  );
}
   
export default Sidebar;
