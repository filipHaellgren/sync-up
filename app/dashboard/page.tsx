// app/dashboard/page.tsx
import { getSteamProfile, getSteamFriends } from "@/lib/steam";
import { getSteamSession } from "@/lib/getSteamSession";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import ClientDashboard from "../components/ClientDashboard";

export default async function Dashboard() {
  const session = await getSteamSession();
  if (!session) return <div className="p-6 text-red-500">Not logged in.</div>;

  const { steamid, apiKey } = session;

  // 1. Get your Steam profile
  const profile = await getSteamProfile(steamid, apiKey);

  // 2. Get your Steam friends
  const allSteamFriends = await getSteamFriends(steamid, apiKey);
  console.log("🔍 Steam friends:", allSteamFriends.map(f => f.steamid));

  // 3. Get all logged-in users from Firebase
  const snapshot = await getDocs(collection(db, "users"));
  const loggedInUserIds = snapshot.docs.map((doc) => doc.id);
  console.log("✅ Firebase users:", loggedInUserIds);

  // 4. Filter only mutual friends (Steam + logged in)
  const mutualFriends = allSteamFriends.filter((f: any) =>
    loggedInUserIds.includes(f.steamid)
  );
  console.log("🧑‍🤝‍🧑 Mutual friends:", mutualFriends.map(f => `${f.personaname} (${f.steamid})`));
  return <ClientDashboard profile={profile} friends={mutualFriends} />;
}