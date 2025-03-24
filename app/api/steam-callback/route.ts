import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

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

    // 🚀 Fix: Use a Set-Cookie header instead of `cookies().set()`
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`);
    response.headers.set("Set-Cookie", `steamid=${steamId}; Path=/; HttpOnly; Secure; SameSite=Lax`);

    return response;
  } catch (error) {
    console.error("🔥 Steam Authentication Error:", error);
    return NextResponse.json({ error: "Failed to authenticate with Steam" }, { status: 500 });
  }
}