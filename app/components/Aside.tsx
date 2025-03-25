import React from 'react'
import Profile from './Profile'
import FriendsList from './FriendsList'


export default function Aside({ userData }) {

  
    return (
      <aside
        className={`bg-[#1E1F22] overflow-y-auto relative sm:"w-[100vw]" "w-[30vw]" 
        }`}
      >
        {/* Sticky Profile */}
        <Profile userData={userData} />
  
        {/* Friends List */}
        <FriendsList userData={userData} />
      </aside>
    );
  }
