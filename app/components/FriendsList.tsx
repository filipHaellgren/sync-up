import { getSteamFriends } from '@/lib/steam';
import React from 'react'

export default async function FriendsList() {

    const friends = await getSteamFriends(steamid, apiKey);
  return (
    <div>
         <div className="p-4 pt-2">
            <div className='flex justify-between items-center'>
                <h2 className="text-sm text-gray-400 uppercase tracking-wide mb-2">Friends</h2>
                <h2 className="text-sm text-gray-400 uppercase tracking-wide mb-2">Groups</h2>
            </div>
                <ul className="space-y-2 mt-2">
                {friends.length > 0 ? (
                    friends.map((friend: any) => (
                    <li
                        key={friend.steamid}
                        className="flex items-center gap-2 p-2 rounded hover:bg-[#313338] cursor-pointer"
                    >
                        <img
                        src={friend.avatarfull}
                        alt={friend.personaname}
                        className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm">{friend.personaname}</span>
                    </li>
                    ))
                ) : (
                    <p className="text-sm text-gray-400">No friends found.</p>
                )}
                </ul>
            </div>
    </div>
  )
}
