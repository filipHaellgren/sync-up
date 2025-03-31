"use client";

import { useState } from "react";
import Aside from "./Aside";
import Main from "./Main";

export default function ClientDashboard({ profile, friends }: { profile: any; friends: any[] }) {
  const [selectedFriend, setSelectedFriend] = useState<any | null>(null);

  return (
    <div className="md:flex h-screen bg-[#2B2D31] text-white">
      <Aside profile={profile} friends={friends} setSelectedFriend={setSelectedFriend} />
      <div className="hidden sm:block">
        <Main profile={profile} selectedFriend={selectedFriend} />
      </div>
    </div>
  );
}