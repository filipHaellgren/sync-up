// app/api/user/friends/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSteamFriends } from "@/lib/steam";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const steamid = cookieStore.get("steamid")?.value;
  const apiKey = process.env.STEAM_API_KEY;

  if (!steamid || !apiKey) {
    return NextResponse.json({ error: "Unauthorized or missing API key" }, { status: 401 });
  }

  try {
    const friends = await getSteamFriends(steamid, apiKey);
    return NextResponse.json(friends);
  } catch (err) {
    console.error("Failed to fetch friends:", err);
    return NextResponse.json({ error: "Failed to fetch friends" }, { status: 500 });
  }
}