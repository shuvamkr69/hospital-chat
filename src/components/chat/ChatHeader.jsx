import './ChatHeader.css';

function ChatHeader({ department }) {
  return(
    <div className="chat-header">
       <h2>{department} Department</h2>
    </div>
  );
}

export default ChatHeader;
