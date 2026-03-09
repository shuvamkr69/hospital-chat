import { useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatArea from "../../components/chat/ChatArea";
import MessageInput from "../../components/chat/MessageInput";

import "./DashboardLayout.css";

function DashboardLayout() {

  const [messages, setMessages] = useState([]);
  const [department, setDepartment] = useState("ICU");

  return (
    <div className="dashboard">

      <Navbar
        department={department}
        setDepartment={setDepartment}
      />

      <div className="dashboard-body">

        <Sidebar />

        <div className="chat-container">

          <ChatHeader department={department} />

          <ChatArea messages={messages} />

          <MessageInput
            messages={messages}
            setMessages={setMessages}
          />

        </div>

      </div>

    </div>
  );
}

export default DashboardLayout;