
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import ChatHeader from '../../components/Chat/ChatHeader';
import MessageList from '../../components/Chat/MessageList';
import MessageInput from '../../components/Chat/MessageInput';
import { useState } from "react";

import './DashboardLayout.css';

function DashboardLayout() {

  const[messages, setMessage] = useState([]);
  const [department, setDepartment] = useState("ICU");

  return (
     <div className="dashboard">

      <Navbar />

      <div className="dashboard-body">

       <Sidebar setDepartment={setDepartment} />

        <div className="chat-container">
          <ChatHeader department={department} />

          <MessageList messages={messages} />

          <MessageInput
          messages={messages}
          setMessages={setMessage}
          
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
