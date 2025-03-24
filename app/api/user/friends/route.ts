// app/api/user/friends/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const steamid = cookieStore.get("steamid")?.value;
  const apiKey = process.env.STEAM_API_KEY;

  if (!steamid || !apiKey) {
    return NextResponse.json({ error: "Unauthorized or missing API key" }, { status: 401 });
  }

  try {
    const friendsRes = await fetch(
      `https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key=${apiKey}&steamid=${steamid}`
    );
    const friendsList = await friendsRes.json();
    const friendIds = friendsList?.friendslist?.friends?.map((f: any) => f.steamid).join(",");

    if (!friendIds) return NextResponse.json([]);

    const detailsRes = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${friendIds}`
    );
    const details = await detailsRes.json();

    return NextResponse.json(details.response.players || []);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch friends" }, { status: 500 });
  }
}