"use client";

import { useEffect, useState } from "react";

export default function GamesPage() {
  const [games, setGames] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/steam-session")
      .then((res) => res.json())
      .then((data) => {
        if (!data.steamid) {
          setError("No Steam ID found.");
          return;
        }
        fetch(`/api/steam-user?steamid=${data.steamid}`)
          .then((res) => res.json())
          .then((user) => setGames(user.games || []))
          .catch(() => setError("Could not load games."));
      })
      .catch(() => setError("Session error."));
  }, []);

  return (
    <div className="h-screen bg-[#2B2D31] text-white p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">Owned Games</h1>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : games.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {games.map((game: any) => (
            <div key={game.appid} className="bg-[#1E1F22] rounded-lg p-2">
              <img
                src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/capsule_184x69.jpg`}
                alt={game.name}
                className="w-full rounded"
              />
              <p className="text-xs mt-2 text-center">{game.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No games found.</p>
      )}
    </div>
  );
}