"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ChatWindow from "./ChatWindow";

const socket = io("http://localhost:3001");

export default function Chat({ currentUserId, friendId }: { currentUserId: string; friendId: string }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    socket.emit("join", currentUserId);

    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, { from: data.from, message: data.message }]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [currentUserId]);

  const sendMessage = () => {
    socket.emit("send-message", {
      to: friendId,
      from: currentUserId,
      message
    });
    setMessages((prev) => [...prev, { from: currentUserId, message }]);
    setMessage("");
  };

  return (
    <div className="p-4">
      <ChatWindow messages={messages} userId={currentUserId}/>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-2 text-black rounded"
        placeholder="Type a message..."
      />
      <button onClick={sendMessage} className="mt-2 bg-blue-500 px-4 py-1 rounded">
        Send
      </button>
    </div>
  );
}