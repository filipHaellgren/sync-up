import { getSteamProfile } from "@/lib/steam";
import { getSteamSession } from "@/lib/getSteamSession";
import Link from "next/link";

export default async function Profile() {
  const session = await getSteamSession();

  if (!session) {
    return (
      <div className="p-4 text-red-500 text-sm border-b border-[#313338]">
        Not logged in.
      </div>
    );
  }

  const { steamid, apiKey } = session;
  const profile = await getSteamProfile(steamid, apiKey);

  return (
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
  );
}
