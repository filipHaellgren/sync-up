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
  const getStatusText = (personastate: number) => {
    switch (personastate) {
      case 0:
        return "Offline";
      case 1:
        return "Online";
      case 2:
        return "Busy";
      case 3:
        return "Away";
    }
  };

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
            <div className="flex flex-col">
              <span className="text-sm text-white font-semibold">
                {friend.personaname}
              </span>
              <span className="text-xs text-gray-400">
                {getStatusText(friend.personastate)}
                {friend.gameextrainfo ? ` – Playing ${friend.gameextrainfo}` : ""}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}