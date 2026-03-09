import "./ChatArea.css";

function ChatArea({ messages }) {

  return (
    <div className="chat-area">

      {messages.map((msg, index) => (
        <div key={index} className="message">
          {msg.text}
        </div>
      ))}

    </div>
  );

}

export default ChatArea;