"use client";

import { useEffect } from "react";
import { FriendType, ProfileType } from "../styles";
import { useChat } from "../context/ChatContext";
import { useCall } from "../context/CallContext";
import { startCall } from "@/lib/webrtc";
import VideoCall from "./VideoCall";

export default function Chat({
  user,
  friend,
}: {
  user: ProfileType;
  friend: FriendType;
}) {
  const { messages, newMessage, setNewMessage, sendMessage, initializeChat } = useChat();
  const { inCall, setInCall, setActiveCallId } = useCall();

  useEffect(() => {
    initializeChat(user, friend);
  }, [user, friend]);

  const handleCall = async () => {
    const { callId } = await startCall(user.steamid, friend.steamid);
    setInCall(true);
    setActiveCallId(callId);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Only show video UI in chat if in call */}
      {inCall && <VideoCall currentUserId={user.steamid} friendId={friend.steamid} />}

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {messages.map((msg, i) => (
          <div key={i} className="flex items-start gap-3">
            <div>
              {msg.from === user.steamid ? (
                <>
                  <img
                    src={user.avatarfull}
                    alt={user.personaname}
                    className="w-10 h-10 rounded-full"
                  />
                  <h4 className="text-sm font-semibold text-gray-300">{user.personaname}</h4>
                </>
              ) : (
                <>
                  <img
                    src={friend.avatarfull}
                    alt={friend.personaname}
                    className="w-10 h-10 rounded-full"
                  />
                  <h4 className="text-sm font-semibold text-gray-300">{friend.personaname}</h4>
                </>
              )}
              <p className="text-sm text-gray-200">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 flex gap-2">
        <button
          onClick={handleCall}
          className="bg-green-600 px-4 py-2 rounded text-white"
        >
          Call
        </button>
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
          onClick={() => sendMessage(user.steamid, friend.steamid)}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
}