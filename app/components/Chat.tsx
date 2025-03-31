"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

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
      <div className="mb-4 space-y-2">
        {messages.map((msg, i) => (
          <p key={i} className={msg.from === currentUserId ? "text-right text-blue-400" : "text-left text-gray-300"}>
            {msg.message}
          </p>
        ))}
      </div>
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