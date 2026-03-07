import './DashboardLayout.css';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import ChatHeader from '../../components/Chat/ChatHeader';
import MessageList from '../../components/Chat/MessageList';
import MessageInput from '../../components/Chat/MessageInput';

function DashboardLayout() {
  return (
    <div>
      <Navbar />
      <div>
        <Sidebar />
        <div>
          <ChatHeader />
          <MessageList />
          <MessageInput />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
