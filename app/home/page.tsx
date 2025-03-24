"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SteamUser {
  steamid: string;
  personaname: string;
  avatarfull: string;
  profileurl: string;
  realname?: string;
  loccountrycode?: string;
  timecreated?: number;
  communityvisibilitystate?: number;
  personastate?: number;
  gameextrainfo?: string;
  gameid?: string;
}

export default function Home() {
  const searchParams = useSearchParams();
  const steamid = searchParams.get("steamid");
  const [userData, setUserData] = useState<SteamUser | null>(null);

  useEffect(() => {
    if (steamid) {
      fetch(`/api/steam-user?steamid=${steamid}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.response.players.length > 0) {
            setUserData(data.response.players[0]);
          }
        })
        .catch((err) => console.error("Error fetching Steam user:", err));
    }
  }, [steamid]);

  if (!steamid) return <p>No Steam ID found. Please log in.</p>;

  return (
    <div className="p-6">
      {userData ? (
        <>
          <h1 className="text-xl font-bold">Welcome, {userData.personaname}</h1>
          <img src={userData.avatarfull} alt="Avatar" className="rounded-full w-24 h-24" />
          <p><strong>Real Name:</strong> {userData.realname || "N/A"}</p>
          <p><strong>Steam ID:</strong> {userData.steamid}</p>
          <p><strong>Profile:</strong> <a href={userData.profileurl} target="_blank" rel="noopener noreferrer" className="text-blue-500">View Steam Profile</a></p>
        </>
      ) : (
        <p>Loading Steam data...</p>
      )}
    </div>
  );
}