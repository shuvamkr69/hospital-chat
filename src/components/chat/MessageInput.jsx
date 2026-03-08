import './MessageInput.css';
import { useState } from "react";

function MessageInput({ messages, setMessages }) {

  const [input, setInput] = useState("");

  const handleSend = () => {

    if (!input.trim()) return;

    const newMessage = {
      sender: "You",
      text: input
    };

    setMessages([...messages, newMessage]);
    setInput("");
  };

  return (
    <div className="message-input">

      <input
        type="text"
        value={input}
        placeholder="Type your message..."
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={handleSend}>Send</button>

    </div>
  );
}


export default MessageInput;
