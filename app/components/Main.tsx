import LogoutButton from "./LogOutButton";
import Chat from "./Chat";

export default function Main({
  profile,
  selectedFriend,
}: {
  profile: any;
  selectedFriend: any | null;
}) {
  if (!selectedFriend) {
    return <div className="p-6 text-gray-400">Select a friend to start chatting</div>;
  }

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <Chat currentUserId={profile.steamid} friendId={selectedFriend.steamid} />
      <LogoutButton />
    </main>
  );
}