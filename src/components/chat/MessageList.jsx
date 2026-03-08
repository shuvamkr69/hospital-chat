import './MessageList.css';

function MessageList({ messages }) {

   return (
    <div className="message-list">
      {messages.map((msg, index) => (
        <div key={index} className="message">
          <strong>{msg.sender}</strong>
          <p>{msg.text}</p>
        </div>
      ))}
    </div>
  );
}

export default MessageList;
