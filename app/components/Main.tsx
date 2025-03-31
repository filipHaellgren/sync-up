import LogoutButton from "./LogOutButton";
import Chat from "./Chat";
import { ProfileType } from "../types";

export default function Main({
  profile,
  selectedFriend,
}: {
  profile: ProfileType;
  selectedFriend: any | null;
}) {
  if (!selectedFriend) {
    return <div className="p-6 text-gray-400">Select a friend to start chatting</div>;
  }

  return (
    <main className="flex-1  overflow-y-auto w-[70vw]  h-screen">
      <LogoutButton />
      <Chat currentUserId={profile.steamid} friendId={selectedFriend.steamid} />
    </main>
  );
}