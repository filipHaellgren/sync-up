import { cookies } from "next/headers";
import { getSteamProfile, getSteamFriends } from "@/lib/steam";
import Aside from "../components/Aside";
import Main from "../components/Main";



export default async function Dashboard() {
  const cookieStore = await cookies(); // ✅ Await it
  const steamid = cookieStore.get("steamid")?.value;
  const apiKey = process.env.STEAM_API_KEY;

  if (!steamid || !apiKey) {
    return <div className="p-6 text-red-500">Not logged in.</div>;
  }

  const profile = await getSteamProfile(steamid, apiKey);
  const friends = await getSteamFriends(steamid, apiKey);

  return (
    <div className=" md:flex h-screen bg-[#2B2D31] text-white">     
  <Aside userData={userData} />
  <div className="hidden sm:block">
  <Main />
</div>
    </div>
  );
}