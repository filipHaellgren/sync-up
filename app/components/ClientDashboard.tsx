"use client";

import { useState } from "react";
import Chat from "./Chat";
import ChatList from "./ChatList";
import Profile from "./Profile";

export default function ClientDashboard({
  profile,
  friends,
}: {
  profile: any;
  friends: any[];
}) {
  const [selectedFriend, setSelectedFriend] = useState<any | null>(null);

  return (
    <div className="flex h-screen bg-[#2B2D31] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1E1F22] overflow-y-auto relative">
        <Profile profile={profile} />
        <ChatList
  currentUserId={profile.steamid}
  friends={friends} // <-- IMPORTANT!
  onSelectFriend={(id) => {
    const selected = friends.find((f) => f.steamid === id);
    setSelectedFriend(selected);
  }}
/>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        {selectedFriend ? (
          <Chat
            currentUserId={profile.steamid}
            friendId={selectedFriend.steamid}
          />
        ) : (
          <p className="text-gray-400">Select a chat to start messaging.</p>
        )}
      </main>
    </div>
  );
}