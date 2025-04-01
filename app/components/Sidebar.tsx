// components/Sidebar.tsx
import Profile from "./Profile";
import ChatList from "./ChatList";

export default function Sidebar({
  profile,
  friends,
  onSelectFriend,
}: {
  profile: any;
  friends: any[];
  onSelectFriend: (friendId: string) => void;
}) {
  return (
    <aside className="w-64 bg-[#1E1F22] overflow-y-auto relative">
      <Profile profile={profile} />
      <ChatList
        currentUserId={profile.steamid}
        friends={friends}
        onSelectFriend={(id) => {
          const selected = friends.find((f) => f.steamid === id);
          onSelectFriend(selected);
        }}
      />
    </aside>
  );
}