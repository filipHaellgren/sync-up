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

  const snapshot = await getDocs(collection(db, "users"));
  const loggedInIds = snapshot.docs.map((doc) => doc.id);
  const filteredFriends = allFriends.filter((f: any) =>
    loggedInIds.includes(f.steamid)
  );

  return (
    <ClientDashboard
      profile={profile}
      friends={filteredFriends}
      recentGames={recentGames}
    />
  );
}