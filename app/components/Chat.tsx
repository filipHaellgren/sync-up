"use client";

import { useEffect } from "react";
import { useChat } from "../context/ChatContext";
import CallMenu from "./CallMenu";

interface Props {
  user: {
    steamid: string;
    personaname: string;
    avatarfull: string;
  };
  friend: {
    steamid: string;
    personaname: string;
    avatarfull: string;
  };
}

export default function Chat({ user, friend }: Props) {
  const {
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    initializeChat,
  } = useChat();

  const steamUserID = user.steamid;
  const userName = user.personaname;
  const userAvatar = user.avatarfull;

  const friendSteamId = friend.steamid;
  const friendName = friend.personaname;
  const friendAvatar = friend.avatarfull;

  useEffect(() => {
    initializeChat(user, friend);
  }, [user, friend]);

  return (
    <div className="flex flex-col h-full">
    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
    {messages.map((msg, i) => (
  <div key={i} className="flex items-start gap-3">
    <div>
      {msg.from === user.steamid ? (
        <>
          <img src={user.avatarfull} alt={user.personaname} className="w-10 h-10 rounded-full" />
          <h4 className="text-sm font-semibold text-gray-300">{user.personaname}</h4>
        </>
      ) : (
        <>
          <img src={friend.avatarfull} alt={friend.personaname} className="w-10 h-10 rounded-full" />
          <h4 className="text-sm font-semibold text-gray-300">{friend.personaname}</h4>
        </>
      )}
      <p className="text-sm text-gray-200">{msg.text}</p>
    </div>
  </div>
))}
<CallMenu user={user} friend={friend}/>
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