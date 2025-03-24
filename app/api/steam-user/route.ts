import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const steamid = searchParams.get("steamid");

  if (!steamid) {
    return NextResponse.json({ error: "Steam ID is required" }, { status: 400 });
  }

  const STEAM_API_KEY = process.env.STEAM_API_KEY;

  try {
    const fetchJson = async (url: string) => {
      console.log(`🔗 Fetching: ${url}`);
      const response = await fetch(url);
      const data = await response.json();
      console.log(`✅ Response from Steam API (${url}):`, data);
      return data;
    };

    // 🚀 Fetch user's profile
    const profileUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&steamids=${steamid}`;
    const profileData = await fetchJson(profileUrl);

    // 🚀 Fetch friends list (only Steam IDs)
    const friendsUrl = `https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key=${STEAM_API_KEY}&steamid=${steamid}`;
    const friendsData = await fetchJson(friendsUrl);

    let friendsDetails = [];
    if (friendsData?.friendslist?.friends) {
      const friendsIds = friendsData.friendslist.friends.map((f: any) => f.steamid).join(",");
      
      // 🚀 Fetch friends' profiles (but NOT Steam levels)
      const friendsProfilesUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&steamids=${friendsIds}`;
      const friendsProfilesData = await fetchJson(friendsProfilesUrl);

      friendsDetails = friendsProfilesData?.response?.players || [];
    }

    // 🚀 Fetch owned games
    const gamesUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${STEAM_API_KEY}&steamid=${steamid}&include_appinfo=true`;
    const gamesData = await fetchJson(gamesUrl);

    return NextResponse.json({
      profile: profileData?.response?.players[0] || null,
      friends: friendsDetails,
      games: gamesData?.response?.games || [],
    });
  } catch (error) {
    console.error("🔥 Error fetching Steam data:", error);
    return NextResponse.json({ error: "Failed to fetch Steam data" }, { status: 500 });
  }
}