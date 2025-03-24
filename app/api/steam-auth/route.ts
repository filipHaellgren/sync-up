import { NextRequest, NextResponse } from "next/server";

const STEAM_OPENID_URL = "https://steamcommunity.com/openid/login";

export async function GET(req: NextRequest) {
  try {
    // ✅ Ensure `return_to` uses 127.0.0.1 instead of localhost
    const returnTo = `${process.env.NEXT_PUBLIC_BASE_URL}/api/steam-callback`;

    // ✅ Manually encode the URL correctly
    const authUrl = `${STEAM_OPENID_URL}?` +
      new URLSearchParams({
        "openid.ns": "http://specs.openid.net/auth/2.0",
        "openid.mode": "checkid_setup",
        "openid.return_to": returnTo,
        "openid.realm": process.env.NEXT_PUBLIC_BASE_URL!,
        "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
        "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
      }).toString();

    console.log("🔗 Redirecting to Steam Login:", authUrl);
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("❌ Steam Auth Error:", error);
    return NextResponse.json({ error: "Failed to redirect to Steam login" }, { status: 500 });
  }
}