/* import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSteamProfile } from "@/lib/steam";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const steamid = cookieStore.get("steamid")?.value;
  const apiKey = process.env.STEAM_API_KEY;

  if (!steamid || !apiKey) {
    return NextResponse.json({ error: "Unauthorized or missing API key" }, { status: 401 });
  }

  try {
    const profile = await getSteamProfile(steamid, apiKey);
    return NextResponse.json(profile);
  } catch (err) {
    console.error("Steam API error:", err);
    return NextResponse.json({ error: "Failed to fetch Steam profile" }, { status: 500 });
  }
} */