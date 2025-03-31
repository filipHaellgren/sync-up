import { getSteamProfile, getSteamFriends } from "@/lib/steam";
import { getSteamSession } from "@/lib/getSteamSession";
import ClientDashboard from "../components/ClientDashboard";
import { db } from "@/lib/firebase";
import { getDocs, collection } from "firebase/firestore";

export default async function Dashboard() {
  const session = await getSteamSession();
  if (!session) return <div className="p-6 text-red-500">Not logged in.</div>;

  const { steamid, apiKey } = session;
  const profile = await getSteamProfile(steamid, apiKey);
  const friends = await getSteamFriends(steamid, apiKey);

  // 🔥 Get all users from Firestore
  const snapshot = await getDocs(collection(db, "users"));
  const loggedInSteamIds = snapshot.docs.map((doc) => doc.id);

  // ✅ Only show friends that exist in Firestore
  const filteredFriends = friends.filter((friend: any) =>
    loggedInSteamIds.includes(friend.steamid)
  );

  return <ClientDashboard profile={profile} friends={filteredFriends} />;
}