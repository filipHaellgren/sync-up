"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [friends, setFriends] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/user").then((res) => res.json()),
      fetch("/api/user/friends").then((res) => res.json()),
    ])
      .then(([userProfile, userFriends]) => {
        if (userProfile.error) return setError(userProfile.error);
        setProfile(userProfile);
        setFriends(userFriends);
      })
      .catch((err) => {
        console.error("Failed to load dashboard data:", err);
        setError("Could not load Steam data.");
      });
  }, []);

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!profile) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="flex h-screen bg-[#2B2D31] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1E1F22] overflow-y-auto relative">
        {/* Sticky Profile */}
        <div className="sticky top-0 z-20 bg-[#1E1F22] p-4 border-b border-[#313338]">
          <Link href="/dashboard/games">
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition">
              <img
                src={profile.avatarfull}
                alt={profile.personaname}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{profile.personaname}</p>
                <p className="text-xs text-gray-400">Steam ID: {profile.steamid}</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Friends List */}
        <div className="p-4 pt-2">
          <h2 className="text-sm text-gray-400 uppercase tracking-wide mb-2">Friends</h2>
          <ul className="space-y-2 mt-2">
            {friends.length > 0 ? (
              friends.map((friend: any) => (
                <li
                  key={friend.steamid}
                  className="flex items-center gap-2 p-2 rounded hover:bg-[#313338] cursor-pointer"
                >
                  <img
                    src={friend.avatarfull}
                    alt={friend.personaname}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm">{friend.personaname}</span>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-400">No friends found.</p>
            )}
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-400">Click your profile in the sidebar to view games.</p>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Main Content</h2>
          <p className="text-sm text-gray-400">This area could show news, game recs, etc.</p>
        </div>

        <button
          onClick={() => (window.location.href = "/api/logout")}
          className="mt-8 bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
        >
          Logout
        </button>
      </main>
    </div>
  );
}