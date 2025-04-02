import { FriendType } from "@/app/styles";

export async function getSteamProfile(steamid: string, apiKey: string) {
    const res = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamid}`
    );
    const data = await res.json();
    return data.response.players[0] || null;
  }
  
  export async function getSteamFriends(steamid: string, apiKey: string) {
    const friendsRes = await fetch(
      `https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key=${apiKey}&steamid=${steamid}`
    );
    const friendsList = await friendsRes.json();
    const friendIds = friendsList?.friendslist?.friends?.map((friend: FriendType) => friend.steamid).join(",");
  
    if (!friendIds) return [];
  
    const detailsRes = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${friendIds}`
    );
    const details = await detailsRes.json();
  
    return details.response.players || [];
  }
  export async function getOwnedGames(steamid: string, apiKey: string) {
    const res = await fetch(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamid}&include_appinfo=true`
    );
    const data = await res.json();
    return data.response.games || [];
  }

  export async function getRecentlyPlayedGames(steamid: string, apiKey: string) {
    const res = await fetch(
      `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${apiKey}&steamid=${steamid}`
    );
    const data = await res.json();
    return data.response.games || [];
  }