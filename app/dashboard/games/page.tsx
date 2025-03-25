import { cookies } from "next/headers";
import { getOwnedGames } from "@/lib/steam";

export default async function GamesPage() {
  const cookieStore = await cookies();
  const steamid = cookieStore.get("steamid")?.value;
  const apiKey = process.env.STEAM_API_KEY;

  if (!steamid || !apiKey) {
    return <div className="p-6 text-red-500">Not logged in or missing API key.</div>;
  }

  const games = await getOwnedGames(steamid, apiKey);

  return (
    <div className="h-screen bg-[#2B2D31] text-white p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">Owned Games</h1>

      {games.length > 0 ? (
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