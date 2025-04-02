// components/Sidebar.tsx
import Profile from "./Profile";
import ChatList from "./ChatList";
import { FriendType, ProfileType } from "../styles";

export default function Sidebar({
  profile,
  friends,
  onSelectFriend,
}: {
  profile:  ProfileType;
  friends: FriendType[];
  onSelectFriend: (friendId: string | undefined) => void;
  
}) {
  return (
    <aside className="w-64 bg-[#1E1F22] overflow-y-auto relative">
      <Profile profile={profile} />
      <ChatList
        friends={friends}
        onSelectFriend={(id) => {
          const selectedFriend = friends.find((friend) => friend.steamid === id);
          onSelectFriend(selectedFriend?.steamid); 
        }}
      />
    </aside>
  );
}