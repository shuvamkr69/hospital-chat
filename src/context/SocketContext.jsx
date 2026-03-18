import { createContext, useContext, useRef, useState } from "react";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const [departmentCounts, setDepartmentCounts] = useState({});
  const [departmentMembers, setDepartmentMembers] = useState({});

  return (
    <SocketContext.Provider value={{ socketRef, departmentCounts, setDepartmentCounts, departmentMembers,        // ✅ add
  setDepartmentMembers }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  return useContext(SocketContext);
}
