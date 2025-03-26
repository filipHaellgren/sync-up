import { cookies } from "next/headers";

export async function getSteamSession() {
  const cookieStore = await cookies();
  const steamid = cookieStore.get("steamid")?.value;
  const apiKey = process.env.STEAM_API_KEY;

  if (!steamid || !apiKey) {
    return null;
  }

  return { steamid, apiKey };
}