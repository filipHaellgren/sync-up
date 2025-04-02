import { getSteamSession } from "@/lib/getSteamSession";
import { getSteamProfile, getSteamFriends, getRecentlyPlayedGames } from "@/lib/steam";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import ClientDashboard from "../components/ClientDashboard";

export default async function Dashboard() {
  const session = await getSteamSession();
  if (!session) return <div className="p-6 text-red-500">Not logged in.</div>;

  const { steamid, apiKey } = session;
  const profile = await getSteamProfile(steamid, apiKey);
  const allFriends = await getSteamFriends(steamid, apiKey);
  const recentGames = await getRecentlyPlayedGames(steamid, apiKey);

  const users = await getDocs(collection(db, "users"));
  const loggedInIds = users.docs.map((user) => user.id);
  const filteredFriends = allFriends.filter((friend: any) =>
    loggedInIds.includes(friend.steamid)
  );

  return (
    <ClientDashboard
      profile={profile}
      friends={filteredFriends}
      recentGames={recentGames}
    />
  );
}