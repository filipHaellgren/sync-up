import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    console.log("🚀 Steam OpenID Response:", url.searchParams);

    const steamIdMatch = url.searchParams.get("openid.claimed_id")?.match(/\d+$/);
    if (!steamIdMatch) {
      console.error("❌ Invalid Steam OpenID response:", url.searchParams);
      return NextResponse.json({ error: "Invalid Steam response" }, { status: 400 });
    }

    const steamId = steamIdMatch[0];
    console.log("✅ Extracted Steam ID:", steamId);

    // ✅ Fetch user profile from Steam API
    const apiKey = process.env.STEAM_API_KEY;
    const profileRes = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`
    );
    const profileData = await profileRes.json();
    const profile = profileData.response.players[0];

    if (!profile) {
      console.error("❌ Failed to fetch Steam profile");
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }

    // ✅ Save to Firestore
    await setDoc(doc(db, "users", steamId), {
      steamid: steamId,
      personaname: profile.personaname,
      avatar: profile.avatarfull,
      lastLogin: serverTimestamp(),
    });

    // ✅ Set session cookie
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`);
    response.headers.set("Set-Cookie", `steamid=${steamId}; Path=/; HttpOnly; Secure; SameSite=Lax`);

    return response;
  } catch (error) {
    console.error("🔥 Steam Authentication Error:", error);
    return NextResponse.json({ error: "Failed to authenticate with Steam" }, { status: 500 });
  }
}