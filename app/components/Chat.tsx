"use client";

import { useEffect } from "react";
import { FriendType, ProfileType } from "../styles";
import { useChat } from "../context/ChatContext";

export default function Chat({user, friend}: {user: ProfileType; friend: FriendType;}) {
  const { messages, newMessage, setNewMessage, sendMessage, initializeChat } = useChat();

  useEffect(() => {
    initializeChat(user, friend);
  }, [user, friend]);

  return (
    <div className="flex flex-col h-full">
    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
      {messages.map((msg, i) => (
        <div key={i} className="flex items-start gap-3">
          <div>
            <p className="text-sm text-gray-200">{msg.text}</p>
          </div>
        </div>
      ))}
    </div>
    <div className="pt-4 flex gap-2">
      <input
        className="flex-1 rounded px-4 py-2 text-black"
        placeholder="Type a message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage(user.steamid, friend.steamid);
        }}
      />
      <button
        onClick={()=> sendMessage(user.steamid, friend.steamid)}
        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
      >
        Send
      </button>
    </div>
  </div>
  );
}