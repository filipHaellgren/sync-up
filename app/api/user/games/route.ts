// app/api/user/games/route.ts
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
    const res = await fetch(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamid}&include_appinfo=true`
    );
    const data = await res.json();

    return NextResponse.json(data.response.games || []);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
  }
}