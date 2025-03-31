"use client";

export default function ChatList({
  currentUserId,
  friends,
  onSelectFriend,
}: {
  currentUserId: string;
  friends: any[];
  onSelectFriend: (friendId: string) => void;
}) {
  return (
    <div className="p-4 space-y-2">
      {friends.length === 0 ? (
        <p className="text-gray-400">No friends have logged in yet.</p>
      ) : (
        friends.map((friend) => (
          <div
            key={friend.steamid}
            onClick={() => onSelectFriend(friend.steamid)}
            className="flex items-center gap-3 p-2 bg-[#313338] rounded hover:bg-[#3a3c41] cursor-pointer transition"
          >
            <img
              src={friend.avatarfull}
              alt={friend.personaname}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm text-white">{friend.personaname}</span>
          </div>
        ))
      )}
    </div>
  );
}