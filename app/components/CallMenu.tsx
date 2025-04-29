import React from 'react'
import { FriendType, ProfileType,  } from '../styles';

import { useCall } from '../context/CallContext';

export default function CallMenu({ friend, user} : { friend: FriendType, user: ProfileType})  {

    const { startVideoCall} = useCall();

   


  return (
   <button className="bg-black text-white px-4 py-2 rounded" onClick={() => startVideoCall(user, friend)}>
    Call {friend.personaname}
   </button>
  )
}
