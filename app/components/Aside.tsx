import Profile from "./Profile";

export default function Aside({
  profile,
  friends,
  setSelectedFriend,
}: {
  profile: any;
  friends: any[];
  setSelectedFriend: (f: any) => void;
}) {
  return (
    <aside className="bg-[#1E1F22] overflow-y-auto w-[30vw]">
      <Profile profile={profile} />

      <div className="p-4 pt-2">
        <h2 className="text-sm text-gray-400 uppercase tracking-wide mb-2">Friends</h2>
        <ul className="space-y-2 mt-2">
          {friends.map((friend: any) => (
            <li
              key={friend.steamid}
              onClick={() => setSelectedFriend(friend)}
              className="flex items-center gap-2 p-2 rounded hover:bg-[#313338] cursor-pointer"
            >
              <img
                src={friend.avatarfull}
                alt={friend.personaname}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm">{friend.personaname}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}